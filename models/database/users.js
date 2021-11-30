const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        fullname: { type: String, required: true },
        thumbnail: String,
        email: { type: String, unique: true },
        password: String,
        phone: String,
        dob: Date,
        address: String,
        orders: Number,
        resetLink: String
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } else {
        next();
    }
})


/**Phương thức đăng nhập trả về user nếu thành công */
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email: email });
    if (user) {
        if (!user.password) {
            throw "This user has no password??!"
        }
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw "Incorrect password";
    }
    throw "Incorrect email"
}

userSchema.statics.changePassword = async function (email, password) {
    const passwordRegEx = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
    if (!passwordRegEx.test(password))
        throw "Password must contains letters, digits and at least 6 characters";
    password = await bcrypt.hash(password, 10);
    try {
        await this.updateOne({ email }, { $set: { password: password } });
    } catch (error) {
        throw error;
    }

}

module.exports = mongoose.model("User", userSchema)