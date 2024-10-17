const sendEmail = require("./sendEMail");

const sendSeekerJobPaymentEmail = async ({
  username,
  email,
  jobTitle,
  price,
}) => {
  const message = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Approbation du Paiement de Travail</title>
    <style>
      @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");

      html,
      body {
        padding: 0;
        margin: 0;
        font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
        -webkit-text-size-adjust: none;
      }

      a:hover {
        color: #009ef7;
      }
    </style>
  </head>

  <body>
    <div
      style="
        background-color: #f8f8f8;
        line-height: 1.5;
        min-height: 100%;
        font-weight: normal;
        font-size: 15px;
        color: #2f3044;
        margin: 0;
        padding: 20px;
      "
    >
      <div
        style="
          background-color: #ffffff;
          padding: 45px 0 34px 0;
          border-radius: 24px;
          margin: 40px auto;
          max-width: 600px;
        "
      >
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          height="auto"
          style="border-collapse: collapse"
        >
          <tbody>
            <tr
              style="
                display: flex;
                justify-content: center;
                margin: 0 25px 35px 25px;
              "
            >
              <td
                align="center"
                valign="center"
                style="text-align: left; padding-bottom: 10px"
              >
                <div>
                  <!--begin:Logo-->
                  <div style="text-align: center; margin-bottom: 40px">
                    <a rel="noopener">
                      <img
                         alt="PME Logo"
                        src="https://i.ibb.co/RpQHhXF/Logo-CI-PME.png"
                        style="height: 60px"
                      />
                    </a>
                  </div>
                  <!--end:Logo-->

                  <!--begin:Text-->
                  <div
                    style="
                      font-size: 15px;
                      font-weight: normal;
                      margin-bottom: 27px;
                      line-height: 30px;
                    "
                  >
                    <p
                      style="margin-bottom: 2px; color: #333; font-weight: 600"
                    >
                      Cher/Chère ${username},
                    </p>
                    <p style="margin-bottom: 2px; color: #333">
                     Nous avons le plaisir de vous informer que votre paiement pour ${jobTitle} a été approuvé et est désormais disponible pour retrait. 
                      <br />
                      Voici les détails de votre paiement:
                    </p>
                    <p style="margin-bottom: 2px; color: #333">
                      Titre: ${jobTitle}<br />
                      Montant: ${price}<br />
                    </p>
                    <p>
                       Veuillez suivre ces étapes pour effectuer le retrait:
                      <ol>
                        <li>Connectez-vous à votre compte sur notre plateforme.</li>
                        <li>Accédez à la section "Gains".</li>
                        <li>Sélectionnez l'option pour retirer des fonds.</li>
                        <li>Suivez les instructions à l'écran pour finaliser le processus de retrait.</li>
                      </ol>
                     Si vous rencontrez des problèmes ou avez des questions concernant votre paiement, 
                      n'hésitez pas à contacter notre équipe de support à <a href="mailto:migration@gfa-tech.com" style="text-decoration: none">support</a> pour obtenir de l'aide. 
                      Nous sommes là pour vous accompagner à chaque étape.
                    </p>
                  </div>

                  <div
                    style="
                      font-size: 15px;
                      font-weight: normal;
                      line-height: 30px;
                      margin: 40px 0px 0px 0px;
                    "
                  >
                    <p style="color: #333">
                      Cordialement,<br />L'équipe PME Cote D'Ivoire Marketplace
                    </p>
                  </div>
                </div>
              </td>
            </tr>
            <tr
              style="
                display: flex;
                justify-content: center;
                margin: 0 25px 35px 25px;
                border-top: 1px solid #e7e9ed;
              "
            >
              <td
                align="center"
                valign="center"
                style="
                  font-size: 13px;
                  text-align: left;
                  padding: 10px 0 0 0;
                  font-weight: 500;
                  color: #7e8299;
                "
              >
                <p style="margin-bottom: 2px">
                  Merci d'avoir choisi PME Cote D'Ivoire Marketplace comme plateforme de travail.
                </p>
                <p style="margin-bottom: 2px">
                 <span>&copy;</span> 2024 PME Cote D'Ivoire Marketplace. Tous droits réservés.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </body>
</html>
`;

  return sendEmail({
    to: email,
    subject: `Notification d'Approbation de Paiement pour ${jobTitle}`,
    html: `<h4>Approbation de Paiement de Travail</h4>
    ${message}
    `,
  });
};

module.exports = sendSeekerJobPaymentEmail;
