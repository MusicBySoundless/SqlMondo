const fs = require('fs');
//notatka - jeśli bezie potrzebne aktywności z przediału dat, to użyć for ... in oraz Date.parse()

function getActivities(req, res) {
    //pobranie aktywności przez aplikację mobilną

    //jeżeli przesyłane w nagłówku
	//let payload = verify(req.headers['x-access-token']);
	//jeżeli w body
	let payload = verify(req.body.token);
	if (!payload) return res.status(418).json({
        msg: 401
    });
	let username = payload.username;
    fs.stat(`./user_progress/${username}.json`, function(err, stat) {
        if(err == null) {
            fs.readFile(`./user_progress/${username}.json`, (err, rawdata) => {
                let data = JSON.parse(rawdata);
                let arr = [];
                for (const date in data) {
                    let mobileDate = date + "T00:00:00+01:00";
                    for (const prop in data[date]){
                        let rodz = data[date][prop].Rodzaj;
                        let rodzajId;
                        switch (rodz){
                            case "Bieg": rodzajId = 0; break;
                            case "Inna": rodzajId = 1; break;
                            case "Jazda na rowerze": rodzajId = 2; break;
                            case "Spacer": rodzajId = 3; break;
                            //default: return res.status(400).send("Niepoprawny rodzaj"); break;
                            default: return res.status(400).json({msg: 500});
                        }
                        data[date][prop].RodzajId = rodzajId;
                        data[date][prop].Data = mobileDate;
                        arr.push(data[date][prop]);
                    }
                  }
                return res.status(200).json({
                    msg: 200,
                    dane: arr
                });
            });
        } else if(err.code === 'ENOENT') {
                return res.status(400).json({
                    msg: 500
                });
        } else {
            //console.log('Some other error: ', err.code, err.message);
            return res.status(500).json({
                msg: 500
            });
            
        }
    });
}
module.exports = getActivities;