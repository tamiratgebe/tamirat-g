const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ status: 'error', message: 'All fields are required.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact Form: ${name}`,
      text: `You received a message from ${name} (${email}):\n\n${message}`,
    });

    return res.status(200).json({ status: 'success', message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Vercel Email Send Error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to send email.' });
  }
};
