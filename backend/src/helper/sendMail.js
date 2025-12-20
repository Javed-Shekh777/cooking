const nodemailer = require("nodemailer");
const { mailOptions } = require("../constants");

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailOptions.username,
    pass: mailOptions.userKey,
  },
});


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
      from: "mdjavedshekh777@gmail.com",
      to: email,
      subject: isEmailChange
        ? "Confirm Your New Email Address"
        : "Verify Your Email Address",

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px;">
          
          <h2 style="text-align:center; color:#4CAF50;">
            Hi, ${username}
          </h2>

          ${
            isEmailChange
              ? `<p>You requested to change your email address.</p>`
              : `<p>Welcome! Thank you for registering.</p>`
          }

          <p>Please verify your email using the OTP below:</p>

          <div style="font-size:22px; font-weight:bold; color:#4CAF50; text-align:center;">
            ${verificationCode}
          </div>

          <p>OTP is valid for 15 minutes.</p>

          ${
            webToken
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

          ${
            isEmailChange
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
      from: "mdjavedshekh777@gmail.com",
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


const contactMail = async ({ username, email }) => {
  try {

    const options = {
      from: "mdjavedshekh777@gmail.com",
      to: email,
      subject: "Verify Your Email Address",
      html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <h2 style="color: #0d6efd;">Thank You for Contacting Us, ${username}!</h2>
    <p>We have received your message and our team will get back to you as soon as possible.</p>
    
    <p>Here's a summary of your submission:</p>
    <ul>
      <li><strong>Name:</strong> ${username}</li>
    </ul>

    <p>We appreciate you reaching out and will respond shortly.</p>

    <p style="margin-top: 20px;">Best regards,<br/>
    <strong>Your Cooking Saathi</strong></p>

    <hr style="border: none; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply to this email.</p>
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


module.exports = { verifyMail, accountCreationMail,contactMail }

 