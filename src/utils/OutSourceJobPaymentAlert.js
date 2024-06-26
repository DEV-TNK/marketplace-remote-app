const sendEmail = require("./sendEMail");

const sendProviderOutSourcJobPaymentEmail = async ({
  username,
  email,
  num,
  price
}) => {
  const message = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Job Payment Confirmation</title>
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
                      We are writing to inform you that payment has been
                      received for the <strong>Out-Source Job Created</strong>.
                      <br />
                      You can now consider the payment process complete. <br>

                      <br />
                    </p>
                    
                     <p style="margin-bottom: 2px; color: #333">
                      <strong>Payment details </strong> <br>
                      <strong>Number of People </strong>: ${num}<br />
                      <strong>Price</strong>: ${price}<br />
                    </p>
                    <div style="width: 100%; text-align: center;">
                    <p  style=" color: #16199c;  border-bottom: 2px solid #16199c; display: inline-flex; align-items: center; padding-bottom: 3px; margin-bottom: 5px;"> <strong>Next Steps</strong></p>
                    </div>


                    <p>
                      <p style="margin-bottom: 2px; color: #333">
                      1. <strong>Initial Review </strong>: Our team will
                      carefully review your job requirements to ensure we
                      understand your needs fully.
                      <br />
                      2. <strong>Processing Time</strong>: Please allow
                      <strong>10 days</strong> for us to process your job
                      request. We'll be working diligently behind the scenes to
                      match you with the most suitable candidates. <br />
                      3. <strong>Feedback and Updates</strong>: We understand
                      the importance of keeping you informed throughout the
                      process. You'll receive regular updates on the status of
                      your job, and our team will be available to address any
                      questions or concerns you may have. <br />
                      4. <strong>Contact Us</strong>: Should you have any
                      questions or require assistance at any point during the
                      process, please don't hesitate to reach out to us. You can
                      contact our support team at [info@unleashified.com]
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
                      Warm regards,<br />The Unleashified Team
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
                  Thank you for choosing Unleashified as your job platform.
                </p>
                <p style="margin-bottom: 2px">
                  &copy; 2024 Unleashified. All rights Reserved.
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
    subject: `Payment Approval Notification for Out-Source Jobs`,
    html: `<h4>Job Payment Approval</h4>
    ${message}
    `,
  });
};

module.exports = sendProviderOutSourcJobPaymentEmail;
