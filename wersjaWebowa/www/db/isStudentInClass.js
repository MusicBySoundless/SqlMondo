const pool = require('../mariaPool');

async function isStudentInClass(req, res,next) {
    //sprawdza, czy użytkownik jest w klasie jeśli tak zwracana jest nazwa klasy, jak nie to false
    let conn;
    try {
        conn = await pool.getConnection();
        const klasy = await conn.query({rowsAsArray:true, sql: `SELECT id_klasy FROM Uczniowie WHERE id_ucznia = ${req.session.user.id}`});
        if (klasy[0][0] == null){
            req.inClass = false;
        }
        else{
            const klasa = await conn.query({rowsAsArray:true, sql: `SELECT nazwa FROM Klasy WHERE id_klasy = ${klasy[0][0]}`});
            req.inClass = klasa[0][0];
        }
    } catch (err) {
        res.send(err.message);
    } finally {
        next();
        if (conn) return conn.end(); 
        
    }
}

module.exports = isStudentInClass;