const sendEmail = require("./sendEMail");

const sendWelcomeEmail = async ({ username, email }) => {
  const message = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bienvenue sur PME Côte d'Ivoire Marketplace</title>
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

      .experince {
        width: 100%;
        margin-top: -25px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .experince img {
        margin-top: -20px;
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

      .gettingStarted {
        margin-top: 45px;
        text-align: left;
      }

      .gettingStarted h1 {
        font-size: 18px;
        font-weight: 700;
      }

      .gettingStarted ul {
        text-align: left;
      }

      .gettingStarted ul :nth-child(n + 2):nth-child(-n + 3) {
        margin-top: 20px;
      }

      .gettingStarted p {
        margin-top: 50px;
      }

      .click {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .section-content button {
        width: 249px;
        height: 55px;
        background-color: black;
        border-radius: 10px;
        font-size: 24px;
        border: none;
        color: white;
        margin-top: 30px;
        cursor: pointer;
      }

      .last {
        margin-top: 50px;
      }

      footer {
        width: 100%;
        height: 203px;
        background-color: #151a9a;
        border-bottom-right-radius: 24px;
        border-bottom-left-radius: 24px;
        color: white;
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

      footer .store {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
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
       <img
                        alt="PME Logo"
                        src="https://i.ibb.co/RpQHhXF/Logo-CI-PME.png"
                        style="height: 60px"
                      />
      </header>
      <section class="section-content">
        <div class="experince">
          <p>Bienvenue sur PME Côte d'Ivoire Marketplace!</p>
          <img src="./images/person.png" alt="person" />
        </div>
        <p>Bonjour ${username}</p>
        <p>
          Bienvenue sur <span>PME Côte d'Ivoire Marketplace</span>, votre plateforme de choix pour découvrir des opportunités d'emploi à distance passionnantes !
          Nous sommes ravis de vous accueillir dans notre communauté, où vous trouverez une multitude de postes à distance adaptés à vos compétences et préférences.
        </p>
        <div class="gettingStarted">
          <ul>
            <li>
              Chez PME Côte d'Ivoire Marketplace, nous comprenons l'évolution du monde du travail, et nous sommes dédiés à connecter des talents comme vous avec des rôles à distance de premier ordre auprès d'entreprises de renom à travers le monde. 
              Que vous recherchiez flexibilité, autonomie ou l'opportunité de travailler de n'importe où, nous avons ce qu'il vous faut.
            </li>
            <li>
             En tant que membre de PME Côte d'Ivoire Marketplace, vous aurez accès à une sélection exclusive d'offres d'emploi à distance couvrant divers secteurs, y compris la technologie, le marketing, le design, le support client, et bien plus encore. 
              Notre plateforme intuitive facilite la recherche, la candidature et le suivi de vos candidatures, garantissant une expérience fluide du début à la fin.
            </li>
            <li>
              Mais ce n'est pas tout - PME Côte d'Ivoire Marketplace est bien plus qu'un simple tableau d'offres d'emploi. C'est une communauté dynamique de professionnels à distance, offrant des opportunités de réseautage, des ressources pour votre carrière, et du contenu enrichissant pour soutenir votre développement professionnel et votre succès.
            </li>
          </ul>
          <p>
           Que vous débutiez une nouvelle carrière à distance ou que vous recherchiez votre prochaine aventure à distance, PME Côte d'Ivoire Marketplace est là pour vous accompagner à chaque étape.

            Commencez dès aujourd'hui en explorant nos dernières offres d'emploi et en rejoignant la conversation dans nos forums communautaires. La carrière à distance de vos rêves vous attend!
          </p>
        </div>
        <div class="click">
          <a
            href="https://marketplacefrontendas-test.azurewebsites.net/authentication/signin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>Commencer Maintenant</button>
          </a>
        </div>
        <p class="last">Bienvenue à bord,</p>
        <p>L'équipe <span>PME Cote D'Ivoire Marketplace</span> Team.</p>
      </section>
      <footer>
          <p class="copyright">
            <span>&copy;</span> 2024 PME Côte d'Ivoire Marketplace. Tous droits réservés.
          </p>
        </div>
      </footer>
    </main>
  </body>
</html>
`;

  return sendEmail({
    to: email,
    subject: "Bienvenue sur PME Côte d'Ivoire Marketplace",
    html: `<h4> Bonjour, ${username}</h4>
    ${message}
    `,
  });
};

module.exports = sendWelcomeEmail;
