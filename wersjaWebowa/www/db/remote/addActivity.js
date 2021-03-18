const fs = require('fs');
const {verify} = require('../../tokens');
const compare = require('../compareStartTime');

function addActivity(req, res) {
	//dodanie aktywności z aplikacji mobilnej

    let nazwa = req.body.Nazwa;
    let start = req.body.StartTime;
    let end = req.body.EndTime;
    let date = req.body.Data.split('T')[0];
    let rodzaj = req.body.Rodzaj;
    //let rodzajId = req.body.RodzajId;
    let uwagi = req.body.Uwagi;
    let kalorie = req.body.Kalorie;
    let kroki = req.body.Kroki;
    let km = req.body.Kilometry;


    if (!nazwa || !start || !end || !date || !rodzaj || !uwagi || !kalorie || !kroki || !km) return res.status(400).send("Brak niektórych danych");

	//jeżeli przesyłane w nagłówku
	//let payload = verify(req.headers['x-access-token']);
	//jeżeli w body
	let payload = verify(req.body.token);
	if (!payload) return res.sendStatus(418);
	let username = payload.username;

	if (start >= end){
		//return res.status(400).send("Koniec nie może być przed początkiem");
		return res.status(400).json({msg: 3});
	}

	fs.stat(`./user_progress/${username}.json`, function(err, stat) {
		if(err == null) {
			fs.readFile(`./user_progress/${username}.json`, (err, rawdata) => {
				let data = JSON.parse(rawdata);
				if (data[date]){
					let unique = true;
                    data[date].forEach(elem => {
                        if(elem.StartTime == start){
                            unique = false;
                        }
                    });
                    if (unique) data[date].push({"Nazwa": `${nazwa}`, "Rodzaj": `${rodzaj}`, "StartTime": `${start}`, "EndTime": `${end}`, "Uwagi": `${uwagi}`, "Kalorie": `${kalorie}`, "Kroki": `${kroki}`, "Kilometry": `${km}`});

                    //else return res.status(400).send('Aktywność o tej godzinie tego dnia już istnieje');
					else return res.status(400).json({msg: 3});
				}
				else{
					data[date] = [{"Nazwa": `${nazwa}`, "Rodzaj": `${rodzaj}`, "StartTime": `${start}`, "EndTime": `${end}`, "Uwagi": `${uwagi}`, "Kalorie": `${kalorie}`, "Kroki": `${kroki}`, "Kilometry": `${km}`}];
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
					data[dat].sort(compare);
				}
				data = JSON.stringify(data);
				fs.writeFile(`./user_progress/${username}.json`, data, (err) => {
					if (err){
						//return res.status(500).send(err.message);
						return res.status(500).json({msg: 500});
					}
					//return res.sendStatus(200);
					return res.status(200).json({msg: 200});
				});
			});
		} else if(err.code === 'ENOENT') {
			data = `{"${date}": [{"Nazwa": "${nazwa}", "Rodzaj": "${rodzaj}", "StartTime": "${start}", "EndTime": "${end}", "Uwagi": "${uwagi}", "Kalorie": "${kalorie}", "Kroki": "${kroki}", "Kilometry": "${km}"}]}`
			fs.writeFile(`./user_progress/${username}.json`, data, (err) => {
				if (err){
					//return res.status(500).send(err.message);
					return res.status(500).json({msg: 500});
				}
				//return res.send(req.body);
				//return res.sendStatus(200);
				return res.status(200).json({msg: 200});
			});
		} else {
			//return res.status(500).send(err.message);
			return res.status(500).json({msg: 500});
		}
	});
}
module.exports = addActivity;