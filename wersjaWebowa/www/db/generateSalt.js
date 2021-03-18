const crypto = require('crypto');

async function generateSalt(req, res) {
    //generuje salta do haseł (stara wersja)
    crypto.randomBytes(16, (err, salt) => {
        if (err) throw err;
        res.send(salt.toString('hex'));
    });
}
module.exports = generateSalt;