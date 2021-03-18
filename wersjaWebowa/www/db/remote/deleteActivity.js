const fs = require('fs');
const {verify} = require('../../tokens');

function deleteActivity(req, res) {
	//usunięcie aktywności przez aplikację mobilną


	//jeżeli przesyłane w nagłówku
	//let payload = verify(req.headers['x-access-token']);
	//jeżeli w body
	let payload = verify(req.body.token);
	if (!payload) return res.status(418).json({msg: 403});
	let username = payload.username;
	if (!req.body.Data || !req.body.startTime) return res.status(400).json({msg: 400});
	fs.stat(`./user_progress/${username}.json`, function(err, stat) {
		if(err == null) {
			fs.readFile(`./user_progress/${username}.json`, (err, rawdata) => {
				let data = JSON.parse(rawdata);

				if (Object.keys(data[req.body.date]).length===0) return res.status(400).json({msg: 3});

				//usuwane jest po godzinie dodania, która zakładam, że jest unikatowa
				let indeks = data[req.body.date].findIndex( ({ StartTime }) => StartTime == req.body.startTime);
				if (indeks === -1) return res.status(400).json({msg: 3});

				//if (Object.keys(data[req.body.date]).length!=0) data[req.body.date].splice(indeks, 1);
				data[req.body.date].splice(indeks, 1);

				if (data[req.body.date] == ""){
					delete data[req.body.date]
				}

				if (Object.keys(data).length!=0){
					data = JSON.stringify(data);
					fs.writeFile(`./user_progress/${username}.json`, data, (err) => {
						if (err){
							return res.status(500).json({msg: 500});
						}
						return res.status(200).json({msg: 202});
					});
				}
							                 
			});
		} else if(err.code === 'ENOENT'){
			return res.status(400).json({msg: 3});
		} else {
			return res.status(500).json({msg: 500});
		}
	});
}
module.exports = deleteActivity;