const sendEmail = require("./sendEMail");

const sendServiceRequestPaymentConfirmationEmail = async ({ fullName, email, serviceTitle, totalPrice }) => {
  const message = `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de Paiement</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
        }
        .container {
          background-color: #ffffff;
          padding: 20px;
          margin: 40px auto;
          max-width: 600px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .header img {
          height: 50px;
        }
        .content {
          font-size: 16px;
          line-height: 1.5;
        }
        .content p {
          margin: 0 0 15px;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          font-size: 14px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://i.ibb.co/RpQHhXF/Logo-CI-PME.png" alt="Company Logo">
        </div>
        <div class="content">
          <h2>Confirmation de Paiement</h2>
          <p>Cher/Chère ${fullName},</p>
          <p>Merci pour votre paiement. Nous avons bien reçu votre paiement pour le service intitulé <strong>${serviceTitle}</strong>.</p>
          <p><strong>Montant Total Payé :</strong> $${totalPrice}</p>
          <p>Si vous avez des questions ou besoin d'assistance, n'hésitez pas à contacter notre équipe de support.</p>
          <p>Merci d'avoir choisi notre service!</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 PME Cote D'Ivoire Marketplace. Tous droits réservés.</p>
        </div>
      </div>
    </body>
  </html>
  `;

  return sendEmail({
    to: email,
    subject: `Confirmation de Paiement pour ${serviceTitle}`,
    html: message,
  });
};
module.exports = sendServiceRequestPaymentConfirmationEmail