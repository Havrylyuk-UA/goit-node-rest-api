import 'dotenv/config';
import nodemailer from 'nodemailer';

const { SEND_META_USER, SEND_META_PASS, SEND_META_HOST, SEND_META_PORT } =
  process.env;

const config = {
  host: SEND_META_HOST,
  port: SEND_META_PORT,
  secure: true,
  auth: {
    user: SEND_META_USER,
    pass: SEND_META_PASS,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = data => {
  const email = { ...data, from: SEND_META_USER };
  return transporter.sendMail(email);
};

export default sendEmail;
