const pool = require('../mariaPool');

async function deleteClass(req, res, next) {
    //usunięcie klasy z bazy danych przez nauczyciela. U uczniów, którzy byli w tej klasie
    //id_klasy w bazie zmieni się na NULL (za pomocą on delete null w bazie)
    let conn;
    try {
        conn = await pool.getConnection();
        //jest wyszkuanie po kodzie klasy
        const klasa = await conn.query({rowsAsArray:true, sql: `SELECT id_klasy, id_nauczyciela_zew FROM Klasy WHERE kod_klasy = '${req.body.class_code}'`});
        if (klasa.length === 1){
            if (klasa[0][1] != req.session.user.id) req.resCode = 403; //sprawdza, czy na pewno nauczyciel, który to robi jest właścicielem klasy
            else{
                const result = await conn.query(`DELETE FROM Klasy WHERE kod_klasy = '${req.body.class_code}'`, [1, "mariadb"]);
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

module.exports = deleteClass;
