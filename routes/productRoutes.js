const express = require('express');
const Product = require('../models/productModel');
const { verifyAccessToken, verifyAdmin } = require("../utils/tokenUtils");

const router = express.Router();

router.post('/addproduct', verifyAccessToken, verifyAdmin, async (req, res) => {
    try{
        const product = new Product({ ...req.body });
        await product.save();
        res.status(200).json({ message: "Product created successfuly"});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: "Error creating product", error: err.message });
    }
});

router.get('/', async (req, res) => {
    try{
        const { page = 1, pageSize = 10 } = req.query;
        const currentPage = +page;
        const currentPageSize = +pageSize;
        const count = await Product.countDocuments();
        const skip = (currentPage - 1) * currentPageSize;
        const totalPage = Math.ceil(count / currentPageSize);

        const products = await Product.find().skip(skip).limit(currentPageSize);
        res.status(200).json({ totalPage, products });
    }
    catch(err){
        console.error(err);
        res.json({ message: "Error getting the products", error: err.message });
    }
});

router.get('/:id', async (req,res) => {
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json({ product });
    }
    catch(err){
        console.error(err);
        res.json({ message: "Error getting the product", error: err.message });
    }
})

router.put('/:id', verifyAccessToken, verifyAdmin, async (req, res) => {
    try{
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ product });
    }
    catch(err){
        console.error(err);
        res.json({ message: "Error updating the product", error: err.message });
    }
});

router.delete('/:id', verifyAccessToken, verifyAdmin, async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfuly"});
    }
    catch(err){
        console.error(err);
        res.json({ message: "Error deleting the product", error: err.message });
    }
});

module.exports = router;