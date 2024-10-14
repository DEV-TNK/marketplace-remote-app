const sendEmail = require("./sendEMail");
const sendProviderServiceRequestEmail = async ({ providerName, email, serviceTitle, requesterName, totalPrice }) => {
  const message = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle Demande de Service</title>
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
          <h2>Nouvelle Demande de Service et Paiement</h2>
          <p>Cher ${providerName},</p>
          <p>Une nouvelle demande de service a été faite pour votre service intitulé <strong>${serviceTitle}</strong>.</p>
          <p><strong>Demandeur :</strong> ${requesterName}</p>
          <p><strong>Montant Total Reçu:</strong> $${totalPrice}</p>
          <p>Veuillez vous connecter à votre compte pour examiner la demande et commencer le service.</p>
          <p>Merci de fournir vos services via notre plateforme!</p>
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
    subject: `Nouvelle Demande de Service pour ${serviceTitle}`,
    html: message,
  });
};

module.exports = sendProviderServiceRequestEmail
