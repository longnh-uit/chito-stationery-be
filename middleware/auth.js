const User = require("../models/database/users");
const jwt = require("jsonwebtoken");

const authSignup = async (req, res, next) => {
    // Initialize regular expressions for username, email and password
    const user = req.body
    const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegEx = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
    const fullnameRegEx = /.{3,35}/;
    const phoneRegEx = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

    function errorHandler(res, error) {
        return res.status(400).json({
            error: error,
            success: false
        })
    }

    // Check if not match regex
    if (!fullnameRegEx.test(user.fullname))
        return errorHandler(res, "Username must be from 3 to 35 character");
    if (!emailRegEx.test(user.email))
        return errorHandler(res, "Must be a valid email");
    if (!passwordRegEx.test(user.password))
        return res
            .status(400)
            .json("Password must contains letters, digits and at least 6 characters");
    if (user.phone && !phoneRegEx.test(user.phone))
        return errorHandler(res, "Phone number is not valid");
    if (user.dob && (user.dob = new Date(user.dob)) == "Invalid Date")
        return errorHandler(res, "Date of birth is not valid");

    const existingEmail = await User.findOne({ email: user.email });
    if (existingEmail) {
        return errorHandler(res, "That email is already taken");
    }
    next();
}

const authToken = async (req, res, next) => {
    const authheader = req.headers['authorization'];

    if (!authheader) 
        return res.status(401).json({ error: "You are not authenticated", success: false });

    const token = authheader.split(' ')[1];
    try {
        var decoded = jwt.verify(token, process.env.JWT_Secret);
    } catch (error) {
        return res.status(401).json({ error: "You are not authenticated", success: false });
    }

    const email = decoded.email;
    if (email == req.body.email)
        next();
    else return res.status(401).json({ error: "You are not authenticated", success: false })

}

module.exports = { authSignup, authToken };