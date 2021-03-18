const pool = require('../mariaPool');

async function joinClass(req, res, next) {
    //pozwala na dołączenie do nowej klasy uczniowi, który nie ma klasy
    let conn;
    if (typeof(req.body.class_code) == undefined){
        req.resCode = 400;
		return next();
    }
    if (req.session.user.typ != "uczen"){
        //res.sendStatus(403);
        req.resCode(400);
        return next()
    }
    try {
        conn = await pool.getConnection();
        const klasa = await conn.query({rowsAsArray:true, sql: `SELECT id_klasy FROM Klasy WHERE kod_klasy = '${req.body.class_code}'`});
        if (klasa.length === 1){
            const result = await conn.query(`UPDATE Uczniowie SET id_klasy = '${klasa[0][0]}' WHERE id_ucznia = ${req.session.user.id} AND id_klasy IS NULL`, [1, "mariadb"]);
            req.resCode = 200;
        }
        else{
            req.resCode = 400;
        }
    } catch (err) {
        req.errMsg = err.message;
		req.resCode = 500;
    } finally {
        next();
        if (conn) return conn.end();
    }
}

module.exports = joinClass;