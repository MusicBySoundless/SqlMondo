const pool = require('../mariaPool');
const crypto = require('crypto');


async function resetPassword(req, res, next) {
    //reset hasła w przypadku zapomnienia
    let conn;
    try{
        conn = await pool.getConnection();
        const result = await conn.query({rowsAsArray:true, sql: `SELECT typ, id_typ, waznosc FROM ZapomnianeHaslo WHERE url = '${req.params.url}'`});
        if (result.length === 1){
            let date_ob = new Date();

 
            let date = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let seconds = date_ob.getSeconds();
            let formatted = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

            if (formatted > result[0][2]){ // sprawdza, czy link nie wygasł
                res.sendStatus(404);
            }
            else{
                let table = (result[0][0] == "uczen")? "Uczniowie": "Nauczyciele";
                let id = (table == "Uczniowie")? "id_ucznia": "id_nauczyciela";
                const check = await conn.query({rowsAsArray:true, sql: `SELECT salt FROM ${table} WHERE ${id} = ${result[0][1]}`});
                if (check.length === 1){
                    const update = await conn.query(`UPDATE ${table} SET haslo = '${crypto.createHash("sha256").update(req.body.password+check[0][0]).digest("hex")}' WHERE ${id} = ${result[0][1]}`, [1, "mariadb"]);
                    if (update.affectedRows == 0){
                        //res.send(500).send("Nie istnieje podane konto");
                        req.flash('komunikat', "Nie udało się zmienić hasła, spróbuj ponownie później");
                        res.redirect('/login/login');
                    }
                    else{
                        //res.status(200).send("Hasło zostało zmienione");
                        req.flash('komunikat', "Pomyślnie zmieniono hasło");
                        res.redirect('/login/login');
                        await conn.query(`DELETE FROM ZapomnianeHaslo WHERE typ = '${result[0][0]}' AND id_typ = ${result[0][1]}`, [1, "mariadb"]);
                    }
                }
                else{
                    res.sendStatus(404);
                }
            }
        }
        else{
            res.sendStatus(404);
        }
    }
    catch (error){
        //req.resCode = 500;
        //req.errMsg = error.message;
        res.status(500).send(error.message);
    }
    finally{
        if (conn) return conn.end();
    }
	
}

module.exports = resetPassword;