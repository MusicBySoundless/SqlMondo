const pool = require('../../mariaPool');
const crypto = require('crypto');
const fs = require('fs');

// req.classCode
async function nowyUczen(req, res) {
    //rejestracja w aplikacji mobilnej
    if (req.resCode == 500) return res.status(500).json({msg: 500})
    let conn;
    try {
        conn = await pool.getConnection();
        if (typeof(req.body.class_code) == 'undefined'){
            const login = await conn.query({rowsAsArray:true, sql: `SELECT Nauczyciele.login, Uczniowie.login FROM Uczniowie, Nauczyciele WHERE Nauczyciele.login = '${req.body.mail}' OR Uczniowie.login = '${req.body.mail}'`});
            if (login.length === 0){    
                const result = await conn.query(`INSERT INTO Uczniowie values (NULL, '${req.body.name}', '${req.body.last_name}', NULL, '${req.body.mail}', '${crypto.createHash("sha256").update(req.body.mail).digest("hex")}', '${crypto.createHash("sha256").update(req.body.password+req.salt).digest("hex")}', '${req.salt}')`, [1, "mariadb"]);
                res.status(200).json({msg:201});
                let data = {};
                let username = crypto.createHash("sha256").update(req.body.mail).digest("hex");
                fs.writeFile(`./user_progress/${username}.json`, JSON.stringify(data), err => {
                    if (err) console.log(err);
                });
            }
            else{
                res.status(400).json({msg:2});
            }
        }
        else{
            const klasa = await conn.query({rowsAsArray:true, sql: `SELECT id_klasy FROM Klasy WHERE kod_klasy = '${req.body.class_code}'`});
            if (klasa.length === 1){
                const id_klasy = klasa[0][0];
                const login = await conn.query({rowsAsArray:true, sql: `SELECT Nauczyciele.login, Uczniowie.login FROM Uczniowie, Nauczyciele WHERE Nauczyciele.login = '${req.body.mail}' OR Uczniowie.login = '${req.body.mail}'`});
                if (login.length === 0){
                    const result = await conn.query(`INSERT INTO Uczniowie values (NULL, '${req.body.name}', '${req.body.last_name}', ${id_klasy}, '${req.body.mail}', '${crypto.createHash("sha256").update(req.body.mail).digest("hex")}', '${crypto.createHash("sha256").update(req.body.password+req.salt).digest("hex")}', '${req.salt}')`, [1, "mariadb"]);
                    res.status(200).json({msg:201});
                    let data = {};
                    let username = crypto.createHash("sha256").update(req.body.mail).digest("hex");
                    fs.writeFile(`./user_progress/${username}.json`, JSON.stringify(data), err => {
                        if (err) console.log(err);
                    });
                }
                else{
                    res.status(400).json({msg:2});
                } 
            }
            else{
                res.status(400).json({msg:3});
            }
        }
    } catch (err) {
        res.status(500).json({msg:500})
    } finally {
        if (conn) return conn.end();
    }
}

module.exports = nowyUczen;