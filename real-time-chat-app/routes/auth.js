const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv').config();

// Register a user

router.post('/register', async(req, res) => {
    const { username, password } = req.body;
    
    try {
        let user  = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
    // create a user
    user = new User({
        username,
        password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Create a JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign the JWT and return it
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Replace with an actual secret
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// login user

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    // comapare the password

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid username or password'});

    // generate jwt 
    const token  = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.header('auth-token', token).json({ token });
})

module.exports = router; 
