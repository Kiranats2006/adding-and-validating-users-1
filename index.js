const express = require('express');
const { resolve } = require('path');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs')
const user=require('./users');
require('dotenv').config();

const app = express();
app.use(express.json());
const port = 3010;

// app.use(express.static('static'));

// app.get('/', (req, res) => {
//   res.sendFile(resolve(__dirname, 'pages/index.html'));
// });
mongoose.connect(process.env.MONGO_URI).then(()=>console.log('Connected to mongoDb')).catch((e)=>console.log(e));

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
