const sendEmail = require("./sendEMail");

const sendConflictResolutionClosedEmail = async ({
    username,
    email,
    resolutionId,
    reason,
    message,
}) => {
    const Emailmessage = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Conflict Resolution Closed</title>
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
                     We are writing to inform you that the conflict resolution with  ID ${resolutionId} has been closed as it has been marked as resolved.
                     
                    </p>
                    <p style="margin-bottom: 2px; color: #333">
                      Reason: ${reason}
                    </p>
                    <p style="margin-bottom: 2px; color: #333">
                      Message: ${message}
                    </p>
                    <p style="margin-bottom: 2px; color: #333">
                     If you have any further concerns or need assistance, please don't hesitate to open another conflict resolution from your dashboard. 
                     Our team is available to help you.
                    </p>

                    <p>
                    Thank you for your understanding.
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
        subject: "Conflict Resolution Closed",
        html: `<h4>Conflict Resolution Closed</h4>
    ${Emailmessage}
    `,
    });
};

module.exports = sendConflictResolutionClosedEmail;
