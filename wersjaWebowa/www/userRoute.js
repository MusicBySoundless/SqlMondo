const express = require('express');
const app = express();
const session = require('express-session');
const pool = require('./mariaPool');

//obsługuje rzeczy po zalogowaniu


const {
    teacherPermission,
    studentPermission
} = require('./permissions')

function verify(req, res, next) {
    if (typeof (req.session.user) == 'undefined') {
        res.status(401).redirect('/login/login');
        res.end();
    } else if (!req.session.user.loggedin) {
        res.status(401).redirect('/login/login');
        res.end();
    } else if (req.params.userID !== req.session.user.username) {
        res.status(404).redirect('/');
        res.end();
    } else {
        next();
        // bedzie przekierowanie na stronę z błędami
    }
}

function permisionVerify(req, res, next) {
    const typ = req.session.user.typ;
    const elem = req.params.elem;

    if (!['nauczyciel', 'uczen'].includes(typ)) { res.sendStatus(401); res.end(); }
    if (typ == "nauczyciel" && !teacherPermission.includes(elem)) {
        res.sendStatus(403);
        res.end();
    } 
    else if (typ == "uczen" && !studentPermission.includes(elem)) {
        res.sendStatus(403);
        res.end();
    } else {
        next();
    }
}

function activityElem(req,res,next){
    if(req.params.elem === "activity"){
        //TODO zmienić na asynchroniczne
        let {readFileSync} = require("fs");
        let userActivity = readFileSync(`./user_progress/${req.session.user.username}.json`);

        userActivity = JSON.parse(userActivity);
        res.render('panelElems/activity', {userActivity});
    }else{
        next()
    }
}


app.get('/:userID', verify, (req, res, next) => {
    let user = req.session.user;
    let error = false;
    //res.render('pages/profile', { user, error, komunikat: req.flash('komunikat') });

    //desiredElem ma oznaczać, jaki element ma się otworzyć
    res.render('pages/profile', { user, error, komunikat: req.flash('komunikat'), desiredElem: req.flash('desiredElem') });
});


app.get('/panelElem/naucz/:elem', permisionVerify, activityElem ,(req, res, next) => {
    let elem = req.params.elem;
    if (!['manage', 'summary-student', 'summary-class'].includes(elem)) {
        res.render(`panelElems/${elem}`);
    } else {
        next();
    }
}, require('./db/getClasses2'), (req, res, next) => {
    res.render(`panelElems/${req.params.elem}`, { klasyArr: req.klasy, id: req.session.user.username });
});


app.get('/panelElem/ucz/:elem', permisionVerify, activityElem, (req, res, next) => {
    if(req.params.elem != "mySummary"){
        if (req.params.elem == 'editProfileUcz'){
             // trzeba zrobic zapytanie sprawdzajace czy uczen jest w klasie
             next();
        }else{  
            res.render(`panelElems/${req.params.elem}`);
        }
    }else{
        res.redirect(`/api/aktywnosci?userID=${req.session.user.username}&method=panel`);
    }
}, require('./db/isStudentInClass'), (req, res)=>{
    let inClass = req.inClass;
    res.render(`panelElems/${req.params.elem}`, {inClass});
});

module.exports = app;