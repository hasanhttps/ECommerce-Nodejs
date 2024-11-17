const fs = require("fs");
const express = require("express");
const formidable = require("formidable");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require("../utils/tokenUtils");
const User = require("../models/userModel");

const router = express.Router();

router.post("/register", async (req, res, next) => {
    try{
        const {
            username,
            firstname,
            lastname,
            email,
            password,
            isAdmin = false
        } = req.body;
        const newUser = new User({
            firstname,
            lastname,
            email,
            password,
            username,
            basket: null,
            isAdmin
        });
        await newUser.save();

        res.status(201).send("User is successfuly created");
    }
    catch(error){
        console.error(error);
        res.send(`Server Error occured`);
    }
});

router.post("/login", async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if(user && (await user.checkPassword(password))) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            res.json({ accessToken, refreshToken });
        }
        else {
            res.json({ message: "Invalid Credentials" });
            res.send(`JWT problem occured`);
        }
    }
    catch (error) {
        console.error(error);
    }
});

router.get("/refresh", async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        const decodedToken = verifyRefreshToken(refreshToken);

        if (decodedToken) {
            const user = await User.findById(decodedToken.id);
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            res.json({
                accessToken,
                refreshToken
            });
        }
    }
    catch(error) {
        res.json({ message: "Invalid Credentials" });
        res.send(`JWT problem occured`);
    }
});

router.post("/addImage", async (req, res) => {
    try{
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (files.profileImage[0] && files.profileImage[0].filepath) {
                files.profileImage.map((img) => {
                    const imagedata = fs.readFileSync(img.filepath);
                    const imgname = img.originalFilename.split(".")[0];
                    const extension = img.originalFilename.split(".")[1];
                    const newimgpath = `${imgname}+${Date.now()}.${extension}`;

                    fs.writeFileSync(newimgpath, imagedata);
                });
                res.send("Image added successfuly");
            } else throw new Error("File doesn't locate on the folder.");
        });
    }
    catch(err){
        console.error(err);
    }
});

module.exports = router;