const pool = require('../mariaPool');
const crypto = require('crypto');


async function log(req, res) {
    //logowanie, dane przechowywane są w sesji
  
    let conn;
        
    try {
        conn = await pool.getConnection();
        const salt1 = await conn.query({rowsAsArray:true, sql: `SELECT salt FROM Uczniowie WHERE login = '${req.body.login}'`});
        if (salt1.length === 1){ //jest to konto ucznia
            const rows = await conn.query({rowsAsArray:true, sql: `SELECT login, haslo, imie, nazwisko, id_ucznia FROM Uczniowie WHERE login = '${req.body.login}' AND haslo = '${crypto.createHash("sha256").update(req.body.password+salt1[0][0]).digest("hex")}'`});
            if (rows.length === 1){
                const nazwisko = rows[0][3];
                const imie = rows[0][2];
                const id = rows[0][4];
                loggedin = true;
                username = crypto.createHash("sha256").update(req.body.login).digest("hex");
                req.session.user = { imie, nazwisko, id, typ: "uczen", username, loggedin};
                res.redirect(`/user/${req.session.user.username}`)
            }
            else{
                req.flash('test', 'błędne hasło')
                res.redirect('/login/login/');
            }
        }
        else {
            const salt2 = await conn.query({rowsAsArray:true, sql: `SELECT salt FROM Nauczyciele WHERE login = '${req.body.login}'`});
            if (salt2.length === 1){ //jest to konto nauczyciela
                const rows2 = await conn.query({rowsAsArray:true, sql: `SELECT login, haslo, imie, nazwisko, id_nauczyciela FROM Nauczyciele WHERE login = '${req.body.login}' AND haslo = '${crypto.createHash("sha256").update(req.body.password+salt2[0][0]).digest("hex")}'`});
                if (rows2.length === 1){
                    const nazwisko = rows2[0][3];
                    const imie = rows2[0][2];
                    const id = rows2[0][4];
                    loggedin = true;
                    username = crypto.createHash("sha256").update(req.body.login).digest("hex");
                    req.session.user = { imie, nazwisko, id, typ: "nauczyciel", username, loggedin };
                    res.redirect(`/user/${req.session.user.username}`)
                }
                else{
                    //dodałem nowy package connect-flash - pozwala na przekazywanie wiadomości przy redirect'cie
                    //res.redirect('/login/login/?auth_error=true');
                    req.flash('test', 'błędne hasło')
                    res.redirect('/login/login/');
                }
            }
            else { //nie istnieje takie konto
                req.flash('test', 'błędny login')
                res.redirect('/login/login/');
            }
           
        }

    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
}

module.exports = log;