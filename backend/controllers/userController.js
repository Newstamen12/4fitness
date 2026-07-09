const { User, Swot } = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');

const adminAllowList = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const isAllowedAdminEmail = (email) => {
  return adminAllowList.includes(String(email || '').trim().toLowerCase());
};

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

    // ⚡ Dynamic admin assignment override
    let activeRole = user.role;
    if (isAllowedAdminEmail(email) && user.role !== 'admin') {
      user.role = 'admin';
      await user.save(); // Permanently save the role change to MongoDB
      activeRole = 'admin';
    }

    const token = createToken(user._id);
    res.status(200).json({ email, token, role: activeRole, plan: user.plan, username: user.username });
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
    
    if (requestedRole === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (!existingAdmin || isAllowedAdminEmail(email)) {
        user.role = 'admin';
      } else {
        return res.status(403).json({
          error: 'Admin registration is currently restricted. Contact the site owner to request administrative access.'
        });
      }
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

// 🔐 4. REQUEST PASSWORD RESET
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: 'If that email exists, a reset code was sent.' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.passwordResetCode = resetCode;
    user.passwordResetExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    await sendEmail(email, '4 FITNESS Password Reset Code', `Your password reset code is: ${resetCode}`);

    res.status(200).json({ message: 'If that email exists, a reset code was sent.' });
  } catch (error) {
    console.error('Password reset request failed:', error);
    res.status(500).json({ error: 'Failed to initiate password reset.' });
  }
};

// 🔐 5. COMPLETE PASSWORD RESET
const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid password reset request.' });
    }

    if (!user.passwordResetCode || String(user.passwordResetCode) !== String(code)) {
      return res.status(400).json({ error: 'Invalid or expired reset code.' });
    }

    if (!user.passwordResetExpiry || user.passwordResetExpiry < Date.now()) {
      return res.status(400).json({ error: 'Reset code has expired.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetCode = null;
    user.passwordResetExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Your password has been reset successfully. Please sign in.' });
  } catch (error) {
    console.error('Password reset failed:', error);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
};

// 🤖 6. AI-ASSISTED CLIENT GRADING
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
        },
        $push: {
          gradeHistory: {
            grade,
            feedback,
            ratedBy: 'Admin',
            ratedAt: new Date()
          }
        }
      },
      { new: true } 
    ).select('-password'); 

    if (!updatedUser) {
      return res.status(404).json({ error: "Target operational profile not found." });
    }

    // Send email notification if client has opt-in
    if (updatedUser.emailNotifications?.onGradeUpdate && updatedUser.email) {
      try {
        await sendEmail(
          updatedUser.email,
          "Your 4 FITNESS Performance Review is Ready",
          `Hi ${updatedUser.username},\n\nYour coach has reviewed your performance!\n\nGrade: ${grade}\n\nFeedback: ${feedback}\n\nLog in to your dashboard to view full details.\n\n- 4 FITNESS Team`
        );
      } catch (emailErr) {
        console.log("Email notification failed for user:", updatedUser.email, emailErr.message);
      }
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Failed to update target user grading files." });
  }
};

// 👤 6. GET CURRENT USER PROFILE
const getUserProfile = async (req, res) => {
  try {
    const fullUserDoc = await User.findById(req.user._id).lean();

    if (!fullUserDoc) {
      return res.status(404).json({ error: 'User workspace records not found.' });
    }

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

// 📊 9. ADMINISTRATIVE SWOT ANALYSIS HANDLERS
const saveClientSwot = async (req, res) => {
  const { userId, strengths, weaknesses, opportunities, threats } = req.body;
  try {
    let swot = await Swot.findOneAndUpdate(
      { userId },
      { strengths, weaknesses, opportunities, threats, evaluatedBy: 'Admin' },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: swot });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deploy SWOT metrics matrix' });
  }
};

const getClientSwot = async (req, res) => {
  try {
    const swot = await Swot.findOne({ userId: req.params.userId });
    res.status(200).json(swot || { strengths: '', weaknesses: '', opportunities: '', threats: '' });
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving matrix' });
  }
};

// 🎯 10. SET FITNESS GOALS (ADMIN)
const setClientGoals = async (req, res) => {
  const { clientId, title, description, target, deadline } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      clientId,
      {
        $push: {
          goals: {
            title,
            description,
            target,
            deadline: deadline ? new Date(deadline) : null,
            status: 'active',
            setBy: 'Admin',
            createdAt: new Date()
          }
        }
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Send notification if enabled
    if (updatedUser.emailNotifications?.onGoalSet && updatedUser.email) {
      try {
        await sendEmail(
          updatedUser.email,
          "New Fitness Goal Set for You",
          `Hi ${updatedUser.username},\n\nYour coach has set a new goal:\n\nTitle: ${title}\nTarget: ${target}\nDeadline: ${deadline || 'Open'}\n\n${description}\n\nLog in to track your progress!\n\n- 4 FITNESS Team`
        );
      } catch (emailErr) {
        console.log("Goal notification email failed:", emailErr.message);
      }
    }

    res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set goal' });
  }
};

// 🎯 11. UPDATE GOAL STATUS (CLIENT OR ADMIN)
const updateGoalStatus = async (req, res) => {
  const { clientId, goalId, status } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      clientId,
      {
        $set: {
          'goals.$[elem].status': status,
          'goals.$[elem].updatedAt': new Date()
        }
      },
      {
        arrayFilters: [{ 'elem._id': goalId }],
        new: true
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'Client or goal not found' });
    }

    res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
};

// 📊 12. CLIENT PERFORMANCE DASHBOARD (GET ALL PERFORMANCE DATA)
const getClientDashboard = async (req, res) => {
  try {
    const clientId = req.params.clientId || req.user._id;
    const client = await User.findById(clientId).select('-password');

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Get SWOT data if exists
    const swot = await Swot.findOne({ userId: clientId });

    const dashboardData = {
      username: client.username,
      email: client.email,
      plan: client.plan,
      currentGrade: client.aiAnalysis?.grade,
      currentFeedback: client.aiAnalysis?.feedback,
      gradeHistory: client.gradeHistory || [],
      goals: client.goals || [],
      swot: swot || { strengths: '', weaknesses: '', opportunities: '', threats: '' },
      emailNotifications: client.emailNotifications || { onGradeUpdate: true, onFeedback: true, onGoalSet: true }
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// 📧 13. UPDATE EMAIL NOTIFICATION PREFERENCES
const updateNotificationPreferences = async (req, res) => {
  const { onGradeUpdate, onFeedback, onGoalSet } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          emailNotifications: {
            onGradeUpdate: onGradeUpdate !== undefined ? onGradeUpdate : true,
            onFeedback: onFeedback !== undefined ? onFeedback : true,
            onGoalSet: onGoalSet !== undefined ? onGoalSet : true
          }
        }
      },
      { new: true }
    ).select('-password');

    res.status(200).json({ success: true, emailNotifications: updatedUser.emailNotifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};

// 📦 UNIFIED EXPORT MODULE
module.exports = {
  loginUser,
  signupUser,
  verifyEmailCode,
  requestPasswordReset,
  resetPassword,
  gradeClientPerformance,
  gradeUserProfile,
  getUserProfile,
  getAllProfiles,
  generateAutomaticClientFeedback,
  saveClientSwot,
  getClientSwot,
  setClientGoals,
  updateGoalStatus,
  getClientDashboard,
  updateNotificationPreferences
};