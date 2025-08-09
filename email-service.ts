/**
 * Gmail Nodemailer Email Service
 * 
 * A simple TypeScript service for sending emails via Gmail SMTP using Nodemailer.
 * Requires Gmail app-specific password for authentication.
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import type { EmailConfig, EmailResult, EmailData, SimpleEmailOptions } from './types.js';

/**
 * Check if email service is properly configured
 */
export function checkEmailConfig(): boolean {
  const config: EmailConfig = {
    user: process.env.GMAIL_USER ? 'OK' : 'MISSING',
    password: process.env.GMAIL_APP_PASSWORD ? 'OK' : 'MISSING',
    recipient: process.env.GMAIL_USER ? 'OK' : 'MISSING'
  };
  
  const isConfigured = config.user === 'OK' && config.password === 'OK';
  
  if (!isConfigured) {
    console.warn('⚠️  Missing email configuration:', config);
    console.log('\nRequired environment variables:');
    console.log('  GMAIL_USER - Your Gmail address');
    console.log('  GMAIL_APP_PASSWORD - Your app-specific password');
  } else {
    console.log('✅ Email service configured correctly');
  }
  
  return isConfigured;
}

/**
 * Create Gmail transporter for sending emails
 */
export function createTransporter(): Transporter {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

/**
 * Send email using Gmail SMTP
 * 
 * @param emailData - Email configuration object
 * @returns Promise with success status and message ID
 */
export async function sendEmail(emailData: EmailData): Promise<EmailResult> {
  const transporter = createTransporter();
  
  const mailOptions: Mail.Options = {
    from: emailData.from || `"Email Service" <${process.env.GMAIL_USER}>`,
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html,
    text: emailData.text,
    replyTo: emailData.replyTo,
    attachments: emailData.attachments?.map(att => ({
      filename: att.filename,
      content: att.content,
      contentType: att.contentType,
    })),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${emailData.to}`);
    console.log(`   Message ID: ${info.messageId}`);
    return { 
      success: true, 
      messageId: info.messageId 
    };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
}

/**
 * Send a simple email with automatic HTML/text formatting
 * 
 * @param options - Simple email options
 * @returns Promise with success status and message ID
 */
export async function sendSimpleEmail(options: SimpleEmailOptions): Promise<EmailResult> {
  const { name, email, subject, message, attachments } = options;
  
  // Create HTML version with basic styling
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; border: 1px solid #dee2e6;">
        <h2 style="color: #495057; margin-top: 0;">New Message</h2>
        
        <div style="background-color: white; border-radius: 4px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${name}</p>
          <p style="margin: 0 0 20px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
          
          <div style="border-top: 1px solid #dee2e6; padding-top: 20px;">
            <h3 style="color: #495057; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
        </div>
        
        ${attachments && attachments.length > 0 ? `
        <div style="background-color: #e7f3ff; border: 1px solid #b3d7ff; border-radius: 4px; padding: 10px; margin-top: 20px;">
          <strong>📎 Attachments:</strong> ${attachments.length} file(s)
        </div>
        ` : ''}
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d;">
          <p style="margin: 0;">Sent via Gmail SMTP Service</p>
          <p style="margin: 5px 0 0 0;">Time: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Create plain text version
  const text = `
New Message
===========

From: ${name}
Email: ${email}

Message:
--------
${message}

${attachments && attachments.length > 0 ? `\nAttachments: ${attachments.length} file(s)\n` : ''}
--
Sent via Gmail SMTP Service
Time: ${new Date().toLocaleString()}
  `;
  
  return sendEmail({
    to: process.env.DEFAULT_RECIPIENT || process.env.GMAIL_USER || '',
    subject,
    html,
    text,
    replyTo: email,
    attachments
  });
}

/**
 * Test email configuration by sending a test email
 */
export async function sendTestEmail(): Promise<EmailResult> {
  console.log('\n📧 Sending test email...\n');
  
  return sendSimpleEmail({
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Email - Gmail SMTP Service',
    message: 'This is a test email to verify that the Gmail SMTP service is working correctly.\n\nIf you receive this email, your configuration is correct!'
  });
}