/**
 * Type definitions for Gmail Nodemailer Email Service
 */

/**
 * Configuration status for email service
 */
export interface EmailConfig {
  user: 'OK' | 'MISSING';
  password: 'OK' | 'MISSING';
  recipient: 'OK' | 'MISSING';
}

/**
 * Result returned after sending an email
 */
export interface EmailResult {
  success: boolean;
  messageId: string;
}

/**
 * File attachment for emails
 */
export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

/**
 * Basic email data structure
 */
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}

/**
 * Simple email options for quick sending
 */
export interface SimpleEmailOptions {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachments?: EmailAttachment[];
}