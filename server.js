require('dotenv').config(); // ✅ Load environment variables
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// 📩 Route to handle form submission
app.post("/send-email", async (req, res) => {
  const { name, email, phone, city, state, prefLocation, prefSched, licenseStat, availability, submitTime, consentCheck } = req.body;

  // ✅ Debug: Check if environment variables are loaded
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Found" : "❌ Missing");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Found" : "❌ Missing");

  // ✅ FIXED: createTransport (not createTransporter)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Use Gmail service
    port: "465",
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail App Password (not regular password)
    },
  });

try {
  await transporter.sendMail({
    from: process.env.EMAIL_USER || "nodemailer.test.services@gmail.com", // Must match authenticated user
    to: "rammagdalaga80@gmail.com", // recipient
    subject: "New Booking Form Submission",
    html: `
      <h2>New Booking Form Submission</h2>
      <p><strong>Submitted At:</strong> ${submitTime}</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>City:</strong> ${city}</li>
        <li><strong>State:</strong> ${state}</li>
        <li><strong>Preferred Location:</strong> ${prefLocation}</li>
        <li><strong>Preferred Schedule:</strong> ${prefSched}</li>
        <li><strong>License Status:</strong> ${licenseStat}</li>
        <li><strong>Availability:</strong> ${availability}</li>
        <li><strong>Consent:</strong> ${consentCheck}</li>
      </ul>
    `,
    text: `
      Submitted At: ${submitTime}
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      City: ${city}
      State: ${state}
      Preferred Location: ${prefLocation}
      Preferred Schedule: ${prefSched}
      License Status: ${licenseStat}
      Availability: ${availability}
      Consent: ${consentCheck}
    `
  });

await transporter.sendMail({
    from: process.env.EMAIL_USER || "nodemailer.test.services@gmail.com", // Must match authenticated user
    to: email, // recipient
    subject: "Your Booking Request!",
    html: `
      <h2>Hello ${name}, Here is the information you have submitted to us.</h2>
      <p><strong>Submitted At:</strong> ${submitTime}</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>City:</strong> ${city}</li>
        <li><strong>State:</strong> ${state}</li>
        <li><strong>Preferred Location:</strong> ${prefLocation}</li>
        <li><strong>Preferred Schedule:</strong> ${prefSched}</li>
        <li><strong>License Status:</strong> ${licenseStat}</li>
        <li><strong>Availability:</strong> ${availability}</li>
        <li><strong>Consent:</strong> ${consentCheck}</li>
      </ul>
      
      <h3>Rest assured, we will review your submission and respond as soon as possible.
          Your information is secure with us.
      </h3>
      <h2>- Zeesquads Team</h2>
    `,
    text: `
      Submitted At: ${submitTime}
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      City: ${city}
      State: ${state}
      Preferred Location: ${prefLocation}
      Preferred Schedule: ${prefSched}
      License Status: ${licenseStat}
      Availability: ${availability}
      Consent: ${consentCheck}
    `
  });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ success: false, error: err.message });
  }
  
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});