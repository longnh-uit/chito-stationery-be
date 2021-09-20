const mongoose = require("mongoose");
require("dotenv").config()

const connectDB = async () => {
    await mongoose.connect(`${process.env.MONGO_URI}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Mongo cluster connected!")
};

module.exports = connectDB;