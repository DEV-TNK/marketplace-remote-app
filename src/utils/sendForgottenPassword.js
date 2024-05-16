const sendEmail = require("./sendEMail");

const sendForgotPasswordEmail = async ({ username, email, token, origin }) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;

  const message = `<p>Please reset password by clicking on the following link : 
  <a href="${resetURL}">Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: "UNLEASHIFIED Reset Password",
    html: `<h4> Hello, ${username}</h4>
    ${message}
    `,
  });
};

module.exports = sendForgotPasswordEmail;
