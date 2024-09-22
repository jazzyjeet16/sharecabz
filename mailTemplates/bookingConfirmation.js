const createBookingTemplate = (username, sourceLocation, destinationLocation, startDate, departureTime, pickupPoint, seats) => {
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
        <title>Booking Confirmation</title>
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

            .head{
                text-align: center;
            }

            .body {
                font-size: 16px;
                margin-bottom: 20px;
                text-align: left;
            }

            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }

            .footer {
                font-size: 12px;
                color: #777777;
                margin-top: 40px;
                border-top: 1px solid #dddddd;
                padding-top: 10px;
                text-align: center;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <img class="logo" src="https://i.postimg.cc/L6RPYLNz/logo.png" alt="ShareCabz">
            <div class="message">Booking Confirmation</div>
            <div class="body">
                <p class="head">Dear <strong>${username}</strong>,</p>
                <p class="head">Thank you for choosing our service! <br/>Your booking details for the trip from
                    <strong>${sourceLocation}</strong> to <strong>${destinationLocation}</strong> are confirmed as follows:
                </p>
                <br/>
                <p><strong>Source Location:</strong> ${sourceLocation}</p>
                <p><strong>Destination Location:</strong> ${destinationLocation}</p>
                <p><strong>Pickup Point:</strong> ${pickupPoint}</p>
                <p><strong>Date of Journey:</strong> ${journeyDate}</p>
                <p><strong>Departure Time:</strong> ${departureTime}</p>   
                <p><strong>Seats:</strong> ${seats}</p>
                
                <br/>

                <p class="head">Please ensure to be at the pickup point at least 15 minutes before the departure time to avoid any
                    inconvenience.</p>
            </div>
            <div class="support">
                If you need further assistance, please contact us at <br/><a
                    href="mailto:sharecabz20@gmail.com">sharecabz20@gmail.com</a>.
            </div>
        </div>
    </body>

    </html>`;
  };
  
  module.exports = createBookingTemplate;
  