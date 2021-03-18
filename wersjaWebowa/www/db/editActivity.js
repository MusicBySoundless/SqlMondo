const fs = require('fs');
const compare = require('./compareStartTime')

function editActivity(req, res, next) {
    //edycja aktywności w pliku .json

    let nazwa = req.body.Nazwa;
    let oldStart = req.body.OldStartTime;
    let newStart = req.body.NewStartTime;
    let end = req.body.EndTime;
    let rodzaj = req.body.Rodzaj;
    let uwagi = req.body.Uwagi;
    let kalorie = req.body.Kalorie;
    let kroki = req.body.Kroki;
    let km = req.body.Kilometry;
    let oldDate = req.body.StaraData;
    let date = req.body.NowaData;

    let username = req.session.user.username;

	if (!nazwa || !oldStart || !newStart || !end || !date || !rodzaj || !uwagi || !kalorie || !kroki || !km || !oldDate){
        req.resCode = 400;
		return next();
    }

    if (newStart >= end){ //nie można zacząć aktywności po jej skończeniu
		req.resCode = 400;
		return next();
	}

    fs.stat(`./user_progress/${username}.json`, function(err, stat) { //sprawdza, czy istnieje plik
        if(err == null) {
            fs.readFile(`./user_progress/${username}.json`, (err, rawdata) => {
                let data = JSON.parse(rawdata);

                if (Object.keys(data[oldDate]).length===0){ //nie istnieje taka aktywności
                    req.resCode = 400;
		            return next();
                }
                if (oldDate == date && oldStart == newStart){ //jeśli data aktywności się nie zmienia
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
                else{ // jeśli zmienia się data aktywności
                    if (data[date]){
                        let unique = true;
                        data[date].forEach(elem => {
                            if(elem.StartTime == newStart){
                                unique = false;
                            }
                        });

                        if(!unique){ // jeśli istnieje już aktywność o tym samym początku aktywności, to pokazuje błąd
                            req.resCode = 400;
                            return next();
                        }
                        let indeks = data[oldDate].findIndex( ({ StartTime }) => StartTime == oldStart);
                    
                        if (indeks === -1){ //nie istnieje taka aktywność
                            req.resCode = 400;
                            return next();
                        }
                        data[oldDate].splice(indeks, 1); //usuwa stary wpis
                        data[date].push({"Nazwa": `${nazwa}`, "Rodzaj": `${rodzaj}`, "StartTime": `${newStart}`, "EndTime": `${end}`, "Uwagi": `${uwagi}`, "Kalorie": `${kalorie}`, "Kroki": `${kroki}`, "Kilometry": `${km}`});
                        if (data[oldDate] == ""){ //jeśli przy indeksie ze starą datą nie ma już danych, to usuwa ten indeks
                            delete data[oldDate]
                        }
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
        } else if(err.code === 'ENOENT') { //plik nie istnieje
            req.resCode = 400;
		    return next();
        } else {
            req.errMsg = err.message;
			req.resCode = 500;
			return next();
        }
    });
}
module.exports = editActivity;