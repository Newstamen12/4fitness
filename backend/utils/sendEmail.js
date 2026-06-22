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

    // Determine if we are sending an OTP text or a performance metrics payload object
    const isPerformanceLog = typeof content === 'object' && content !== null;

    // 1. Build the dynamic HTML layout based on what context is being sent
    let htmlTemplate = '';

    if (isPerformanceLog) {
      // Premium layout for the admin performance feedback
      htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 25px; border: 1px solid #e5e5e5; border-radius: 12px; color: #262626; background-color: #fafafa;">
          <h2 style="color: #f43f5e; font-size: 20px; text-transform: uppercase; tracking-tight: 0.05em; margin-bottom: 5px;">4 FITNESS // PERFORMANCE REPORT</h2>
          <p style="font-size: 14px; color: #555;">Your training strategist has compiled and committed your latest phase metrics variables.</p>
          <hr style="border: 0; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
          
          <p style="font-size: 13px; font-weight: bold; color: #f43f5e; uppercase; margin-bottom: 4px;">💪 WORKOUT METRICS & FEEDBACK:</p>
          <div style="background: #ffffff; padding: 15px; border-left: 4px solid #f43f5e; font-family: monospace; font-size: 13px; border-radius: 6px; border-top: 1px solid #eee; border-right: 1px solid #eee; border-bottom: 1px solid #eee; margin-bottom: 20px; white-space: pre-wrap;">
            ${content.workoutMetrics || 'No active training records submitted.'}
          </div>

          <p style="font-size: 13px; font-weight: bold; color: #f59e0b; uppercase; margin-bottom: 4px;">🌱 NUTRITION & FUEL MATRIX:</p>
          <div style="background: #ffffff; padding: 15px; border-left: 4px solid #f59e0b; font-family: monospace; font-size: 13px; border-radius: 6px; border-top: 1px solid #eee; border-right: 1px solid #eee; border-bottom: 1px solid #eee; white-space: pre-wrap;">
            ${content.dietMetrics || 'No nutritional indicators tracked.'}
          </div>

          <br />
          <p style="font-size: 13px; color: #666; text-align: center; margin-top: 20px;">Log in to your 4 FITNESS Workspace to check historical milestone trajectories.</p>
        </div>
      `;
    } else {
      // Your exact original sign-up OTP template code block
      htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #000; text-align: center;">4 FITNESS</h2>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p>Thank you for signing up for 4 FITNESS! Use the 6-digit verification code below to activate your premium account profile:</p>
          <div style="background: #f4f4f4; padding: 15px; font-size: 28px; font-weight: bold; text-align: center; letter-spacing: 6px; margin: 20px 0; border-radius: 4px; border: 1px dashed #ccc;">
            ${content}
          </div>
          <p style="font-size: 12px; color: #666; text-align: center;">If you did not request this code, please ignore this email.</p>
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