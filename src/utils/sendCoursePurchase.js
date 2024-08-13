const sendEmail = require("./sendEMail");

const sendCoursePurchaseEmail = async ({
    username,
    email,
    title,
    price,
    category,
    hour,
}) => {
    const message = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>{{Thank You for Purchasing Our Course!}}</title>
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
        style="background-color:#f8f8f8; line-height: 1.5; min-height: 100%; font-weight: normal; font-size: 15px; color: #2F3044; margin:0; padding:20px;">
        <div
            style="background-color:#ffffff; padding: 45px 0 34px 0; border-radius: 24px; margin:40px auto; max-width: 600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" height="auto"
                style="border-collapse:collapse">
                <tbody>
                    <tr style="display: flex; justify-content: center; margin:0 25px 35px 25px">
                        <td align="center" valign="center" style="text-align:left; padding-bottom: 10px">
                            <div>
                                <div style="text-align:center; margin-bottom: 40px">
                                    <a rel="noopener">
                                        <img alt="PME Logo" src="https://i.ibb.co/RpQHhXF/Logo-CI-PME.png" style="height: 60px" />
                                    </a>
                                </div>
                                <!--end:Logo-->

                                <!--begin:Text-->
                                <div
                                    style="font-size: 15px; font-weight: normal; margin-bottom: 27px; line-height: 30px">
                                    <p style="margin-bottom:2px; color:#333; font-weight: 600">Dear ${username},</p>
                                    <p style="margin-bottom:2px; color:#333">Thank You for Purchasing Our Course!</h2>
                                    <p>We wanted to take a moment to express our gratitude for your recent purchase of
                                        our course. Your support means a lot
                                        to us!</p>
                                    <p style="margin-bottom: 2px; color: #333">
                                        Here are the details of your course:
                                    </p>
                                    <p style="margin-bottom: 2px; color: #333">
                                        Title: ${title}<br />
                                        Category: ${category}<br />
                                        Price: ${price}<br />
                                        Hours: ${hour}
                                    </p>

                                    <p style="margin-bottom:2px; color:#333">We hope you find the course valuable and
                                        that it helps you achieve your goals. Should you have any questions or need
                                        further assistance, don't hesitate to reach out to us.</p>
                                    <p style="margin-bottom:2px; color:#333">Thank you once again for choosing Remsana as your Online Learning Platform</p>
                                    <p style="margin-bottom:2px; color:#333">Should you have any questions or require
                                        further assistance, please do not hesitate to contact our dedicated support team
                                        at <a href="mailto:support@PMECoteD'IvoireMarketplace.com"
                                            style="text-decoration: none">support@PMECoteD'IvoireMarketplace.com</a>.</p>
                                </div>
                                <!--end:Text-->

                                <div
                                    style="font-size: 15px; font-weight: normal; line-height: 30px; margin: 40px 0px 0px 0px">
                                    <p style="color:#333;">Warm regards,<br>The PME Cote D'Ivoire Marketplace Team</p>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr
                        style="display: flex; justify-content: center; margin:0 25px 35px 25px; border-top: 1px solid #e7e9ed;">
                        <td align="center" valign="center"
                            style="font-size: 13px; text-align:left; padding: 10px 0 0 0; font-weight: 500; color: #7E8299">
                            <p style="margin-bottom:2px">Thank you for choosing PME Cote D'Ivoire Marketplace as your job platform.</p>
                            <p style="margin-bottom:2px"> <span>&copy;</span> 2024 PME Cote D'Ivoire Marketplace. All rights reserved.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</body>

</html>`;

    return sendEmail({
        to: email,
        subject:
            "Congratulations! Your New Purchased Course is Now Live on PME Cote D'Ivoire Marketplace Platform",
        html: `<h4> Hello, ${username}</h4>
    ${message}
    `,
    });
};

module.exports = sendCoursePurchaseEmail;
