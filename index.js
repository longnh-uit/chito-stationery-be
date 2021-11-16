const connectDB = require('./config/mongoose');
const express  = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser');

const app = express();


connectDB();

app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.COOKIE_KEY))

app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/product', require('./routes/product'));
app.use('/purchase', require('./routes/purchase'));
app.use('/contact', require('./routes/contact'));
app.use('/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>  {
    console.log(`App running on port ${PORT}`)
});