const express = require('express');
const Basket = require('../models/basketModel');
const { verifyAccessToken, verifyAdmin } = require("../utils/tokenUtils");
const { authenticateAccessToken } = require('../middleware/authenticateAccessToken');

const router = express.Router();

router.post('/addbasket', async (req, res) => {
    try {
      const basket = new Basket({ ...req.body });
      await basket.save();
      res.status(201).json(basket);
    } catch (error) {
      res.status(500).json({ message: "Error creating basket", error: error.message });
    }
});

module.exports = router;