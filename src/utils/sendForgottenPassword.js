const sendEmail = require("./sendEMail");

const sendForgotPasswordEmail = async ({ username, email, token, origin }) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;

  const message = `<p>Veuillez réinitialiser votre mot de passe en cliquant sur le lien suivant : 
  <a href="${resetURL}">Réinitialiser le mot de passe</a></p>`;

  return sendEmail({
    to: email,
    subject: "Réinitialisation du mot de passe MARKETPLACE",
    html: `<h4> Bonjour, ${username}</h4>
    ${message}
    `,
  });
};

module.exports = sendForgotPasswordEmail;
