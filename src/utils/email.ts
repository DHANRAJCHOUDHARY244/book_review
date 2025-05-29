import logger from "./pino";
import { emailClient } from "@config/email";

export async function sendEmail(
  to: string,
  subject: string,
  bodyHtml: string
) {
  try {
    const params = {
      from: process.env.EMAIL_USERNAME,
      to: to,
      subject: subject,
      html: bodyHtml,
    };
    const response =  await emailClient.sendMail(params);
    logger.info(` Email sent to ${to} | MessageId: ${response.MessageId}`);
    return response;
  } catch (error) {
    logger.error(` Error sending email: ${error}`);
  }
}
