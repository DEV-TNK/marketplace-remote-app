const sendEmail = require("./sendEMail");

const sendOutSourcingCreation = async ({
  username,
  email,
}) => {
  const message = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Confirmation : Votre mission d'externalisation a bien été reçue </title>
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
                      Merci d'avoir créé une mission d'externalisation avec nous ! Nous avons
                      bien reçu les détails de votre mission, et nous sommes impatients de commencer. Notre équipe vous contactera dès que possible.
                    </p>
                    <p>
                    Si vous avez des questions ou si vous avez besoin d'assistance à tout moment
                      pendant le processus, n'hésitez pas à nous contacter. Vous pouvez
                      joindre notre équipe d'assistance à l'adresse [info@PMECoteDIvoireMarketplace.com].
                    </p>
                    
                    <p>Merci d'utiliser notre service.</p>
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
                      <<strong>Cordialement</strong>,<br />L'équipe du marché PME Côte d'Ivoire
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
                   Merci d'avoir choisi PME Côte d'Ivoire Marketplace.
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
    subject: `Confirmation : Votre mission d'externalisation a bien été reçue !`,
    html: `<h4>Création de mission d'externalisation</h4>
    ${message}
    `,
  });
};

module.exports = sendOutSourcingCreation;
