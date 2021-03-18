const pool = require('../../mariaPool');
const crypto = require('crypto');
//const jwt = require('jsonwebtoken');
const {sign} = require('../../tokens')


async function log(req, res) {
    //logowanie z aplikacji mobilnej, autentykacja tokenem
    let conn;

    //console.log('testmob');
    //console.log(req.headers);
    //console.log(req.headers['Authorization']);
    //console.log(req.body);
    //res.send('test');
        
    try {
        conn = await pool.getConnection();
        const salt = await conn.query({rowsAsArray:true, sql: `SELECT salt FROM Uczniowie WHERE login = '${req.body.login}'`});
        if (salt.length === 1){
            const rows = await conn.query({rowsAsArray:true, sql: `SELECT login, haslo, imie, nazwisko, id_ucznia FROM Uczniowie WHERE login = '${req.body.login}' AND haslo = '${crypto.createHash("sha256").update(req.body.password+salt[0][0]).digest("hex")}'`});
            if (rows.length === 1){
                const nazwisko = rows[0][3];
                const imie = rows[0][2];
                const id = rows[0][4];
                //console.log(privateKEY);
                //loggedin = true;
                username = crypto.createHash("sha256").update(req.body.login).digest("hex");
                //req.session.user = { imie, nazwisko, id, typ: "uczen", username, loggedin};
                let payload = {
                    id,
                    imie,
                    nazwisko,
                    username
                };
                let token = sign(payload);
                //console.log(token);
                /*let test = verify(token);
                console.log(test);
                console.log(test.id);*/
                res.status(200).json({
                    token,
                    msg: 1
                })
                //res.send("Zalogowano poprawnie");
            }
            else {
                res.status(401).json({
                    token: null,
                    msg: 2
                })
            }
        }
        else{
            res.status(401).json({
                token: null,
                msg: 2
            })
        }
        
    
    } catch (err) {
        res.status(500).json({
            token: null,
            msg: 500
        })
    } finally {
        if (conn) return conn.end();
    }
}

module.exports = log;