const nodemailer = require("nodemailer");

/**
 * Sends a HTML email to the specified address.
 * Falls back to printing to console in development if configuration is missing.
 * 
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text content
 * @param {string} html - HTML content
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const isSmtpConfigured = 
    process.env.SMTP_HOST && 
    process.env.SMTP_PORT && 
    process.env.SMTP_USER && 
    process.env.SMTP_PASS;

  if (!isSmtpConfigured) {
    console.log("-----------------------------------------");
    console.log(`[EMAIL SIMULATOR] Email sent to: ${to}`);
    console.log(`[EMAIL SIMULATOR] Subject: ${subject}`);
    console.log(`[EMAIL SIMULATOR] Content:\n${text}`);
    console.log("-----------------------------------------");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'ExpenseTracker'}" <${process.env.SMTP_FROM_EMAIL || 'no-reply@expensetracker.com'}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Failed to send email via SMTP, falling back to simulator console log:", error);
    console.log("-----------------------------------------");
    console.log(`[EMAIL SIMULATOR] Email sent to: ${to}`);
    console.log(`[EMAIL SIMULATOR] Subject: ${subject}`);
    console.log(`[EMAIL SIMULATOR] Content:\n${text}`);
    console.log("-----------------------------------------");
  }
};

module.exports = {
  sendEmail,
};
