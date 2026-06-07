const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const app = express();

//serve static filles first
app.use(express.static(__dirname));

//then parse from data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect to database
const uri = process.env.MONGODB_URI;
let client;
let db;

async function connectDB() {
  if (!db) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('tourguideDB'); // collection will be inside this DB
    console.log('Connected to MongoDB');
  }
  return db;
}

//create nodemailer transport
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

//getting inputs from  contact form
app.post('/contact', async (req, res) =>{
    try {
        const {fullname, email, destination, description} = req.body;
        //validate inputs
         if (!fullname || !email ||!destination ||!description) {
            return res.status(400).send('All fields required');
        }
//send message to database first
     const database = await connectDB();
        await database.collection('contacts').insertOne({
            fullname,
            email,
            destination,
            description,
            createdAt: new Date(),
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        });

  //then save a copy to email server
        await transporter.sendMail({
            from: `"Tour Operator web" <${process.env.EMAIL_USER}>`,
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
            from: `"TOUR OPERATOR" <${process.env.EMAIL_USER}>`,
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