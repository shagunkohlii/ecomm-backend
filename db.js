const mongoose = require("mongoose");
const mongoUrl = "mongodb://127.0.0.1:27017/ecomm-db"

const mongoConnect = ()=>{
    mongoose.connect(mongoUrl).then(
        console.log("mongodb connected")
    )
};

module.exports = mongoConnect ;