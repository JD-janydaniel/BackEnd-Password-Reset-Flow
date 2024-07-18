import nodemailer from 'nodemailer'
import dotenv from "dotenv";

dotenv.config();

export const mail = async (userEmail, sub, body) => {
  try {
    //creat transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.PASSMAIL,
        pass: process.env.PASSKEY,
      },
    });

    //setting up all details
    const details = {
      from: `"Jany Daniel" <${process.env.PASSMAIL}>`,
      to: userEmail,
      subject: `${sub}`,
      html: `Cick Here To Reset Password : <a href= ${body} } >${body}</a></p>
            <p>It will expire within 1 hours</p>
            <p><i>Please don't reply to this email</i></p>
            <p>Thank you!</p>`,
    };
    //sending mail
    await transporter.sendMail(details);
    // console.log(`Mail Sent Successfully!`);
    return true;
  } catch (error) {
    console.log(`Mail Not Sent: ${error.message}`);
    return false;
  }
};


