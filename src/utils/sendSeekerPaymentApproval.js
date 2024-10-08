const sendEmail = require("./sendEMail");

const sendSeekerJobPaymentEmail = async ({
  username,
  email,
  jobTitle,
  price,
}) => {
  const message = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Job Payment Approval</title>
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
                      Dear ${username},
                    </p>
                    <p style="margin-bottom: 2px; color: #333">
                     We are pleased to inform you that your payment for ${jobTitle} has been approved and now available for withdrawal.. 
                      <br />
                      Here are the details of your payment:
                    </p>
                    <p style="margin-bottom: 2px; color: #333">
                      Title: ${jobTitle}<br />
                      Price: ${price}<br />
                    </p>
                    <p>
                       Please follow this steps to make withdrawal:
                      <ol>
                        <li>Log in to your account on our platform.</li>
                        <li>Navigate to the "Earnings" section.</li>
                        <li>Select the option to withdraw funds.</li>
                        <li>Follow the on-screen instructions to complete the withdrawal process.</li>
                      </ol>
                      If you encounter any issues or have any questions regarding your payment, 
                      feel free to reach out to our support team at <a href="mailto:migration@gfa-tech.com" style="text-decoration: none">support</a> for assistance. 
                      We are here to help you every step of the way.
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
                      Warm regards,<br />The PME Cote D'Ivoire Marketplace Team
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
                  Thank you for choosing PME Cote D'Ivoire Marketplace as your job platform.
                </p>
                <p style="margin-bottom: 2px">
                 <span>&copy;</span> 2024 PME Cote D'Ivoire Marketplace. All rights reserved.
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
    subject: `Payment Approval Notification for ${jobTitle}`,
    html: `<h4>Job Payment Approval</h4>
    ${message}
    `,
  });
};

module.exports = sendSeekerJobPaymentEmail;
