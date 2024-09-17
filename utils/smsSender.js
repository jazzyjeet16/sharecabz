const twilio = require("twilio");
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function smsSender(phone, message) {
  try {
    await client.messages.create({
      body: message,
      from: `"Sharecabz" <${process.env.TWILIO_PHONE_NUMBER}>`,
      to: `${phone}`,
    });
    console.log(`SMS sent to ${phone}`);
  } catch (error) {
    console.error("Failed to send SMS:", error);
    throw error;
  }
}

module.exports = smsSender;
