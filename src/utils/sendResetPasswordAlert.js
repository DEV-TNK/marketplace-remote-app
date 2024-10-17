const sendEmail = require("./sendEMail");

const sendResetPasswordAlert = async ({ username, email, token, origin }) => {
  // const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const resetURL = `${origin}/support`;

  const message = `<p>Votre mot de passe a été changé avec succès. Si vous n'êtes pas à l'origine de cette modification, cliquez sur le lien suivant pour parler à un membre du personnel afin de récupérer votre compte: 
  <a href="${resetURL}">Réinitialiser le mot de passe</a></p>`;

  return sendEmail({
    to: email,
    subject: "Réinitialisation du mot de passe MARKETPLACE",
    html: `<h4> Bonjour, ${username}</h4>
    ${message}
    `,
  });
};

module.exports = sendResetPasswordAlert;
