const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userScheme = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "This email is already in use"]
    },
    username: {
        type: String,
        unique: true,
        required: [true, "This username is already taken"]
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    basket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Basket"
    },
    admin: {
        type: Boolean,
        default: false
    }
});