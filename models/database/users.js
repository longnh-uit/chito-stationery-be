const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    thumbnail: String,
    email: { type: String, unique: true },
    password: String,
    cart: { type: Array, default: [] },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
    console.log("Password: " + this.password)
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } else {
        next();
    }
})

userSchema.statics.login = async (username, password) => {
    const user = await this.findOne({ username: username });
    if (user) {
        if (!user.password) {
            throw "This user has no password??!"
        }
        const auth = bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw "Incorrect password";
    }
    throw "Incorrect username"
}

module.exports = mongoose.model("User", userSchema)