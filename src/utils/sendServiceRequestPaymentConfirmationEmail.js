const sendEmail = require("./sendEMail");

const sendServiceRequestPaymentConfirmationEmail = async ({ fullName, email, serviceTitle, totalPrice }) => {
  const message = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation</title>
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
          <h2>Payment Confirmation</h2>
          <p>Dear ${fullName},</p>
          <p>Thank you for your payment. We have successfully received your payment for the service titled <strong>${serviceTitle}</strong>.</p>
          <p><strong>Total Amount Paid:</strong> $${totalPrice}</p>
          <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
          <p>Thank you for choosing our service!</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 PME Cote D'Ivoire Marketplace. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;

  return sendEmail({
    to: email,
    subject: `Payment Confirmation for ${serviceTitle}`,
    html: message,
  });
};
module.exports = sendServiceRequestPaymentConfirmationEmail