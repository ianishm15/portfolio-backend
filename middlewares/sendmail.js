import dotenv from "dotenv";
dotenv.config();
import { ENV } from "../config/env.js";
import nodemailer from "nodemailer";
import ApiError from "../utils/ApiError.js";

const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: Number(ENV.SMTP_PORT),
  secure: Number(ENV.SMTP_PORT) === 465,

  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS || ENV.SMTP_PASSWORD,
  },
});

/* -------------------------------------------------------------------------- */
/*                           VERIFY SMTP CONNECTION                           */
/* -------------------------------------------------------------------------- */

transporter.verify((error) => {
  if (error) {

    console.error(
      "❌ SMTP Connection Failed:",
      error.message
    );

  } else {

    console.log(
      "✅ SMTP Server Ready"
    );

  }
});
/* -------------------------------------------------------------------------- */
/*                                SEND EMAIL                                  */
/* -------------------------------------------------------------------------- */

export const sendMail = async ({
  subject,
  text,
  html,
}) => {
  try {
    const mailOptions = {
      from: `"Portfolio Contact" <${ENV.SMTP_USER}>`,
      to: ENV.MYMAIL,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`📧 Email sent: ${info.messageId}`);

    return info;

  } catch (error) {
    throw new ApiError(500, "Unable to send email");
  }
};