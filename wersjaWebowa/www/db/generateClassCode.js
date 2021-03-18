const crypto = require('crypto');
const pool = require('../mariaPool');

async function generateClassCode(req, res) {
    //generuje losowy kod dołączenia do klasy, do zapisania w bazie (dawna wersja)
    let  done = false;
    let conn;
    
    try {
        conn = await pool.getConnection();
        while (!done){
            let code = crypto.randomInt(100_000, 999_999).toString();
            let kod = await conn.query({rowsAsArray:true, sql: `SELECT id_klasy FROM Klasy WHERE kod_klasy = '${code}'`});
            if (kod.length === 0){
                res.send(code);
                done = true;
            }
        }
        
    } catch (err) {
        res.send(err.message)
    } finally {
        if (conn) return conn.end();
    }
}
module.exports = generateClassCode;