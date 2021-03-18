const pool = require('../mariaPool');

async function editClassName(req, res, next) {
    //usunięcie ucznia z klasy z bazy danych, robione przez nauczyciela (id_klasy u ucznia ustawiane jest na null)
    let conn;
    try {
        conn = await pool.getConnection();
        //jest wyszkuanie po kodzie klasy, można zmienić na id, obojętne
        const klasa = await conn.query({rowsAsArray:true, sql: `SELECT id_klasy, id_nauczyciela_zew FROM Klasy WHERE kod_klasy = '${req.body.class_code}'`});
        if (klasa.length === 1){
            if (klasa[0][1] != req.session.user.id || req.session.user.typ != "nauczyciel") req.resCode = 403; //sprawdza, czy na pewno nauczyciel robiący to zapytanie jest właścicielem tej klasy
            else{
                const result = await conn.query(`Update Uczniowie SET id_klasy = NULL WHERE userID = '${req.body.id_ucznia}' AND id_klasy = ${klasa[0][0]}`, [1, "mariadb"]);
                req.resCode = 200;
            }
        }
        else{
            req.resCode = 400
        }
    } catch (err) {
        req.resCode = 500
        req.errMsg = err.message;
    } finally {
        next();
        if (conn) return conn.end();
    }
}

module.exports = editClassName;