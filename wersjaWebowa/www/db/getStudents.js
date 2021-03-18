const pool = require('../mariaPool');

async function getStudents(req, res,next) {
    //pobiera uczniów danej klasy
    let conn;
    try {
        conn = await pool.getConnection();;
        const uczniowie = await conn.query({rowsAsArray:true, sql: `SELECT imie, nazwisko, userID FROM Uczniowie WHERE id_klasy = ${req.query.classCode}`});
        req.listaUczniow =uczniowie;
        next();
    } catch (err) {
        res.status(500).send(err.message)
    } finally {
        if (conn) return conn.end();
    }
}

module.exports = getStudents;