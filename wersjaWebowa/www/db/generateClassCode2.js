const crypto = require('crypto');
const pool = require('../mariaPool');

async function generateClassCode2(req, res, next) {
    //generuje losowy kod dołączenia do klasy do zapisania w bazie (nowa wersja)
    let  done = false;
    let conn;
    
    try {
        conn = await pool.getConnection();
        while (!done){
            let code = crypto.randomInt(100_000, 999_999).toString();
            let kod = await conn.query({rowsAsArray:true, sql: `SELECT id_klasy FROM Klasy WHERE kod_klasy = '${code}'`});
            if (kod.length === 0){
                req.classCode = code;
                done = true;
            }
        }
        
    } catch (err) {
        req.resCode = 500;
        req.errMsg = error.message;
    } finally {
        next();
        if (conn) return conn.end();
    }
}
module.exports = generateClassCode2;