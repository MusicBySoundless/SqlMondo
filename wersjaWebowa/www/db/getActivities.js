const fs = require('fs');

function getActivities(req, res, next) {
    //pobiera aktywności ucznia z pliku .json
    let username = (typeof req.query.userID == "undefined") ? req.session.user.username : req.query.userID;
    fs.stat(`./user_progress/${username}.json`, function(err, stat) {
        if(err == null) {
            fs.readFile(`./user_progress/${username}.json`, (err, rawdata) => {
                let data = JSON.parse(rawdata);
                req.data = data;
                next();
            });
        } else if(err.code === 'ENOENT') {
                return res.status(400).send("No such file");
        } else {
            return res.status(500).send(err.code, err.message);
        }
    });
}
module.exports = getActivities;