const nodemailer = require("nodemailer");

/* ================= TRANSPORTER ================= */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465
  auth: {
    user: process.env.EMAIL_USER || process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

/* ================= VERIFY CONNECTION ================= */

transporter.verify((error) => {

  if (error) {

    console.error("❌ Email server connection failed:", error);

  } else {

    console.log("✅ Email server ready");

  }

});


/* ================= SEND EMAIL ================= */

const sendEmail = async (to, subject, html) => {

  try {

    const mailOptions = {

      from: `"Homezy Support" <${process.env.EMAIL_USER || process.env.EMAIL}>`,

      to,

      subject,

      html,

      text: "Please verify your email by clicking the verification link."

    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", info.messageId);

    return info;

  } catch (error) {

    console.error("❌ Email sending failed:", error);

    throw new Error("Email could not be sent");

  }

};

module.exports = sendEmail;