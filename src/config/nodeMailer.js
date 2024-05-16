// module.exports = {
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,
//   tls: {
//     rejectUnauthorized: false,
//     minVersion: "TLSv1.2",
//   }, // upgrade later with STARTTLS
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// };

module.exports = {
  host: "mail.smtp2go.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Update with your SMTP password
  },
  tls: {
    // rejectUnauthorized: false, // This line might not be necessary with TLS
    minVersion: "TLSv1.2",
  },
};
