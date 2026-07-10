const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, content) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
      }
    });

    // Clean check: check if content is an object with a type flag, else it's an OTP text string
    const payloadType = (typeof content === 'object' && content !== null) ? content.type : 'otp';

    let htmlTemplate = '';

    // 🎯 LAYOUT A: Fitness Goal Allocations
    if (payloadType === 'goal') {
      htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 25px; border: 1px solid #e5e5e5; border-radius: 12px; color: #262626; background-color: #fafafa;">
          <h2 style="color: #3b82f6; font-size: 20px; text-transform: uppercase; margin-bottom: 5px;">🎯 4 FITNESS // NEW TARGET ASSIGNED</h2>
          <p style="font-size: 14px; color: #555;">Your training coach has added a new active goal objective to your file matrix.</p>
          <hr style="border: 0; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
          
          <p style="font-size: 14px; font-weight: bold; color: #3b82f6; margin-bottom: 4px;">GOAL OBJECTIVE:</p>
          <div style="background: #ffffff; padding: 15px; border-left: 4px solid #3b82f6; font-size: 14px; border-radius: 6px; border: 1px solid #eee; margin-bottom: 20px;">
            <strong style="font-size: 16px;">${content.title}</strong><br/>
            <span style="color: #666;">Target: ${content.target}</span><br/>
            <span style="color: #999; font-size: 12px;">Deadline: ${content.deadline || 'Open'}</span>
          </div>

          <p style="font-size: 14px; font-weight: bold; color: #555; margin-bottom: 4px;">STRATEGY SPECIFICATIONS:</p>
          <div style="background: #ffffff; padding: 15px; font-size: 13px; border-radius: 6px; border: 1px solid #eee; white-space: pre-wrap;">${content.description}</div>
          
          <br />
          <p style="font-size: 13px; color: #666; text-align: center; margin-top: 20px;">Log in to your 4 FITNESS Workspace to track your milestone progress.</p>
        </div>
      `;
    } 
    // 💪 LAYOUT B: Performance Matrix Reports (AI or Manual Reviews)
    else if (payloadType === 'performance') {
      htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 25px; border: 1px solid #e5e5e5; border-radius: 12px; color: #262626; background-color: #fafafa;">
          <h2 style="color: #f43f5e; font-size: 20px; text-transform: uppercase; margin-bottom: 5px;">4 FITNESS // PERFORMANCE REPORT</h2>
          <p style="font-size: 14px; color: #555;">Your training strategist has compiled and committed your latest phase metrics variables.</p>
          <hr style="border: 0; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
          
          <p style="font-size: 13px; font-weight: bold; color: #f43f5e; margin-bottom: 4px;">💪 WORKOUT METRICS & FEEDBACK:</p>
          <div style="background: #ffffff; padding: 15px; border-left: 4px solid #f43f5e; font-family: monospace; font-size: 13px; border-radius: 6px; border: 1px solid #eee; margin-bottom: 20px; white-space: pre-wrap;">
            ${content.workoutMetrics || 'No active training records submitted.'}
          </div>

          <p style="font-size: 13px; font-weight: bold; color: #f59e0b; margin-bottom: 4px;">🌱 NUTRITION & FUEL MATRIX:</p>
          <div style="background: #ffffff; padding: 15px; border-left: 4px solid #f59e0b; font-family: monospace; font-size: 13px; border-radius: 6px; border: 1px solid #eee; white-space: pre-wrap;">
            ${content.dietMetrics || 'No nutritional indicators tracked.'}
          </div>

          <br />
          <p style="font-size: 13px; color: #666; text-align: center; margin-top: 20px;">Log in to your 4 FITNESS Workspace to check historical milestone trajectories.</p>
        </div>
      `;
    } 
    // 🔑 LAYOUT C: Secure Registration Verification Code (OTP)
    else {
      // If content was passed as an object containing the code extract it, otherwise use raw string
      const rawCode = typeof content === 'object' ? content.code : content;
      
      htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #000; text-align: center; tracking-spacing: 2px;">4 FITNESS</h2>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 14px; color: #333;">Thank you for signing up for 4 FITNESS! Use the 6-digit verification code below to activate your premium account profile:</p>
          <div style="background: #f4f4f4; padding: 15px; font-size: 28px; font-weight: bold; text-align: center; letter-spacing: 6px; margin: 20px 0; border-radius: 4px; border: 1px dashed #ccc; color: #111;">
            ${rawCode}
          </div>
          <p style="font-size: 12px; color: #666; text-align: center;">If you did not request this code, please ignore this email safety transmission alert.</p>
        </div>
      `;
    }

    // 2. Transmit the email payload across the node transport layer
    await transporter.sendMail({
      from: `"4 FITNESS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlTemplate
    });

    console.log(`📨 Email notification successfully transmitted to ${email}.`);
  } catch (error) {
    console.error("❌ Email transmission failure:", error);
    throw new Error("Failed to deliver outgoing system email alert.");
  }
};

module.exports = sendEmail;