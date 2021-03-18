const pool = require('../mariaPool');
const crypto = require('crypto');
const http = require('http');
const { body,validationResult } = require('express-validator');
const fs = require('fs');


function loginUsed (req, res, values){
    //ten login już istnieje
    req.flash('errors', [ { "email": { "msg": "Użytkownik o podanym emailu już istnieje" } } ]);
    req.flash('values', values);
    res.redirect('/login/register');
}
function createFile (mail){
    //tworzenie pustego jsona
    let data = {};
    let username = crypto.createHash("sha256").update(mail).digest("hex");
    fs.writeFile(`./user_progress/${username}.json`, JSON.stringify(data), err => {
        if (err) console.log(err);
    });
}

async function nowyUczen(req, res) {
    //stworzenie konta ucznia lub nauczyciela (zależy od danych z POSTa) i zapisanie ich w bazie

    //walidacja danych
    if (req.resCode == 500){
        req.flash('errors', [ { "class_code": { "msg": "Błąd serwera, spróbuj ponownie później" } } ]);
        req.flash('values', values);
        return res.redirect('/login/register');
    }
    const values = {"name": req.body.name, "last_name": req.body.last_name, "email": req.body.email, "class_code": req.body.class_code}
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //return res.send(errors.mapped());
        req.flash('errors', errors.mapped());
        req.flash('values', values);
        return res.redirect('/login/register');
    }
    if (req.body.password !== req.body.password_repeat){
        req.flash('errors', [ { "password": { "msg": "Hasła się nie zgadzają" } } ]);
        req.flash('values', values);
        return res.redirect('/login/register');
    }
    let conn;
    try {
        conn = await pool.getConnection();
        if (req.body.account_type != 'nauczyciel'){ //konto ucznia
            if (typeof(req.body.class_code) == 'undefined' || req.body.class_code == ""){ //kod nie jest podany
                const login = await conn.query({rowsAsArray:true, sql: `SELECT Nauczyciele.login, Uczniowie.login FROM Uczniowie, Nauczyciele WHERE Nauczyciele.login = '${req.body.email}' OR Uczniowie.login = '${req.body.email}'`});
                if (login.length == 0){
                    const result = await conn.query(`INSERT INTO Uczniowie values (NULL, '${req.body.name}', '${req.body.last_name}', NULL, '${req.body.email}', '${crypto.createHash("sha256").update(req.body.email).digest("hex")}', '${crypto.createHash("sha256").update(req.body.password+req.salt).digest("hex")}', '${req.salt}')`, [1, "mariadb"]);
                    req.flash('komunikat', 'Utworzono konto bez klasy, żeby dołączyć do klasy, użyj edycji profilu.');
                    res.redirect('/login/login/');
                    createFile(req.body.email);
                }
                else{
                    loginUsed(req, res, values);
                } 
            }
            else{
                const klasa = await conn.query({rowsAsArray:true, sql: `SELECT id_klasy, nazwa FROM Klasy WHERE kod_klasy = '${req.body.class_code}'`});
                if (klasa.length === 1){ //poprawny kod
                    const id_klasy = klasa[0][0];
                    const login = await conn.query({rowsAsArray:true, sql: `SELECT Nauczyciele.login, Uczniowie.login FROM Uczniowie, Nauczyciele WHERE Nauczyciele.login = '${req.body.email}' OR Uczniowie.login = '${req.body.email}'`});
                    if (login.length === 0){
                        // http.get('http://46.41.137.179/api/salt', (resp) => {
                        //     let salt = '';
                        //     resp.on('data', (chunk) => {
                        //         salt += chunk;
                        //     });
                        //     resp.on('end', () => {
                        //         sql(req, res, salt, conn, id_klasy);
                        //     });
                        // }).on("error", (err) => {
                        //     res.status(500).send("Error: " + err.message);
                        // });
                        const result = await conn.query(`INSERT INTO Uczniowie values (NULL, '${req.body.name}', '${req.body.last_name}', ${id_klasy}, '${req.body.email}', '${crypto.createHash("sha256").update(req.body.email).digest("hex")}', '${crypto.createHash("sha256").update(req.body.password+req.salt).digest("hex")}', '${req.salt}')`, [1, "mariadb"]);
                        req.flash('komunikat', `Pomyślnie utworzono konto. Dołączono do klasy ${klasa[0][1]}`);
                        res.redirect('/login/login/');
                        createFile(req.body.email);
                    }
                    else{
                        loginUsed(req, res, values);
                    } 
                }
                else{ //niepoprany kod klasy (nie istnieje taki w bazie)
                    // req.flash('errors', [ { "class_code": { "msg": "Klasa z podanym kodem nie istnieje" } } ]);
                    // req.flash('values', values);
                    // res.redirect('/login/register');
                    const login = await conn.query({rowsAsArray:true, sql: `SELECT Nauczyciele.login, Uczniowie.login FROM Uczniowie, Nauczyciele WHERE Nauczyciele.login = '${req.body.email}' OR Uczniowie.login = '${req.body.email}'`});
                    if (login.length === 0){
                        const result = await conn.query(`INSERT INTO Uczniowie values (NULL, '${req.body.name}', '${req.body.last_name}', NULL, '${req.body.email}', '${crypto.createHash("sha256").update(req.body.email).digest("hex")}', '${crypto.createHash("sha256").update(req.body.password+req.salt).digest("hex")}', '${req.salt}')`, [1, "mariadb"]);
                        req.flash('komunikat', 'Podany kod klasy nie istnieje. Utworzono konto bez klasy, żeby dołączyć do klasy, użyj edycji profilu.');
                        res.redirect('/login/login/');
                        createFile(req.body.email);
                    }
                    else{
                        loginUsed(req, res, values);
                    }
                }
            }
        }
        else{ //konto nauczyciela
            const login = await conn.query({rowsAsArray:true, sql: `SELECT Nauczyciele.login, Uczniowie.login FROM Uczniowie, Nauczyciele WHERE Nauczyciele.login = '${req.body.email}' OR Uczniowie.login = '${req.body.email}'`});
            if (login.length === 0){
                const result = await conn.query(`INSERT INTO Nauczyciele values (NULL, '${req.body.name}', '${req.body.last_name}', '${req.body.email}', '${crypto.createHash("sha256").update(req.body.password+req.salt).digest("hex")}', '${req.salt}')`, [1, "mariadb"]);
                req.flash('komunikat', 'Pomyślnie utworzono konto nauczyciela.');
                res.redirect('/login/login/');
            }
            else{
                loginUsed(req, res, values);
            }
        }
    } catch (err) {
        res.status(500).send(err.message)
    } finally {
        if (conn) return conn.end();
    }
}

module.exports = nowyUczen;
