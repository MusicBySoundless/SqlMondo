const fs = require('fs');
const {verify} = require('../../tokens');
const compare = require('../compareStartTime');

function editActivity(req, res) {
	//edycja aktywności przez aplikację mobilną

    let nazwa = req.body.Nazwa;
    let oldStart = req.body.OldStartTime;
    let newStart = req.body.NewStartTime;
    let end = req.body.EndTime;
    let date = req.body.Data.split('T')[0];
    let rodzaj = req.body.Rodzaj;
    //let rodzajId = req.body.RodzajId;
	/*let rodzajId;
	switch (rodzaj){
		case "Bieg": rodzajId = 0; break;
		case "Inna": rodzajId = 1; break;
		case "Jazda na rowerze": rodzajId = 2; break;
		case "Spacer": rodzajId = 3; break;
		default: return res.status(400).send("Niepoprawny rodzaj"); break;
	}*/
    let uwagi = req.body.Uwagi;
    let kalorie = req.body.Kalorie;
    let kroki = req.body.Kroki;
    let km = req.body.Kilometry;

    //jeżeli przesyłane w nagłówku
	//let payload = verify(req.headers['x-access-token']);
	//jeżeli w body
	let payload = verify(req.body.token);
	if (!payload) return res.sendStatus(418);
	let username = payload.username;

	if (!nazwa || !oldStart || !newStart || !end || !date || !rodzaj || !uwagi || !kalorie || !kroki || !km) return res.status(400).send("Brak niektórych danych");

    if (newStart >= end){
		return res.status(400).json({
			msg: 3
		});
	}

    fs.stat(`./user_progress/${username}.json`, function(err, stat) {
        if(err == null) {
            fs.readFile(`./user_progress/${username}.json`, (err, rawdata) => {
                let data = JSON.parse(rawdata);

                if (Object.keys(data[oldDate]).length===0){
		            return res.status(400).json({
						msg: 3
					});
                }
				if (oldDate == date && oldStart == newStart){
                    let indeks = data[oldDate].findIndex( ({ StartTime }) => StartTime == oldStart);
                    
                    if (indeks === -1){
                        req.resCode = 400;
                        return next();
                    }
                    data[date][indeks].Nazwa = nazwa;
                    data[date][indeks].EndTime = end;
                    data[date][indeks].Rodzaj = rodzaj;
                    data[date][indeks].Uwagi = uwagi;
                    data[date][indeks].Kalorie = kalorie;
                    data[date][indeks].Kroki = kroki;
                    data[date][indeks].Kilometry = km;
                }
				else{
					if (data[date]){
						let unique = true;
						data[date].forEach(elem => {
							if(elem.StartTime == newStart){
								unique = false;
							}
						});
						if (unique) data[date].push({"Nazwa": `${nazwa}`, "Rodzaj": `${rodzaj}`, "StartTime": `${newStart}`, "EndTime": `${end}`, "Uwagi": `${uwagi}`, "Kalorie": `${kalorie}`, "Kroki": `${kroki}`, "Kilometry": `${km}`});

						else{
							return res.status(400).json({
								msg: 3
							});
						}

						let indeks = data[oldDate].findIndex( ({ StartTime }) => StartTime == oldStart);
						
						if (indeks === -1){
							return res.status(400).json({
								msg: 3
							});
						}

						data[oldDate].splice(indeks, 1);

					
					}
					else{
						let indeks = data[oldDate].findIndex( ({ StartTime }) => StartTime == oldStart);
                    
                        if (indeks === -1){
                            req.resCode = 400;
                            return next();
                        }
                        data[oldDate].splice(indeks, 1);
                        if (data[oldDate] == ""){
                            delete data[oldDate]
                        }
						data[date] = [{"Nazwa": `${nazwa}`, "Rodzaj": `${rodzaj}`, "StartTime": `${newStart}`, "EndTime": `${end}`, "Uwagi": `${uwagi}`, "Kalorie": `${kalorie}`, "Kroki": `${kroki}`, "Kilometry": `${km}`}];
					}
					//tego może być dużo, więc może szybciej by było zamienić na wpisywanie tego od razu w odpowiednie miejsce
					//ale to na przyszłość, na razie może być tak
					data = Object.keys(data).sort().reverse().reduce(
						(obj, key) => { 
							obj[key] = data[key]; 
							return obj;
						}, 
						{}
					);
					for (const dat in data) {
						data[dat].sort(compare)
					}
				}
				data = JSON.stringify(data);
				fs.writeFile(`./user_progress/${username}.json`, data, (err) => {
					if (err){
						return res.status(500).json({
							msg: 500
						});
					}
                    res.status(200).json({
						msg: 201
					});
				});
            });
        } else if(err.code === 'ENOENT') {
		    return res.status(400).json({
				msg: 500
			});
        } else {
            return res.status(500).json({
				msg: 500
			});
        }
    });
}
module.exports = editActivity;