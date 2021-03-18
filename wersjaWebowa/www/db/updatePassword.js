const pool = require('../mariaPool');
const crypto = require('crypto');

async function updatePassword(req, res, next) {
    //zmiana hasła jeżeli zna się swoje hasło
    let conn;
    if (typeof(req.body.current_password) == 'undefined' || typeof(req.body.new_password) == 'undefined' || typeof(req.body.repeat_new_password) == 'undefined'){
        //req.resCode = 400
        req.resCode = 500;
        req.errMsg = "pier"
		return next();
    }
    if (req.body.new_password !== req.body.repeat_new_password){
        //req.resCode = 400;
        req.resCode = 500;
        req.errMsg = "powtorz"
		return next();
    }
    try {
        conn = await pool.getConnection();
        //let table = (req.session.user.typ == "uczen")? "Uczniowie": "Nauczyciele";
        if (req.session.user.typ == "uczen"){
            const salt = await conn.query({rowsAsArray:true, sql: `SELECT salt FROM Uczniowie WHERE id_ucznia = ${req.session.user.id}`});
            if (salt.length === 1){
                const result = await conn.query(`UPDATE Uczniowie SET haslo = '${crypto.createHash("sha256").update(req.body.new_password+salt[0][0]).digest("hex")}' WHERE id_ucznia = ${req.session.user.id} AND haslo = '${crypto.createHash("sha256").update(req.body.current_password+salt[0][0]).digest("hex")}'`, [1, "mariadb"]);
                if (result.affectedRows == 0){
                    req.resCode = 500;
                    req.errMsg = "Błędne hasło";
                }
                else{
                    req.resCode = 200;
                }
            }
            else{
                req.resCode = 500;
                req.errMsg = "Spróbuj ponownie za chwilę";
            }
        }
        else{
            const salt = await conn.query({rowsAsArray:true, sql: `SELECT salt FROM Nauczyciele WHERE id_nauczyciela = ${req.session.user.id}`});
            if (salt.length === 1){
                const result = await conn.query(`UPDATE Nauczyciele SET haslo = '${crypto.createHash("sha256").update(req.body.new_password+salt[0][0]).digest("hex")}' WHERE id_nauczyciela = ${req.session.user.id} AND haslo = '${crypto.createHash("sha256").update(req.body.current_password+salt[0][0]).digest("hex")}'`, [1, "mariadb"]);
                if (result.affectedRows == 0){
                    req.resCode = 500;
                    req.errMsg = "Błędne hasło";
                }
                else{
                    req.resCode = 200;
                }
            }
            else{
                req.resCode = 500;
                req.errMsg = "Spróbuj ponownie za chwilę";
            }
        }
  
    } catch (err) {
        //console.log(err.message);
        req.errMsg = err.message;
		req.resCode = 500;
    } finally {
        next();
        if (conn) return conn.end();
    }
}

module.exports = updatePassword;