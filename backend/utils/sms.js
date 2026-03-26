const twilio = require('twilio');
require('dotenv').config();

let client = null;

try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_ACCOUNT_SID !== 'your_twilio_sid') {
        client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
} catch (e) {
    console.log('⚠️ Twilio not configured, SMS notifications disabled');
}

const sendSMS = async (to, message) => {
    try {
        if (!client) {
            console.log(`📱 SMS (Mock) to ${to}: ${message}`);
            return { success: true, mock: true };
        }

        const result = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to,
        });

        console.log(`📱 SMS sent to ${to}: ${result.sid}`);
        return { success: true, sid: result.sid };
    } catch (error) {
        console.error('❌ SMS send failed:', error.message);
        return { success: false, error: error.message };
    }
};

const sendTokenNotification = async (phone, tokenNumber, branchName, estimatedTime) => {
    const message = `🎫 SQMS Alert!\nYour token ${tokenNumber} at ${branchName} is almost up!\nEstimated wait: ${estimatedTime} mins.\nPlease be ready at the counter.`;
    return sendSMS(phone, message);
};

const sendTokenBookedNotification = async (phone, tokenNumber, branchName, position) => {
    const message = `🎫 SQMS Booking Confirmed!\nToken: ${tokenNumber}\nBranch: ${branchName}\nPosition in queue: ${position}\nTrack your status at: ${process.env.FRONTEND_URL}`;
    return sendSMS(phone, message);
};

module.exports = { sendSMS, sendTokenNotification, sendTokenBookedNotification };
