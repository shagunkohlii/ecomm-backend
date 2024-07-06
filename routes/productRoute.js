const express = require("express");
const PRODUCT = require('../models/product');
const router = express.Router();

router.get('/getproducts', async (req, res) => {
    const data = await PRODUCT.find()
        .then(product => res.json(product))
        .catch(err => res.json(err))

        // return res.json({ message: 'product added succesfully', data })
})

router.post('/addproduct', async (req, res) => {
    const { productName, price, description, category, image } = req.body;

    try {
        const productdata = await PRODUCT.create({
            productName,
            price,
            description,
            category,
            image
        });

        return res
            .status(200)
            .json({ message: 'product added succesfully', productdata })

    } catch (error) {
        console.log("product no added", error)
    }
})

module.exports = router;