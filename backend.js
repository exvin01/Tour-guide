const express = require('express');
const path = require('path');
const app = express();

//serve static filles first
app.use(express.static(__dirname));

//then parse from data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
//create transport
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

//getting inputs from  contact form
app.post('/contact', async (req, res) =>{
    try {
        const {fullname, email, destination, description} = req.body;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'NEW SUBMISSION FROM CONTACT PAGE',
            html: `
                 <h2>New Contact Form Submission</h2>
                 <p><strong>Name: </strong> ${fullname}</p>
                 <p><strong>Email: </strong> ${email}</p>
                 <p><strong>Destination: </strong> ${destination}</p>
                 <p><strong>Description: </strong> ${description}</p>
            `,
            replyTo: email
        });
        // auto reply to sender 
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'THANKS FOR CONTACTING TERENCE WALKER',
            html: `
                 <h2><strong>Hi, ${fullname}</strong></h2>
                 <p>Thanks for contacting Terence Walker</p>
                 <p>He will be back to you soon using email address</p>
                 <p><strong>Best regard<br>Tour guide team</p>
            `,
        });
        res.send('Submission received!');
    } catch (err) {
        console.error (err);
            res.status(500).send('Error sending email');
    }

});

//homepage route
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'index.html'));
});
// contact page route
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

module.exports = app;