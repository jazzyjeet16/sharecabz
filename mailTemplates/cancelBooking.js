const cancelBookingTemplate = (username, sourceLocation, destinationLocation, startDate, departureTime ) => {
    const formatDate = (value) => {
        if (!value) return 'N/A';
        const date = new Date(value); // 'value' refers to 'startDate'
        return new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date); 
    };

    let journeyDate = formatDate(startDate);

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
                <p>Dear <strong>${username}</strong>,</p>
                <p>Your booking for the trip from <strong>${sourceLocation}</strong> to <strong>${destinationLocation}</strong> scheduled on <strong>${journeyDate}</strong> at <strong>${departureTime}</strong> <br/>has been cancelled.</p>
            </div>
            <div class="support">
                If you need further assistance, <br/> please contact us at
                <a href="mailto:info@sharecabz20@gmail.com">sharecabz20@gmail.com</a>.
            </div>
        </div>
    </body>

    </html>`;
  };
  
  module.exports = cancelBookingTemplate;
  