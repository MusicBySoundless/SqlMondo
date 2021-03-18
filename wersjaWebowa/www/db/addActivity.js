const fs = require('fs');
const compare = require('./compareStartTime');



function addActivity(req, res, next) {
	//plik dodaje nową aktywność, pobiera dane z posta, zapisywane jest w pliku .json na serwerze 
	let nazwa = req.body.Nazwa;
    let start = req.body.StartTime;
    let end = req.body.EndTime;
    let date = req.body.Data;
    let rodzaj = req.body.Rodzaj;
    let uwagi = req.body.Uwagi;
    let kalorie = req.body.Kalorie;
    let kroki = req.body.Kroki;
    let km = req.body.Kilometry;

	if (!nazwa || !start || !end || !date || !rodzaj || !uwagi || !kalorie || !kroki || !km){
		req.resCode = 400;
		return next();
	}

	if (start >= end){ //nie można skończyć aktywności przed zaczęciem jej
		req.resCode = 400;
		return next();
	}

	fs.stat(`./user_progress/${req.session.user.username}.json`, function(err, stat) { //sprawdza, czy plik istnieje
		if(err == null) {
			fs.readFile(`./user_progress/${req.session.user.username}.json`, (err, rawdata) => {
				let data = JSON.parse(rawdata);
				if (data[date]){
					let unique = true;
                    data[date].forEach(elem => {
                        if(elem.StartTime == start){
                            unique = false;
                        }
                    });
                    if (unique) data[date].push({"Nazwa": `${nazwa}`, "Rodzaj": `${rodzaj}`, "StartTime": `${start}`, "EndTime": `${end}`, "Uwagi": `${uwagi}`, "Kalorie": `${kalorie}`, "Kroki": `${kroki}`, "Kilometry": `${km}`});

                    else{ //StartTime powinien być unikatowy, jeśli próbuje się dodać 2 aktywności w tym samym czasie, to wywala błąd
						req.resCode = 400;
						return next();
					}
				}
				else{
					data[date] = [{"Nazwa": `${nazwa}`, "Rodzaj": `${rodzaj}`, "StartTime": `${start}`, "EndTime": `${end}`, "Uwagi": `${uwagi}`, "Kalorie": `${kalorie}`, "Kroki": `${kroki}`, "Kilometry": `${km}`}];
				}
				//sortuje plik, najpierw są najnowsze daty
				//tego może być dużo, więc może szybciej by było zamienić na wpisywanie tego od razu w odpowiednie miejsce
				//ale to na przyszłość, na razie może być tak
				data = Object.keys(data).sort().reverse().reduce(
					(obj, key) => { 
						obj[key] = data[key]; 
						return obj;
					}, 
					{}
				);
				for (const dat in data) { //najpierw najwcześniejsza aktywność
					data[dat].sort(compare)
				}
				data = JSON.stringify(data);
				fs.writeFile(`./user_progress/${req.session.user.username}.json`, data, (err) => {
					if (err){
						req.errMsg = err.message;
						req.resCode = 500;
						return next();
					}
					req.resCode = 200;
					return next();
				});
			});
		} else if(err.code === 'ENOENT') {
			data = `{"${date}": [{"Nazwa": "${nazwa}", "Rodzaj": "${rodzaj}", "StartTime": "${start}", "EndTime": "${end}", "Uwagi": "${uwagi}", "Kalorie": "${kalorie}", "Kroki": "${kroki}", "Kilometry": "${km}"}]}`
			fs.writeFile(`./user_progress/${req.session.user.username}.json`, data, (err) => {
				if (err){
					req.errMsg = err.message;
					req.resCode = 500;
					return next();
				}
				req.resCode = 200;
				return next();
			});
		} else {
			req.errMsg = err.message;
			req.resCode = 500;
			return next();									            
		}
	});
}
module.exports = addActivity;
