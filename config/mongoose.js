const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://dbLong:savemepls123@chito-stationery.mmxe4.mongodb.net/chito-stationery?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Mongo cluster connected!")
};

module.exports = connectDB;