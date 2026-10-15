import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

let transporter = null;

if (emailUser && emailPass) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
} else {
  console.warn("Gmail credentials missing in environment variables.");
}

export const sendEmailNotification = async (visitorName, visitorEmail, message) => {
  if (!transporter) return;

  const mailOptions = {
    from: `"Portfolio Chatbot" <${emailUser}>`,
    to: emailUser, // Sending to yourself
    subject: `New Portfolio Chat Message from ${visitorName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #00E5FF; text-align: center;">New Portfolio Chat Message</h2>
        <hr style="border-top: 1px solid #eee;" />
        <p><strong>👤 Name:</strong> ${visitorName}</p>
        <p><strong>📧 Email:</strong> ${visitorEmail}</p>
        <p><strong>⏰ Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })}</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; color: #333;"><strong>Message:</strong></p>
          <p style="margin-top: 10px; font-style: italic;">"${message}"</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:5173/dashboard" style="background-color: #00E5FF; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Open Dashboard</a>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending Email notification:", error);
  }
};
