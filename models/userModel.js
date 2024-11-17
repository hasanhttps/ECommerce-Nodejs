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
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userScheme.pre(`save`, async function (next) {
    if (!this.isModified(`password`)) return next();
    this.password = await bcryptjs.hash(this.password, 10);
    next();
});

userScheme.methods.checkPassword = async function (password) {
    return await bcryptjs.compare(password, this.password);
};
  
const User = mongoose.model("User", userScheme);

module.exports = User;