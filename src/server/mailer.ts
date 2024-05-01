import { env } from "@/env.mjs";
import nodemailer, { type Transporter, type SendMailOptions } from "nodemailer";
import MailgunTransport, {
  type AuthOptions,
} from "nodemailer-mailgun-transport";

enum Templates {
  "password-reset",
  "verification-nucleus",
  "create-account",
}

interface MailOptions extends SendMailOptions {
  template?: keyof typeof Templates;
  context?: Record<string, string | number | undefined | Date>;
  "h:X-Mailgun-Variables"?: string;
}

const createTransport = (): Transporter => {
  const auth: AuthOptions = {
    api_key: env.MAILGUN_API_KEY,
    domain: env.MAILGUN_DOMAIN,
  };
  const options: MailgunTransport.Options = { auth };
  if (env.MAILGUN_URL) {
    // nodemailer-mailgun-transport supports a URL property in options
    // but it is not exposed by the types library. Parsing the url
    // works around it.
    const url = new URL(env.MAILGUN_URL);
    options.host = url.host;
    options.port = parseInt(url.port);
    options.protocol = url.protocol;
  }
  try {
    return nodemailer.createTransport(MailgunTransport(options));
  } catch (error) {
    // Both calls can throw and nextjs is silently swallowing the error.
    console.error(error);
    throw error;
  }
};

const sendMail = (
  subject: string,
  to: string | string[],
  options: MailOptions,
): Promise<void> => {
  const mailOptions: MailOptions = {
    from: env.NODEMAILER_EMAIL,
    to: to,
    subject: subject,
    ...options,
  };

  if (options.template) {
    mailOptions["h:X-Mailgun-Variables"] = JSON.stringify(
      options.context ?? {},
    );
  }

  return new Promise((resolve, reject) => {
    createTransport().sendMail(mailOptions, (error) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log("Email Sent");
        resolve();
      }
    });
  });
};

export default sendMail;
