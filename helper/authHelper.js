const jwt = require("jsonwebtoken");

const generateJWT = (value, secretKey, timeLife) => {
    return jwt.sign(value, secretKey, { expiresIn: timeLife });
};

const verifyJWT = (value, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(value, secretKey, (err, decoded) => {
            if (err) {
                reject(err);
            }
            resolve(decoded);
        })
    })
}

const verifyRefreshToken = (refToken, key) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refToken, key, (err, decoded) => {
            if (err) {
              reject(err);
            }
            resolve(decoded._id);
        });
    });
};

/** Set cookie với số ngày bằng timeLife */
const setCookie = (res, name, value, timeLife) => {
    return res.cookie(name, value, {
        maxAge: timeLife * 24 * 60 * 60 * 1000,
        signed: true,
        httpOnly: true,
    });
};

module.exports = {
    verifyRefreshToken,
    verifyJWT,
    setCookie,
    generateJWT,
};