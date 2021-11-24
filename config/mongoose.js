const mongoose = require("mongoose");
const keys = require("./keys");

const connectDB = () => {
    mongoose.connect(`${keys.MONGO_URI}`, {
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