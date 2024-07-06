const mongoose = require("mongoose");
const password = encodeURIComponent("@Priya126");
const mongoUrl = `mongodb+srv://rishabkohli4:${password}@cluster0.ukvbl6h.mongodb.net/ecomm-db?retryWrites=true&w=majority&appName=Cluster0`;

const mongoConnect = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log(`MongoDb connected`);
      } catch (error) {
        console.error("Error in connecting mongoDb:", error.message);
      }
};

module.exports = mongoConnect;