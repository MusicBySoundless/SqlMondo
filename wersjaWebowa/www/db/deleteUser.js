const pool = require('../mariaPool');
const crypto = require('crypto');

async function deleteUser(req, res, next) {
    //usunięcie konta użytkownika, w tej chwili nie jest nigdzie podpięte, można na przyszłość zostawić
    //TODO usunięcie też jsona
    let conn;
    if (!req.body.haslo){
        req.resCode = 400;
		return next();
    }
    try {
        conn = await pool.getConnection();
        let table = (req.session.user.typ == "uczen")? "Uczniowie": "Nauczyciele";
        const salt = await conn.query({rowsAsArray:true, sql: `SELECT salt FROM ${table} WHERE login = '${req.session.user.username}'`});
        if (salt.length === 1){
            const result = await conn.query(`DELETE FROM ${table} WHERE login = '${req.session.user.username}' AND haslo = '${crypto.createHash("sha256").update(req.body.haslo+salt[0][0]).digest("hex")}'`, [1, "mariadb"]);
            req.resCode = 200;
        }
        else{
            req.resCode = 401;
        }
        
    } catch (err) {
        req.errMsg = err.message;
		req.resCode = 500;
    } finally {
        next();
        if (conn) return conn.end();
    }
}

module.exports = deleteUser;