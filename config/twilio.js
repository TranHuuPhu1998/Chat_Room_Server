import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const twilioPhone = process.env.TWILIO_PHONE;
export default client;
