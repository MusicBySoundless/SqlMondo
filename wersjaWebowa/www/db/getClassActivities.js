const fs = require('fs');
const pool = require('../mariaPool');

async function getClassActivities(req, res, next) {
    //pobiera aktywności klasy z plików .json każdego ucznia i łączy te pliki

    let conn;
    try {
        conn = await pool.getConnection();
        //const uczniowie = await conn.query({rowsAsArray:true, sql: `SELECT userID, imie, nazwisko FROM Uczniowie WHERE id_klasy = ${req.params.class_id}`});
        const id_klasy = await conn.query({rowsAsArray:true, sql: `SELECT id_klasy FROM Klasy WHERE kod_klasy = '${req.params.class_id}'`});
        if (id_klasy.length == 0){
            res.sendStatus(404);
        }
        else{
            const uczniowie = await conn.query({rowsAsArray:true, sql: `SELECT userID, imie, nazwisko FROM Uczniowie WHERE id_klasy = ${id_klasy[0][0]}`});
            if (uczniowie.length === 0) req.data = {};
            else{
                var dane = {};
                var i = 0;
                uczniowie.forEach(elem => {
                    fs.readFile(`./user_progress/${elem[0]}.json`, (err, rawdata) => {
                        if (err) console.log(err);
                        let data = JSON.parse(rawdata);
                        // let kto = elem[1] + " " + elem[2];
                        // dane[`${kto}`] = data;
                        // w rezultacie będzie połączenie wszystkich jsonów (obiekt mający wszystkkie aktywności każdego ucznia klasy)
                        for (const date in data){
                            if (dane[date]){
                                data[date].forEach(elem => {
                                    dane[date].push(elem);
                                });
                            }
                            else{
                                dane[date] = data[date];
                            }
                        }
                        i++;
                        //if(i == uczniowie.length) res.send(dane);
                        if(i == uczniowie.length){
                            req.data = dane;
                            next()
                        }
                    });
                });
            }
        }
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    } finally {
        if (conn) return conn.end();
    }
}
module.exports = getClassActivities;