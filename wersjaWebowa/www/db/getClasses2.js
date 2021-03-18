const pool = require('../mariaPool');

async function getClasses2(req, res,next) {
    //pobiera klasy danego nauczyciela
    let conn;
    try {
        conn = await pool.getConnection();
        const klasy = await conn.query({rowsAsArray:true, sql: `SELECT nazwa, kod_klasy, id_klasy FROM Klasy WHERE id_nauczyciela_zew = '${req.session.user.id}'`});
        req.klasy = klasy;
        next();
    } catch (err) {
        res.send(err.message)
    } finally {
        if (conn) return conn.end();
    }
}

module.exports = getClasses2;