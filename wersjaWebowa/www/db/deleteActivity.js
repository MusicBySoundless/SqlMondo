const fs = require('fs');

function deleteActivity(req, res, next) {
	//usuwa aktywność z pliku .json
	let username = req.session.user.username;
	if (!req.body.Data || !req.body.StartTime){
		req.resCode = 400;
		return next();
	}
	fs.stat(`./user_progress/${username}.json`, function(err, stat) {
		if(err == null) {
			fs.readFile(`./user_progress/${username}.json`, (err, rawdata) => {
				let data = JSON.parse(rawdata);

				if (Object.keys(data[req.body.Data]).length===0){
					req.resCode = 400;
					return next();
				}

				//usuwane jest po godzinie dodania, która zakładam, że jest unikatowa
				let indeks = data[req.body.Data].findIndex( ({ StartTime }) => StartTime == req.body.StartTime);
				if (indeks === -1){
					req.resCode = 400;
					return next();
				}

				//if (Object.keys(data[req.body.date]).length!=0) data[req.body.date].splice(indeks, 1);
				data[req.body.Data].splice(indeks, 1);

				if (data[req.body.Data] == ""){
					delete data[req.body.Data]
				}

				data = JSON.stringify(data);
				fs.writeFile(`./user_progress/${username}.json`, data, (err) => {
					if (err){
						//return res.status(500).send(err.message);
						req.errMsg = err.message;
						req.resCode = 500;
						return next();
					}
					//return res.send(req.body);
					req.resCode = 200;
					return next();
				});
							                 
			});
		} else if(err.code === 'ENOENT'){
			//return res.status(400).send('No such activity');
			req.resCode = 400;
			return next();
		} else {
			//return res.status(500).send(err.code.toString(), err.message);
			req.resCode = 500;
			return next();
		}
	});
}
module.exports = deleteActivity;
