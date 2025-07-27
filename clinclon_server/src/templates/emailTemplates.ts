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
