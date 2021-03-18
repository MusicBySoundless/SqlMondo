const { readFileSync } = require('fs');
//const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const privateKEY  = readFileSync('./private.key', 'utf8');
const publicKEY  = readFileSync('./public.key', 'utf8');
const options = {
    expiresIn:  "7d",
    //expiresIn:  "1m",
    algorithm:  "RS256"
}
module.exports = {
    sign: (payload) => {
        return jwt.sign(payload, privateKEY, options);
    },
    verify: (token) => {
        try{
            //console.log(token);
            return jwt.verify(token, publicKEY, options);
        }
        catch (err){
            //console.log(err);
            return false;
        }
    },
    decode: (token) => {
        return jwt.decode(token, {complete: true});
     }
}

//funkcje z tokenami do aplikacji mobilnej