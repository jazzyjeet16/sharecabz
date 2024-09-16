const passwordResetTemplate = (otp) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
      <meta charset="UTF-8">
      <title>Password Reset OTP</title>
      <style>
        body {
          background-color: #ffffff;
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.4;
          color: #333333;
          margin: 0;
          padding: 0;
        }
    
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }
    
        .logo {
          max-width: 200px;
          margin-bottom: 20px;
        }
    
        .message {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
        }
    
        .body {
          font-size: 16px;
          margin-bottom: 20px;
        }
    
        .highlight {
          font-weight: bold;
        }
    
        .cta {
          display: inline-block;
          padding: 10px 20px;
          background-color: #FFD60A;
          color: #000000;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          margin-top: 20px;
        }
    
        .support {
          font-size: 14px;
          color: #999999;
          margin-top: 20px;
        }
      </style>
    </head>
    
    <body>
      <div class="container">
        <img class="logo" src="https://i.postimg.cc/L6RPYLNz/logo.png" alt="ShareCabz">
        <div class="message">Password Reset Request</div>
        <div class="body">
          <p>Dear User,</p>
          <p>You have requested to reset your password. Use the following OTP to reset your password:</p>
          <h2 class="highlight">${otp}</h2>
          <p>This OTP is valid for 1 minute. Please use it promptly.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
        </div>
        <div class="support">
          If you need further assistance, please contact us at 
          <a href="mailto:info@sharecabz20@gmail.com">sharecabz20@gmail.com</a>.
        </div>
      </div>
    </body>
    
    </html>`;
  };
  
  module.exports = passwordResetTemplate;
  