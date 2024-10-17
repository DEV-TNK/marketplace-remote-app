const sendEmail = require("./sendEMail");

const sendResetPasswordAlert = async ({ username, email, origin }) => {
  const resetURL = `${origin}/support`;

  const message = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Réinitialisation du mot de passe MARKETPLACE</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Outfit&display=swap");

      body {
        margin: 0;
        padding: 20px 20px 0 20px;
        font-family: "Outfit", sans-serif;
        background-color: #f8f8f8;
        line-height: 1.5;
        min-height: 100%;
        font-weight: normal;
        font-size: 15px;
        color: #2f3044;
      }

      p,
      h1,
      h2 {
        line-height: 22.68px;
      }

      .container {
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #ffffff;
        padding: 45px 0 0 0;
        border-radius: 24px;
        margin: 40px auto;
        max-width: 600px;
        color: black;
        font-size: 18px;
        font-weight: 400;
      }

      .header {
        margin-top: 40px;
      }

      .section-content {
        padding: 20px;
      }

      .section-content p h1 {
        font-size: 18px;
      }

      .section-content span {
        color: #4033f5;
        font-weight: 600;
      }

      .last {
        margin-top: 50px;
      }

      footer {
        width: 100%;
        height: 203px;
        background-color: #151a9a;
        color: white;
        border-bottom-right-radius: 24px;
        border-bottom-left-radius: 24px;
        font-weight: 700;
        font-size: 18px;
      }

      footer .wrapper {
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 60px;
      }

      footer .social-media :nth-child(n + 2):nth-child(-n + 4) {
        margin-left: 20px;
      }

      footer .download {
        text-align: center;
        margin-top: 40px;
      }

      footer p {
        text-align: center;
        font-weight: 300;
      }

      footer p:nth-child(1) {
        margin-top: 20px;
        text-align: center;
      }

      footer span {
        font-size: 22px;
        margin-right: 10px;
      }

      footer .copyright {
        margin-top: 50px;
      }
    </style>
  </head>
  <body>
    <main class="container">
      <header class="header">
        <img  alt="PME"
                        src="https://i.ibb.co/RpQHhXF/Logo-CI-PME.png"
                        style="height: 60px" />
      </header>
      <section class="section-content">
        <p>Bonjour ${username}</p>
        <p>
          Le mot de passe de votre compte <span>PME Côte d'Ivoire Marketplace</span> a été modifié avec succès. Si vous n'avez pas initié cette action, veuillez contacter notre équipe <a href="${resetURL}"><span>support</span></a> afin que nous puissions vous aider à récupérer votre compte.
        </p>

        <p class="last">Cordialement,</p>
        <p>L'équipe <span>PME Côte d'Ivoire Marketplace</span>.</p>
      </section>
      <footer>
       
          <p class="copyright">
           <span>&copy;</span> 2024 PME Côte d'Ivoire Marketplace. Tous droits réservés.
          </p>

      </footer>
    </main>
  </body>
</html>
</p>`;

  return sendEmail({
    to: email,
    subject: "Réinitialisation du mot de passe PME Côte d'Ivoire Marketplace",
    html: `<h4> Bonjour, ${username}</h4>
    ${message}
    `,
  });
};

module.exports = sendResetPasswordAlert;
