const driversTemplate = (username, sourceLocation, destinationLocation, name, contactNumber, cabNumber, carModel ) => {
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

            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }

            .text {
                text-align: left;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <img class="logo" src="https://i.postimg.cc/L6RPYLNz/logo.png" alt="ShareCabz">
            <h3>Driver Assigned for Your Booking</h3>
            <p>Dear ${username},</p>
            <p>Your driver details for the trip from <strong>${sourceLocation}</strong> to <strong>${destinationLocation}</strong> are as follows:</p>
            <p class="text"><strong>Driver Name:</strong> ${name}</p>
            <p class="text"><strong>Contact Number:</strong> ${contactNumber}</p>
            <p class="text"><strong>Cab Number:</strong> ${cabNumber}</p>
            <p class="text"><strong>Car Model:</strong> ${carModel}</p>
            <p>We hope you have a pleasant trip!</p>
        </div>
    </body>

    </html>`;
  };
  
  module.exports = driversTemplate;
  