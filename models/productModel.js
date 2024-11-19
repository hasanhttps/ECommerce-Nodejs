const mongoose = require("mongoose");

const productScheme = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        enum: ["$", "€", "₼"],
        required: true
    },
    category: {
        type: String,
        enum: ["tech", "fashion", "cars", "other"],
        default: "other"
    },
    stock: {
        type: Number,
        default: 1,
        min: 0
    },
    gallery: {
        type: [String]
    }
});

const Product = mongoose.model("Product", productScheme);

module.exports = Product;