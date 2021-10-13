const connectDB = require('./config/mongoose');
const express  = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser');

const app = express();


connectDB();

app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.COOKIE_KEY))

app.use('/user', require('./routes/auth'));
app.use('/product', require('./routes/product'));

app.get('/read-cookies', (req, res) => {
    const cookies = req.signedCookies;
    res.json(cookies);
})

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>  {
    console.log(`App running on port ${PORT}`)
});