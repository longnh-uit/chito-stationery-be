const connectDB = require('./config/mongoose');
const express  = require('express');
const cors = require("cors");
const User = require("./models/database/users")
const { signUp } = require('./services/userService')

const app = express();


connectDB();

app.use(express.json());
app.use(cors());

app.use('/user', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>  {
    console.log(`App running on port ${PORT}`)
});