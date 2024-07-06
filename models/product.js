const { Schema, model } = require('mongoose')

const productSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        default: "Unisex"
    },
    image: {
        type: String,
        required: true,
        default: "https://images.unsplash.com/photo-1633292750937-120a94f5c2bb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
}, { timestamps: true });


const Product = model('product', productSchema)

module.exports = Product;