/**
 * Examples of using the Gmail Nodemailer Email Service
 * 
 * Run with: npm run examples
 */

import dotenv from 'dotenv';
import { checkEmailConfig, sendEmail, sendSimpleEmail, sendTestEmail } from './email-service.js';
import type { EmailAttachment } from './types.js';

// Load environment variables
dotenv.config();

async function runExamples(): Promise<void> {
  console.log('=== Gmail Nodemailer Examples ===\n');
  
  // Check configuration first
  const isConfigured = checkEmailConfig();
  if (!isConfigured) {
    console.error('\n❌ Please configure your .env file first');
    process.exit(1);
  }
  
  const exampleType = process.argv[2] || 'test';
  
  try {
    switch (exampleType) {
      case 'test':
        // Example 1: Send a test email
        await sendTestEmail();
        console.log('\n✅ Test email sent! Check your inbox.');
        break;
        
      case 'simple':
        // Example 2: Send a simple formatted email
        await sendSimpleEmail({
          name: 'John Doe',
          email: 'john.doe@example.com',
          subject: 'Contact Form Submission',
          message: 'Hello!\n\nThis is a message from your contact form.\n\nBest regards,\nJohn'
        });
        console.log('\n✅ Simple email sent successfully!');
        break;
        
      case 'html':
        // Example 3: Send custom HTML email
        await sendEmail({
          to: process.env.GMAIL_USER || '',
          subject: 'Custom HTML Email',
          html: `
            <h1 style="color: #333;">Welcome!</h1>
            <p>This is a custom HTML email with <strong>formatting</strong>.</p>
            <ul>
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
            </ul>
            <p>Visit <a href="https://github.com">GitHub</a> for more info.</p>
          `,
          text: 'Welcome! This is a custom email. Visit GitHub for more info.',
          replyTo: 'noreply@example.com'
        });
        console.log('\n✅ HTML email sent successfully!');
        break;
        
      case 'attachment':
        // Example 4: Send email with attachments
        const attachments: EmailAttachment[] = [
          {
            filename: 'example.txt',
            content: Buffer.from('This is the content of the text file attachment.'),
            contentType: 'text/plain'
          },
          {
            filename: 'data.json',
            content: Buffer.from(JSON.stringify({ example: 'data', timestamp: new Date() }, null, 2)),
            contentType: 'application/json'
          }
        ];
        
        await sendSimpleEmail({
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          subject: 'Email with Attachments',
          message: 'Please find the attached files.',
          attachments
        });
        console.log('\n✅ Email with attachments sent successfully!');
        break;
        
      case 'multiple':
        // Example 5: Send to multiple recipients
        await sendEmail({
          to: process.env.GMAIL_USER || '', // You can use comma-separated emails here
          subject: 'Announcement',
          html: '<h2>Important Announcement</h2><p>This email is sent to multiple recipients.</p>',
          text: 'Important Announcement\n\nThis email is sent to multiple recipients.'
        });
        console.log('\n✅ Email sent to multiple recipients!');
        break;
        
      default:
        console.log('Available examples:');
        console.log('  npm run examples test       - Send a test email');
        console.log('  npm run examples simple     - Send a simple formatted email');
        console.log('  npm run examples html       - Send custom HTML email');
        console.log('  npm run examples attachment - Send email with attachments');
        console.log('  npm run examples multiple   - Send to multiple recipients');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    if (error instanceof Error && error.message.includes('auth')) {
      console.log('\n💡 Authentication tips:');
      console.log('  1. Enable 2-factor authentication on your Google account');
      console.log('  2. Generate an app password at: https://myaccount.google.com/apppasswords');
      console.log('  3. Use the 16-character app password in your .env file');
    }
    process.exit(1);
  }
}

// Run examples
runExamples().catch(console.error);