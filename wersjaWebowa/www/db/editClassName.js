const pool = require('../mariaPool');

async function editClassName(req, res, next) {
    //zmienia nazwę klasy w bazie, robione przez nauczyciela
    let conn;
    try {
        conn = await pool.getConnection();
        //jest wyszkuanie po kodzie klasy
        const klasa = await conn.query({rowsAsArray:true, sql: `SELECT id_klasy, id_nauczyciela_zew FROM Klasy WHERE kod_klasy = '${req.body.class_code}'`});
        if (klasa.length === 1){
            if (klasa[0][1] != req.session.user.id || req.session.user.typ != "nauczyciel") req.resCode = 403; // sprawdza, czy nauczyciel, który to robi na pewno jest właścicielem klasy
            else{
                const result = await conn.query(`Update Klasy SET nazwa = '${req.body.class_name}' WHERE kod_klasy = '${req.body.class_code}'`, [1, "mariadb"]);
                req.resCode = 200;
            }
        }
        else{
            req.resCode = 400;
        }
    } catch (err) {
        req.resCode = 500;
        req.errMsg = err.message;
    } finally {
        next();
        if (conn) return conn.end();
    }
}

module.exports = editClassName;
