const express = require('express');
const router = express.Router();
//const mariadb = require('mariadb');
//const pool = require('./mariaPool');
//const session = require('express-session'); 
const { check, validationResult, matchedData } = require("express-validator");
const fetch = require('node-fetch');

//tutaj znaczna większość zapytań

function zwrotKomunikatu(code,err){
    let komunikat;
    err = (typeof err == 'undefined')? 'null' : err;
    switch (code) {
        case 200: komunikat = 'Wykonano poprawnie'; break;
        case 400: komunikat = 'Złe dane'; break;
        case 403: komunikat = "Brak uprawnień"; break;
        case 500: komunikat = err; break;
        default: komunikat = "upsi";
    }
    return komunikat;
}


// w POST obsługiwane jest tworzenie nowego użytkownika
router.post('/uczen', [
    check("name")
        .isLength({ min: 3 })
        .withMessage("Imię minimum 3 znaki")
        .trim(),
    check("last_name")
        .isLength({ min: 3 })
        .withMessage("Nazwisko minimum 3 znaki")
        .trim(),
    check("class_code")
        .trim(),
    check("email")
        .isEmail()
        .withMessage("Nieprawidłowy adres email")
        .bail()
        .trim()
        .normalizeEmail(),
    check("password")
        .isLength({ min: 7 })
        .withMessage("Hasło minimum 7 znaków")
        .trim()
 ], require('./db/generateSalt2'), require('./db/nowyUczen'));


//wygenerowanie kodu klasy
router.get('/code', require('./db/generateClassCode'));

//wygenerowanie salta
router.get('/salt', require('./db/generateSalt'))

//resetowanie hasła - wysłanie maila
router.post('/reset', require('./db/generateRandomString'), require('./db/forgotPassword'), require('./db/sendEmail'), (req, res, next) => {
    //req.flash('komunikat', zwrotKomunikatu(req.resCode, req.errMsg));
    if (req.resCode == 500) req.flash('komunikat', req.errMsg);
    else if (req.resCode == 200) req.flash('komunikat', "Wysłano maila");
    else req.flash('komunikat', "Brak konta o podanym mailu");
    res.redirect('/login/login');
    //res.redirect('/reset');
    //res.send(req.resCode);
});

//resetowanie hasła - zmiana hasła
router.get('/forgot/:url', async (req, res, next) => {
    const pool = require('./mariaPool');
    let conn
    try {
        conn = await pool.getConnection();
        let result = await conn.query({rowsAsArray:true, sql: `SELECT typ, id_typ, waznosc FROM ZapomnianeHaslo WHERE url = '${req.params.url}'`});
        if (result.length === 1){
            let table = (result[0][0] == "uczen")? "Uczniowie": "Nauczyciele";
            let id = (table == "Uczniowie")? "id_ucznia": "id_nauczyciela";
            let check = await conn.query({rowsAsArray:true, sql: `SELECT login FROM ${table} WHERE ${id} = ${result[0][1]}`});
            if (check.length === 1){
                res.render('pages/resetPassword', {login: check[0][0]});
            }
            else{
                res.sendStatus(404);
            }
        }
        else{
            res.sendStatus(404);
        }
    } catch (error) {
        res.sendStatus(500);
    }
    finally{
        if (conn) return conn.end();
    }
});
router.post('/forgot/:url', require('./db/resetPassword'));


//router.get('/testclass/:class_id', require('./db/getClassActivities'));

//sprawdza, czy użytkownik jest zalogowany
router.use(function checkUserState(req,res,next){
    if(req.session.user.loggedin){
        next();
    }else{
        res.sendStatus(418);
        res.end();
    }
});

// w htmlu nie ma formularzy obługujących put i delete, jest tylko get i post
//dlatego zmieniłem tu wszędzie na posty

// zmiana hasła
router.post('/update', require('./db/updatePassword'), (req, res, next) => {
    req.flash('komunikat', zwrotKomunikatu(req.resCode, req.errMsg));
    //req.flash('desiredElem', 'editProfileUcz');
    if (req.session.user.typ == "uczen") req.flash('desiredElem', 'editProfileUcz');
    else req.flash('desiredElem', 'editProfileNau');
    res.redirect(`/user/${req.session.user.username}`);
});

// usunięcie konta
router.post('/delete', require('./db/deleteUser'));

//dodanie aktywności
router.post('/aktywnosc', require('./db/addActivity'), (req, res, next) => {
    req.flash('komunikat', zwrotKomunikatu(req.resCode, req.errMsg));
    req.flash('desiredElem', 'addActivity');
    res.redirect(`/user/${req.session.user.username}`);
});

//usunięcie aktywności
router.post('/usunaktywnosc', require('./db/deleteActivity'), (req, res, next) => {
    req.flash('komunikat', zwrotKomunikatu(req.resCode, req.errMsg));
    req.flash('desiredElem', 'activity');
    res.redirect(`/user/${req.session.user.username}`);
});

//dostanie aktywności użytkownika
router.get('/aktywnosci', require('./db/getActivities'), (req,res,next)=>{
    if(req.query.method == "data"){
        res.send(req.data);
    }else if(req.query.method == "panel"){
        res.render('panelElems/mySummary', {activity: req.data});
    }else{
        res.sendStatus(404);
    }
});
//dostanie aktywności klasy
router.get('/aktywnosciklasy/:class_id', require('./db/getClassActivities'), (req,res,next)=>{
    if(req.data){
        res.send(req.data);
    }else{
        res.sendStatus(404);
    }
});

//dodanie klasy
router.post('/klasa', require('./db/generateClassCode2'), require('./db/nowaKlasa'), (req,res) => {
    req.flash('komunikat', zwrotKomunikatu(req.resCode, req.errMsg));
    req.flash('desiredElem', 'manage');
    res.redirect(`/user/${req.session.user.username}`);
})

//usuniecie ucznia z klasy
router.post('/usunuczniazklasy', require('./db/delStudentFromClass'), (req,res)=>{
    req.flash('komunikat', zwrotKomunikatu(req.resCode, req.errMsg));
    req.flash('desiredElem', 'manage');
    res.redirect(`/user/${req.session.user.username}`);
});

//edycja aktywności
router.post('/edit', require('./db/editActivity'), (req, res) => {
    req.flash('komunikat', zwrotKomunikatu(req.resCode, req.errMsg));
    req.flash('desiredElem', 'activity');
    res.redirect(`/user/${req.session.user.username}`);
});

//usunięcie klasy
router.post('/usunklase', require('./db/deleteClass'), (req,res)=>{
    req.flash('komunikat', zwrotKomunikatu(req.resCode, req.errMsg));
    req.flash('desiredElem', 'manage');
    res.redirect(`/user/${req.session.user.username}`);
});

//zmiana nazwy klasy
router.post('/editclass', require('./db/editClassName'), (req,res)=>{
    req.flash('komunikat', zwrotKomunikatu(req.resCode, req.errMsg));
    req.flash('desiredElem', 'manage');
    res.redirect(`/user/${req.session.user.username}`);
});

//pobranie listy uzytkownikow
router.get('/listauczniow', require('./db/getClasses2') ,(req, res, next)=>{
    for (let index in req.klasy) {
        if (req.klasy[index].includes(req.query.classCode)) {
            req.query.classCode = req.klasy[index][2];
            next();
            break;
        }
    }
}, require('./db/getStudents'), (req, res)=>{
    res.send(JSON.stringify(req.listaUczniow));
});

router.get('/getveryclass', require('./db/getClasses2'), (req,res, next)=>{
    for (let index in req.klasy) {
        if (req.klasy[index].includes(req.query.classCode)) {
            req.query.classCode = req.klasy[index][2];
            req.klasa = req.klasy[index];
            next()
            break;
        }
    }
}, require('./db/getStudents'), (req, res, next) => {
        res.render('partials/editClass', { klasa: req.klasa, studentList: req.listaUczniow });
});


//dołączenie do klasy przez ucznia, który nie ma klasy
router.post('/joinclass', require('./db/joinClass'), (req, res, next) => {
    req.flash('komunikat', zwrotKomunikatu(req.resCode, req.errMsg));
    req.flash('desiredElem', 'editProfileUcz');
    res.redirect(`/user/${req.session.user.username}`);
});

//opuszczenie klasy przez ucznia
router.post('/leave', require('./db/leaveClass'), (req, res) => {
    req.flash('komunikat', zwrotKomunikatu(req.resCode, req.errMsg));
    req.flash('desiredElem', 'editProfileUcz');
    res.redirect(`/user/${req.session.user.username}`);
});

module.exports = router;
