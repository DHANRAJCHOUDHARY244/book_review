
const nodemailer = require("nodemailer");

export const emailClient = nodemailer.createTransport({
      host: process.env.EMAIL_HOSTNAME,
      secure: true,
      secureConnection: false,
      tls: {
        ciphers: "SSLv3",
      },
      requireTLS: true,
      port: process.env.EMAIL_PORT,
      debug: true,
      connectionTimeout: 10000,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

  
