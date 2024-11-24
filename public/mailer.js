// mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use the email service you prefer
    auth: {
        user: 'sachintiwari.751858@gmail.com',
        pass: 'tetcpoytrzzvcwzt'
    }
});
const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: 'sachintiwari.751858@gmail.com',
        to,
        subject,
        text
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
