import { UserRawDB } from "../models/User";

export const generateOTPEmail = (otp: string) => {
  return `
        <!DOCTYPE html>
               <html lang="en">
               <head>
                 <meta charset="utf-8">
                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
                 <title>Verify Your Email - Clockly</title>
                 <style>
                   body { 
                     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                     line-height: 1.6; 
                     color: #333; 
                     margin: 0; 
                     padding: 0; 
                     background-color: #f8f9fa;
                   }
                   .container { 
                     max-width: 600px; 
                     margin: 0 auto; 
                     padding: 20px; 
                     background-color: #ffffff;
                     border-radius: 8px;
                     box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                   }
                   .header { 
                     text-align: center; 
                     margin-bottom: 30px; 
                     padding-bottom: 20px;
                     border-bottom: 2px solid #e9ecef;
                   }
                   .logo {
                     font-size: 28px;
                     font-weight: bold;
                     color: #007bff;
                     margin-bottom: 10px;
                   }
                   .otp-code { 
                     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                     color: white;
                     padding: 25px; 
                     text-align: center; 
                     font-size: 36px; 
                     font-weight: bold; 
                     letter-spacing: 8px;
                     margin: 30px 0;
                     border-radius: 12px;
                     box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                   }
                   .content {
                     margin: 20px 0;
                     line-height: 1.8;
                   }
                   .footer { 
                     margin-top: 40px; 
                     padding-top: 20px;
                     border-top: 1px solid #e9ecef;
                     font-size: 14px; 
                     color: #6c757d; 
                     text-align: center;
                   }
                   .warning {
                     background-color: #fff3cd;
                     border: 1px solid #ffeaa7;
                     color: #856404;
                     padding: 15px;
                     border-radius: 6px;
                     margin: 20px 0;
                   }
                 </style>
               </head>
               <body>
                 <div class="container">
                   <div class="header">
                     <div class="logo">🕐 Clockly</div>
                     <h1 style="margin: 0; color: #495057;">Verify Your Email Address</h1>
                   </div>
                   
                   <div class="content">
                     <p>Hello,</p>
                     
                     <p>Thank you for signing up for Clockly! To complete your registration and secure your account, please enter the following verification code in the app:</p>
                     
                     <div class="otp-code">${otp}</div>
                     
                     <div class="warning">
                       <strong>⏰ Important:</strong> This code will expire in 10 minutes for security reasons.
                     </div>
                     
                     <p>If you didn't request this verification, please ignore this email or contact our support team if you have concerns.</p>
                     
                     <p>Welcome to Clockly! We're excited to help you track your time more efficiently.</p>
                   </div>
                   
                   <div class="footer">
                     <p><strong>Best regards,<br>The Clockly App Team</strong></p>
                     <p>This is an automated message, please do not reply to this email.</p>
                     <p style="margin-top: 20px; font-size: 12px; color: #adb5bd;">
                       © ${new Date().getFullYear()} Clockly App. All rights reserved.
                     </p>
                   </div>
                 </div>
               </body>
               </html>`;
};

export const generateRequestEmail = (data: UserRawDB) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Service Request - Clockly</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0; 
              padding: 0; 
              background-color: #f8f9fa;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              padding-bottom: 20px;
              border-bottom: 2px solid #e9ecef;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #17a2b8;
              margin-bottom: 10px;
            }
            .request-badge {
              background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%);
              color: white;
              padding: 12px 25px;
              border-radius: 25px;
              display: inline-block;
              font-weight: bold;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin: 20px 0;
              box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
            }
            .content {
              margin: 20px 0;
              line-height: 1.8;
            }
            .sender-info {
              background-color: #e3f2fd;
              border-left: 4px solid #2196f3;
              padding: 20px;
              margin: 25px 0;
              border-radius: 4px;
            }
            .schedule-section, .rate-section {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 25px 0;
              border: 1px solid #dee2e6;
            }
            .schedule-list {
              background-color: white;
              padding: 15px;
              border-radius: 6px;
              border: 1px solid #e9ecef;
            }
            .schedule-item, .rate-item {
              padding: 8px 0;
              border-bottom: 1px solid #f1f3f4;
              font-size: 15px;
            }
            .schedule-item:last-child, .rate-item:last-child {
              border-bottom: none;
            }
            .action-buttons {
              text-align: center;
              margin: 35px 0;
            }
            .button {
              display: inline-block;
              padding: 15px 35px;
              margin: 0 10px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
              text-transform: uppercase;
              letter-spacing: 1px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.2);
              transition: all 0.3s ease;
            }
            .accept-btn {
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
              color: white !important;
            }
            .decline-btn {
              background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
              color: white !important;
            }
            .footer { 
              margin-top: 40px; 
              padding-top: 20px;
              border-top: 1px solid #e9ecef;
              font-size: 14px; 
              color: #6c757d; 
              text-align: center;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .steps {
              background-color: #e8f5e8;
              border: 1px solid #c3e6c3;
              padding: 20px;
              border-radius: 8px;
              margin: 25px 0;
            }
            .steps ol {
              margin: 10px 0;
              padding-left: 20px;
            }
            .steps li {
              margin: 8px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🤝 Clockly</div>
              <h1 style="margin: 0; color: #495057;">Service Provider Request</h1>
              <div class="request-badge">⚡ Action Required</div>
            </div>
            
            <div class="content">
              <p>Hello <strong>${data.first_name}</strong>,</p>
              
              <p>You have received a new service provider request through Clockly! Someone would like to work with you to track their time and manage work records.</p>
              
              <div class="sender-info">
                <h3 style="margin-top: 0; color: #1976d2;">👤 Request From:</h3>
                <p style="margin: 5px 0; font-size: 18px;"><strong>${
                  data.first_name
                } ${data.last_name}</strong></p>
                <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> ${
                  data.email_address
                }</p>
              </div>
              <div class="steps">
                <h3 style="color: #2e7d32; margin-top: 0;">📋 Next Steps:</h3>
                <ol>
                  <li><strong>Open the Clockly app</strong> on your device</li>
                  <li><strong>Sign in</strong> to your account</li>
                  <li><strong>Navigate to Notifications</strong>/li>
                  <li><strong>Review the request details</strong> carefully</li>
                  <li><strong>Choose to Accept or Decline</strong> the request</li>
                </ol>
              </div>
              
              <div class="warning">
                <strong>⏰ Important:</strong> Please respond to this request within a reasonable time. The sender is waiting for your decision to proceed with their time tracking setup.
              </div>
              
              <p>If you accept this request, you'll be able to help ${
                data.first_name
              } track their work hours and manage their time records through Clockly.</p>
              
              <p>If you have any questions about this request or need assistance, please don't hesitate to contact our support team.</p>
            </div>
            
            <div class="footer">
              <p><strong>Best regards,<br>The Clockly Team</strong></p>
              <p>This is an automated message, please do not reply to this email.</p>
              <p style="margin-top: 20px; font-size: 12px; color: #adb5bd;">
                © ${new Date().getFullYear()} Clockly. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
};
