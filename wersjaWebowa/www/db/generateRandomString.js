const crypto = require('crypto');

async function genStr(req, res, next) {
    //generuje losowego stringa do urla w przypadku zapomnienia hasła
    crypto.randomBytes(32, (err, rand) => {
        if (err) {
            req.resCode = 500;
            req.errMsg = error.message;
            next();
        };
        req.rand = rand.toString('hex');
        req.resCode = 200;
        next();
    });
}
module.exports = genStr;