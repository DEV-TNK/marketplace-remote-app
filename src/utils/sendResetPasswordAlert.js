const sendEmail = require("./sendEMail");

const sendResetPasswordAlert = async ({ username, email, token, origin }) => {
  // const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const resetURL = `${origin}/support`;

  const message = `<p>Your password have been successfully change. If you did not initial this step, click on the following link to talk to a staff to get your account: 
  <a href="${resetURL}">Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: "Unleashified Reset Password",
    html: `<h4> Hello, ${username}</h4>
    ${message}
    `,
  });
};

module.exports = sendResetPasswordAlert;
