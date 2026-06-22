const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// ✅ Initialize the official @google/genai SDK once at the top
const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to issue JSON Web Tokens
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// 🔑 1. LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    if (!user.isVerified) {
      return res.status(403).json({ 
        error: 'Please verify your email address using the OTP code sent during signup before logging in.' 
      });
    }
    const token = createToken(user._id);
    res.status(200).json({ email, token, role: user.role, plan: user.plan });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 📝 2. SIGNUP USER
const signupUser = async (req, res) => {
  const { username, email, password, requestedRole } = req.body;
  
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.signup(username, email, password);
    
    if (
      requestedRole === 'admin' || 
      email.endsWith('@4fitnessadmin.com') || 
      email === 'ceo@4fitness.com'
    ) {
      user.role = 'admin'; 
    } else {
      user.role = 'client'; 
    }

    user.verificationCode = verificationCode;
    user.isVerified = false;
    await user.save();
    
    try {
      await sendEmail(email, "Verify Your 4 FITNESS Account", verificationCode);
    } catch (mailError) {
      console.log("Email transport offline. Use this code to verify manually:", verificationCode);
    }

    res.status(200).json({ 
      email, 
      code: verificationCode, 
      message: "Signup successful! [DEV MODE] Code generated: " + verificationCode 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✉️ 3. VERIFY OTP CODE
const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }
    if (String(user.verificationCode) !== String(code)) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();
    res.status(200).json({ email, message: "Account verified successfully! Routing back to login page." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🤖 4. AI-ASSISTED CLIENT GRADING
const gradeClientPerformance = async (req, res) => {
  const { clientId, workoutMetrics, dietMetrics } = req.body;

  try {
    const targetUser = await User.findById(clientId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Client account not found' });
    }

    const prompt = `
      You are the elite head AI coach and nutritionist for the fitness brand "4 FITNESS".
      Analyze these raw input parameters and generate custom structural recommendations according to the schema:
      - Client Profile Under Evaluation: ${targetUser.email}
      - Training Load Log Metrics: "${workoutMetrics}"
      - Nutrition & Macro Intake Metrics: "${dietMetrics}"

      Generate tactical workout programming modifications and micro adjustments based on these parameters.
    `;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            trainingAdvice: { 
              type: 'STRING', 
              description: 'Tactical exercise programming adjustments to optimize performance structural limitations.' 
            },
            dietRecommendation: { 
              type: 'STRING', 
              description: 'Specific performance foods and macro adjustments tailored to this current athletic status.' 
            }
          },
          required: ['trainingAdvice', 'dietRecommendation']
        }
      }
    });

    const aiTextOutput = response.text || "{}";
    const aiData = JSON.parse(aiTextOutput);

    // Live sync update configuration path
    targetUser.performance = {
      strengthGrade: 0, 
      weaknessNotes: workoutMetrics,
      aiTrainingAdvice: aiData.trainingAdvice || "Analyzing metrics...",
      aiDietRecommendation: aiData.dietRecommendation || "Building layouts..."
    };
    
    targetUser.performanceAnalysis = aiData;
    await targetUser.save();

    res.status(200).json({
      success: true,
      performanceAnalysis: aiData,
      user: {
        _id: targetUser._id,
        email: targetUser.email,
        role: targetUser.role,
        performance: targetUser.performance
      }
    });

  } catch (error) {
    console.error("AI Generation Engine Mismatch Failure:", error.message);
    
    if (error.message.includes('503') || error.message.includes('UNAVAILABLE') || error.message.includes('demand')) {
      try {
        const fallbackData = {
          trainingAdvice: `[SYSTEM FALLBACK NOTE: AI Server Busy] Based on your metric log: "${workoutMetrics}", focus on compound execution consistency and form stabilization under fatigue tracking metrics.`,
          dietRecommendation: `[SYSTEM FALLBACK NOTE: AI Server Busy] Based on nutrition parameters: "${dietMetrics}", sustain current caloric thresholds while prioritizing hydration index variables.`
        };

        const updatedUser = await User.findByIdAndUpdate(
          clientId,
          {
            $set: {
              'performance.strengthGrade': 0, 
              'performance.weaknessNotes': workoutMetrics || "No notes provided",
              'performance.aiTrainingAdvice': fallbackData.trainingAdvice,
              'performance.aiDietRecommendation': fallbackData.dietRecommendation,
              'performanceAnalysis': fallbackData
            }
          },
          { new: true }
        ).select('email role plan performance');

        if (updatedUser) {
          return res.status(200).json({
            success: true,
            isFallback: true,
            performanceAnalysis: fallbackData,
            user: updatedUser
          });
        }
      } catch (dbErr) {
        console.error("Database Save Error during Fallback:", dbErr.message);
        return res.status(500).json({ error: `Fallback DB Sync Fail: ${dbErr.message}` });
      }
    }

    res.status(400).json({ error: error.message });
  }
};

// ✍️ 5. MANUAL ADMINISTRATIVE PROFILE GRADING
const gradeUserProfile = async (req, res) => {
  const { id } = req.params;
  const { grade, feedback } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          aiAnalysis: {
            grade,
            feedback,
            updatedAt: new Date()
          }
        }
      },
      { new: true } 
    ).select('-password'); 

    if (!updatedUser) {
      return res.status(404).json({ error: "Target operational profile not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Failed to update target user grading files." });
  }
};

// 👤 6. GET CURRENT USER PROFILE (Absolute Direct DB Sync Fetch)
const getUserProfile = async (req, res) => {
  try {
    // Force a lean, non-cached direct query straight out of the database collections
    const fullUserDoc = await User.findById(req.user._id).lean();

    if (!fullUserDoc) {
      return res.status(404).json({ error: 'User workspace records not found.' });
    }

    // 🔍 SERVER CONSOLE DIAGNOSTIC
    console.log("=== LIVE USER DOC FROM DB ===");
    console.log("Keys found:", Object.keys(fullUserDoc));
    if(fullUserDoc.performance) console.log("Performance sub-keys:", Object.keys(fullUserDoc.performance));
    console.log("=============================");

    res.status(200).json(fullUserDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📋 7. GET ALL CLIENTS
const getAllProfiles = async (req, res) => {
  try {
    const users = await User.find({ role: 'client' }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: "Could not fetch clients list matrix." });
  }
};

// 🤖 8. AUTOMATIC FEEDBACK HANDLER
const generateAutomaticClientFeedback = async (req, res) => {
  const { metrics, weight, primaryGoal } = req.body;

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this athlete performance profile. Weight: ${weight}kg, Goal: ${primaryGoal}, Metrics Array data details: ${metrics}. Give detailed diagnostic meal advice and workout optimization notes in under 3 sentences.`
    });

    res.status(200).json({ feedback: response.text });
  } catch (error) {
    res.status(500).json({ error: "AI breakdown engine model extraction failure." });
  }
};

// 📦 UNIFIED EXPORT MODULE
module.exports = {
  loginUser,
  signupUser,
  verifyEmailCode,
  gradeClientPerformance,
  gradeUserProfile,
  getUserProfile,
  getAllProfiles,
  generateAutomaticClientFeedback
};