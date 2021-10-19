const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    thumbnail: String,
    email: { type: String, unique: true },
    password: String,
    gender: String,
    phone: String,
    dob: Date,
    address: String,
    cart: { type: Array, default: [] },
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

module.exports = mongoose.model("User", userSchema)