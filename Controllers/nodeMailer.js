// emailController.js

const { createTransport } = require("nodemailer");
const sendMailUsingSMTP = async (email, OTP) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: "hexlertech@gmail.com",
      pass: "sxyx awwo gmef mfxu",
    },
  });

  const mailOptions = {
    from: "hexlertech@gmail.com",
    to: email,
    subject: "OTP for email verification",
    text: `Your OTP is ${OTP}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      console.log("Email sent: " + info.accepted);
    }
  });
};

module.exports = sendMailUsingSMTP;

const sendEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    

    await sendMailUsingSMTP(email, otp);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

module.exports = { sendEmail };
