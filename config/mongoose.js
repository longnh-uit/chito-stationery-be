const mongoose = require("mongoose");
require("dotenv").config()

const connectDB = () => {
    mongoose.connect(`${process.env.MONGO_URI}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Mongo cloud connected!");
    })
    .catch((err) => {
        console.log("Error when connecting to cloud", err);
    })

};

module.exports = connectDB;