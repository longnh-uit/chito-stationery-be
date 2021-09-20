const connectDB = require('./config/mongoose');
const express  = require('express');
const cors = require("cors");
const Product = require('./model/database/products');

const app = express();


connectDB();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
});