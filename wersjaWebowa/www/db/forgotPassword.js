const pool = require('../mariaPool');

async function forgotPassword(req, res, next) {
    //w przypadku zapomnienia hasła, dodaje wpis do bazy danych
    if (req.resCode == 500) next();

    let conn;
    
    //jutrzejsza data jako data wygaśnięcia
    let date_ob = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    //dzięki 0 i slice zawsze będą 2 cyfry tj. np. 03 zamiast 3
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2); //+1, bo zaczyna się od 0
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    // format YYYY-MM-DD HH-MM-SS
    let formatted = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    try {
        conn = await pool.getConnection();
        const login = await conn.query({rowsAsArray:true, sql: `SELECT id_ucznia FROM Uczniowie  WHERE login = '${req.body.email}'`});
        if (login.length == 1){
            const result = await conn.query(`INSERT INTO ZapomnianeHaslo values (NULL, 'uczen', ${login[0][0]}, '${formatted}', '${req.rand}')`, [1, "mariadb"]);
            req.resCode = 200;
        }
        else{
            const login2 = await conn.query({rowsAsArray:true, sql: `SELECT id_nauczyciela FROM Uczniowie  WHERE login = '${req.body.email}'`});
            if (login2.length == 1){
                const result = await conn.query(`INSERT INTO ZapomnianeHaslo values (NULL, 'nauczyciel', ${login2[0][0]}, '${formatted}', '${req.rand}')`, [1, "mariadb"]);
                req.resCode = 200;
            }
            else{
                req.resCode = 400;
            }
        }
    } catch (err) {
        req.resCode = 500;
        req.errMsg = err.message;
    } finally {
        next();
        if (conn) return conn.end();
    }
}
module.exports = forgotPassword;