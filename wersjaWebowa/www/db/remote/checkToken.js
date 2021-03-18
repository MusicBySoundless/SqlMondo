const {verify} = require('../../tokens');

function checkToken (req, res){
    //sprawdza, czy token jest aktualny i zwraca datę wygaśnięcia
    let timestamp = verify(req.body.token);
    if (!timestamp) return res.status(401).json({msg: 403})

    let date_ob = new Date(timestamp.exp*1000);
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ("0" + date_ob.getHours()).slice(-2);
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);


    let formatted = year + "-" + month + "-" + date + "-" + hours + "-" + minutes;
 
    return res.status(200).json({date:formatted, msg:200})
}

module.exports = checkToken;