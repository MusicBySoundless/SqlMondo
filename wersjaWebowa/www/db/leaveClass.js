const pool = require('../mariaPool');

async function leaveClass(req, res, next) {
    //opuszczenie klasy przez ucznia (w bazie id_klasy ustawiane jest na null)
    let conn;
    if (req.session.user.typ != 'uczen') return res.sendStatus(403);
    try {
        conn = await pool.getConnection();
        const result = await conn.query(`Update Uczniowie SET id_klasy = NULL WHERE id_ucznia = ${req.session.user.id}`, [1, "mariadb"]);
        if (result.affectedRows == 0){
            req.resCode = 500;
            req.errMsg = "Błąd serwera";
        }
        else{
            req.resCode = 200;
        }
    } catch (err) {
        req.resCode = 500
        req.errMsg = err.message;
    } finally {
        next();
        if (conn) return conn.end();
    }
}

module.exports = leaveClass;