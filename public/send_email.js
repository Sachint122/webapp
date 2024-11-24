const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'sachintiwari.751858@gmail.com',
        pass: 'ortjxipxjqgovkhz'
    }
});


// Route to serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route to handle sending email
app.post('/send-email', (req, res) => {
    const { email, bookTitle, dueDate } = req.body;

    const mailOptions = {
        from: 'sachintiwari.751858@gmail.com',
        to: email,
        subject: 'Reminder: Submit Book',
        text: `Please remember to submit the book "${bookTitle}" in ${dueDate}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
