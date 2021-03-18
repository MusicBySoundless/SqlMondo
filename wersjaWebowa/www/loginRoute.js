const express = require('express');
const session = require('express-session'); 
const bodyParser = require('body-parser');
const crypto = require('crypto');
const log = require('./db/logger');
const flash = require('connect-flash'); 

//logowanie
var router = express.Router();
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.route('/:type')
    .get((req,res,next)=>{
        //dlaczego ten zakomentowany kod nie działa?
        /*if (req.session.loggedin === true){
            //jeśli ktoś jest zalogowany to logowanie od razu powinno go przekierować na jego stronę
            res.redirect(`/user/${req.session.username}`)
        }*/
        //dodałem nowy package connect-flash - pozwala na przekazywanie wiadomości przy redirect'cie
        //let error = req.query.auth_error == 'true' ? true : false;
        let error = Object.keys(req.flash('test')).length != 0 ? true : false
        let obj = req.flash('errors');
        if(Object.keys(obj).length != 0) obj = obj[0]
        let obj2 = req.flash('values');
        if(Object.keys(obj2).length != 0) obj2 = obj2[0];
        
        //console.log(req.flash('test'));
        res.render('pages/login', {type: req.params.type, error, errors: obj, values: obj2, komunikat: req.flash('komunikat')});
    });

app.post('*/auth', (req,res,next)=>{
    log(req, res, next)  
});

module.exports = app;