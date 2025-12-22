const nodemailer = require("nodemailer");
const { mailOptions } = require("../constants");

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailOptions.username,
    pass: mailOptions.userKey,
  },
});


const userTemplate = ({ username, subject }) => `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
  <h2 style="color:#0d6efd;">Thank you for contacting us, ${username}!</h2>

  <p>We have successfully received your message.</p>

  <p><strong>Subject:</strong> ${subject}</p>

  <p>Our support team will review your enquiry and get back to you shortly.</p>

  <br/>
  <p>Best regards,<br/><strong>Cooking Saathi Team</strong></p>

  <hr/>
  <p style="font-size:12px; color:#888;">
    This is an automated email. Please do not reply.
  </p>
</div>
`;


const adminTemplate = ({ username, email, subject, message, enquiryType }) => `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
  <h2>📩 New Contact Enquiry</h2>

  <p><strong>Name:</strong> ${username}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Type:</strong> ${enquiryType}</p>
  <p><strong>Subject:</strong> ${subject}</p>

  <p><strong>Message:</strong></p>
  <p style="background:#f8f9fa; padding:12px; border-radius:6px;">
    ${message}
  </p>

  <hr/>
  <p style="font-size:12px; color:#888;">
    Admin notification – Cooking Saathi
  </p>
</div>
`;



// const verifyMail = async ({ username, email, webToken = "", verificationCode }) => {
//   try {
//     const options = {
//       from: "mdjavedshekh777@gmail.com",
//       to: email,
//       subject: "Verify Your Email Address",
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//           <h2 style="text-align: center; color: #4CAF50;">Hi, ${username}</h2>
//           <p>Welcome! Thank you for registering. To complete your registration, please verify your email address.</p>

//            <p>OTP is valid for 15 minutes.</p>
//            <p>Your OTP for verification:</p>
//           <div style="font-size: 20px; font-weight: bold; color: #4CAF50; text-align: center; margin: 20px 0;">
//             ${verificationCode}
//           </div>



//           <p>If the OTP is not visible or you prefer a one-click verification, click the button below:</p>
//           <div style="text-align: center; margin: 20px 0;">
//             <a href="${process.env.FRONTEND}/verify?token=${webToken}&email=${email}" 
//               style="display: inline-block; padding: 12px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">
//               Verify Email
//             </a>
//           </div>

//           <p>If you did not request this, you can safely ignore this email.</p>

//           <br/>
//           <p>Thanks,</p>
//           <p><strong>Javed Shekh</strong></p>
//           <p style="font-size: 12px; color: #aaa; text-align: center;">This is an automated email. Please do not reply.</p>
//         </div>
//       `,
//     };

//     const mailResponse = await transpoter.sendMail(options);
//     if (!mailResponse) {
//       console.log("Mail not send", mailResponse);
//     }

//     return mailResponse;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };


const verifyMail = async ({
  username,
  email,
  verificationCode,
  webToken = "",
  purpose = "REGISTER" // 👈 NEW
}) => {
  try {

    const isEmailChange = purpose === "EMAIL_CHANGE";

    const options = {
      from: `"Cooking Saathi" <${mailOptions.ownerEmail}>`,
      to: email,
      subject: isEmailChange
        ? "Confirm Your New Email Address"
        : "Verify Your Email Address",

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px;">
          
          <h2 style="text-align:center; color:#4CAF50;">
            Hi, ${username}
          </h2>

          ${isEmailChange
          ? `<p>You requested to change your email address.</p>`
          : `<p>Welcome! Thank you for registering.</p>`
        }

          <p>Please verify your email using the OTP below:</p>

          <div style="font-size:22px; font-weight:bold; color:#4CAF50; text-align:center;">
            ${verificationCode}
          </div>

          <p>OTP is valid for 15 minutes.</p>

          ${webToken
          ? `
              <div style="text-align:center; margin:20px;">
                <a href="${process.env.FRONTEND}/verify?token=${webToken}&email=${email}"
                  style="padding:12px 20px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
                  Verify Email
                </a>
              </div>
              `
          : ""
        }

          ${isEmailChange
          ? `<p>If you did NOT request this email change, please secure your account.</p>`
          : `<p>If you did not request this, you can ignore this email.</p>`
        }

          <br/>
          <p>Thanks,<br/><strong>Javed Shekh</strong></p>
        </div>
      `,
    };

    return await transpoter.sendMail(options);

  } catch (error) {
    throw new Error(error.message);
  }
};


const accountCreationMail = async ({ username, email }) => {
  try {


    const options = {
      from: `"Cooking Saathi" <${mailOptions.ownerEmail}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="text-align: center; color: #4CAF50;">Hi, ${username}</h2>
          <p>Welcome! Thank you for registering. To complete your registration.</p>
          
         
          <br/>
          <p>Thanks,</p>
          <p><strong>Javed Shekh</strong></p>
          <p style="font-size: 12px; color: #aaa; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    const mailResponse = await transpoter.sendMail(options);
    if (!mailResponse) {
      console.log("Mail not send", mailResponse);
    }

    return mailResponse;
  } catch (error) {
    throw new Error(error.message);
  }
};



const contactMail = async ({
  to,
  username,
  email,
  subject,
  message,
  enquiryType = "GENERAL",
  type = "USER" // USER | ADMIN
}) => {
  try {
    const isAdmin = type === "ADMIN";

    const mailOptions = {
      from: `"Cooking Saathi" <${process.env.MAIL_FROM}>`,
      to,
      subject: isAdmin
        ? `📩 New Contact Enquiry: ${subject}`
        : "✅ We received your message",
      html: isAdmin
        ? adminTemplate({ username, email, subject, message, enquiryType })
        : userTemplate({ username, subject })
    };

    const response = await transpoter.sendMail(mailOptions);
    return response;

  } catch (error) {
    console.error("Contact mail error:", error.message);
    throw new Error("Failed to send contact email");
  }
};



const allotChefMail = async ({ username, email, dashboardUrl }) => {
  try {

    const options = {
      from: `"Cooking Saathi" <${mailOptions.ownerEmail}>`,

      to: email,
      subject: "🎉 Congratulations! You Are Now a Chef",
      html: `
  <!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8" />
  <title>Chef Approved</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
    }
    .header {
      text-align: center;
      color: #2d7a46;
    }
    .badge {
      display: inline-block;
      background: #2d7a46;
      color: #fff;
      padding: 8px 16px;
      border-radius: 20px;
      margin: 15px 0;
      font-size: 14px;
    }
    .content {
      color: #333;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      background: #2d7a46;
      color: #fff;
      padding: 12px 22px;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🎉 Congratulations!</h2>
      <span class="badge">Chef Approved</span>
    </div>
<div class="content">
  <p>Hello <strong>${username}</strong>,</p>

  <p>
    We are excited to inform you that your request to become a
    <strong>Chef</strong> has been successfully approved 🎊
  </p>

  <p>
    You now have access to:
  </p>
  <ul>
    <li>🍳 Create & publish recipes</li>
    <li>📊 Chef dashboard & analytics</li>
    <li>⭐ Ratings & performance insights</li>
  </ul>

  <p>
    Start sharing your amazing recipes and inspire food lovers around the world!
  </p>

  <a href="${dashboardUrl}" class="btn">Go to Chef Dashboard</a>
</div>

<div class="footer">
  <p>© ${new Date().getFullYear()} Recipe Platform. All rights reserved.</p>
</div>

  </div>

    <p style="margin-top: 20px;">Best regards,<br/>
    <strong>Your Cooking Saathi</strong></p>

    <hr style="border: none; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply to this email.</p>
  </div>
</body>
</html>


  
  `,
    };

    const mailResponse = await transpoter.sendMail(options);
    if (!mailResponse) {
      console.log("Mail not send", mailResponse);
    }

    return mailResponse;
  } catch (error) {
    throw new Error(error.message);
  }
};


const disAllotChefMail = async ({ username, email }) => {
  try {

    const options = {
      from: `"Cooking Saathi" <${mailOptions.ownerEmail}>`,

      to: email,
      subject: "Chef Access Update",
      html: `
      <!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8" />
  <title>Chef Access Update</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
    }
    .header {
      text-align: center;
      color: #b02a37;
    }
    .badge {
      display: inline-block;
      background: #b02a37;
      color: #fff;
      padding: 8px 16px;
      border-radius: 20px;
      margin: 15px 0;
      font-size: 14px;
    }
    .content {
      color: #333;
      line-height: 1.6;
    }
    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Chef Access Update</h2>
      <span class="badge">Access Changed</span>
    </div>

<div class="content">
  <p>Hello <strong>${username}</strong>,</p>

  <p>
    This is to inform you that your <strong>Chef access</strong> has been
    temporarily disabled or revoked by the admin.
  </p>

  <p>
    You will still be able to browse recipes and use the platform as a
    normal user.
  </p>

  <p>
    If you believe this was a mistake or wish to reapply for Chef access,
    please contact our support team.
  </p>
</div>

<div class="footer">
  <p>© ${new Date().getFullYear()} Recipe Platform. All rights reserved.</p>
</div>
  </div>
  </div>
   <p style="margin-top: 20px;">Best regards,<br/>
    <strong>Your Cooking Saathi</strong></p>

    <hr style="border: none; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply to this email.</p>
</body>
</html>`,
    };

    const mailResponse = await transpoter.sendMail(options);
    if (!mailResponse) {
      console.log("Mail not send", mailResponse);
    }

    return mailResponse;
  } catch (error) {
    throw new Error(error.message);
  }
};


const chefApplicationMail = async ({ username, email }) => {
  try {

    const options = {
      from: `"Cooking Saathi" <${mailOptions.ownerEmail}>`,

      to: email,
      subject: "👨‍🍳 Chef Application Received",
      html: `<h2>Hello ${username},</h2>
      <p>Your request to become a <b>Chef</b> has been received.</p>
      <p>Our admin team will review your profile and notify you once approved.</p>
      <br/>
      <p>– Cooking Saathi Team</p>
      <div class="footer">
  <p>© ${new Date().getFullYear()} Recipe Platform. All rights reserved.</p>
</div>
  </div>
  </div>
   <p style="margin-top: 20px;">Best regards,<br/>
    <strong>Your Cooking Saathi</strong></p>

    <hr style="border: none; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply to this email.</p>
`,
    };

    const mailResponse = await transpoter.sendMail(options);
    if (!mailResponse) {
      console.log("Mail not send", mailResponse);
    }

    return mailResponse;
  } catch (error) {
    throw new Error(error.message);
  }
};

const chefVerificationMail = async ({ username, email }) => {
  try {

    const options = {
      from: `"Cooking Saathi" <${mailOptions.ownerEmail}>`,
      to: email,
      subject: "👨‍🍳 Chef Request Received – Approval Pending",
      html: ` 
      <!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8" />
  <title>Chef Request Pending</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
    }
    .header {
      text-align: center;
      color: #b45309;
    }
    .badge {
      display: inline-block;
      background: #f59e0b;
      color: #fff;
      padding: 8px 16px;
      border-radius: 20px;
      margin: 15px 0;
      font-size: 14px;
    }
    .content {
      color: #333;
      line-height: 1.6;
    }
    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>👨‍🍳 Chef Request Received</h2>
      <span class="badge">Approval Pending</span>
    </div>
<div class="content">
  <p>Hello <strong>${username}</strong>,</p>

  <p>
    Thank you for registering as a <strong>Chef</strong> on our platform!
    Your email has been successfully verified ✅
  </p>

  <p>
    Your chef account is currently <strong>under review</strong> by our admin team.
    Once approved, you will be able to:
  </p>

  <ul>
    <li>🍳 Create & publish recipes</li>
    <li>📊 Access chef dashboard & analytics</li>
    <li>⭐ Receive ratings & feedback</li>
  </ul>

  <p>
    We’ll notify you as soon as your chef access is approved.
  </p>

  <p>
    Thank you for your patience 🙏
  </p>
</div>

<div class="footer">
  <p>© ${new Date().getFullYear()} Recipe Platform. All rights reserved.</p>
</div>

  </div>
   <p style="margin-top: 20px;">Best regards,<br/>
    <strong>Your Cooking Saathi</strong></p>

    <hr style="border: none; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply to this email.</p>
</body>
</html>
`,
    };

    const mailResponse = await transpoter.sendMail(options);
    if (!mailResponse) {
      console.log("Mail not send", mailResponse);
    }

    return mailResponse;
  } catch (error) {
    throw new Error(error.message);
  }
}



module.exports = { verifyMail, accountCreationMail, contactMail, allotChefMail, disAllotChefMail, chefApplicationMail,chefVerificationMail }

