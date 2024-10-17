const sendEmail = require("./sendEMail");

const sendProviderOutSourcJobPaymentEmail = async ({
  username,
  email,
  num,
  price
}) => {
  const message = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Confirmation de Paiement de Travail</title>
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
                      Nous vous informons que le paiement a été reçu pour le <strong>travail externalisé créé</strong>.
                      <br />
                      Vous pouvez désormais considérer que le processus de
                      paiement est terminé. <br>

                      <br />
                    </p>
                     <p style="margin-bottom: 2px; color: #333">
                      <strong>Détails du paiement </strong> <br>
                      <strong>Nombre de personnes </strong>: ${num}<br />
                      <strong>Prix</strong>: ${price}<br />
                    </p>
                    <div style="width: 100%; text-align: center;">
                    <p  style=" color: #16199c;  border-bottom: 2px solid #16199c; display: inline-flex; align-items: center; padding-bottom: 3px; margin-bottom: 5px;"> <strong>Prochaines étapes</strong></p>
                    </div>


                    <p>
                      <p style="margin-bottom: 2px; color: #333">
                      1. <strong>Revue initiale </strong>: Notre équipe
                      examinera attentivement les exigences de votre travail
                      pour s'assurer que nous comprenons pleinement vos besoins.
                      <br />
                      2. <strong>Délai de traitement</strong>:  Veuillez
                      accorder <strong>10 jours</strong> pour traiter votre
                      demande de travail. Nous travaillerons avec diligence en
                      coulisses pour vous trouver les candidats les plus
                      appropriés. <br />
                      3. <strong>Retour d'information et mises à jour</strong>: Nous comprenons l'importance de vous tenir informé tout au
                      long du processus. Vous recevrez des mises à jour
                      régulières sur l'état de votre travail, et notre équipe
                      sera disponible pour répondre à toutes vos questions ou
                      préoccupations. <br />
                      4. <strong>Contactez-nous</strong>: Si vous avez des
                      questions ou avez besoin d'assistance à tout moment, n'hésitez
                      pas à nous contacter. Vous pouvez joindre notre équipe de
                      support à [info@PMECoteDIvoireMarketplace.com]
                    </p>

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
                      Cordialement,<br />L'équipe PME Côte d'Ivoire Marketplace
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
                   Merci de choisir PME Côte d'Ivoire Marketplace.
                </p>
                <p style="margin-bottom: 2px">
                  <span>&copy;</span> 2024 PME Côte d'Ivoire Marketplace. Tous droits réservés.
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
    subject: `Notification d'approbation de paiement pour travaux externalisés`,
    html: `<h4>Approbation de Paiement pour Travail</h4>
    ${message}
    `,
  });
};

module.exports = sendProviderOutSourcJobPaymentEmail;
