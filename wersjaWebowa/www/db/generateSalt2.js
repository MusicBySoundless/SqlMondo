const crypto = require('crypto');

async function generateSalt(req, res, next) {
    //generuje salta do haseł (nowa wersja)
    crypto.randomBytes(16, (err, salt) => {
        if (err) {
            req.resCode = 500;
            req.errMsg = error.message;
            next();
        };
        req.salt = salt.toString('hex');
        next();
    });
}
module.exports = generateSalt;