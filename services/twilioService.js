import client, { twilioPhone } from "../config/twilio.js";

export async function sendSMS(phoneNumber, message) {
  return client.messages.create({
    body: message,
    from: twilioPhone,
    to: phoneNumber,
  });
}
