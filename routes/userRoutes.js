const express = require('express');
const User = require('../models/userModel');
const { verifyAccessToken, verifyIsAdmin, verifyAdmin } = require("../utils/tokenUtils");

const router = express.Router();

router.get('/', verifyAccessToken, verifyAdmin, async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json({ users });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Error getting the users", error: err.message });
    }
});

router.get('/:id', verifyAccessToken, verifyAdmin, async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json({ user });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Error getting the user", error: err.message });
    }
});

router.put('/:id', verifyAccessToken, verifyAdmin, async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (user) res.status(200).json({ message: "User updated successfuly" });
        else throw new Error("User couldn't find");
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Error deleting the user", error: err.message });
    }
})

router.delete('/:id', verifyAccessToken, verifyAdmin, async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) res.status(200).json({ message: "User deleted successfuly" });
        else throw new Error("User couldn't find");
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Error deleting the user", error: err.message });
    }
})

module.exports = router;