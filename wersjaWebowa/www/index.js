const express = require('express');
const session = require('express-session'); //sesje
const http = require('http');
const process = require('process');
const bodyParser = require('body-parser'); //parsowanie zapytań
const routes = require('./routes');
const flash = require('connect-flash'); //flash pozwala na wysyłanie wiadomości podczas przekierowania 
const remote = require('./remoteApi');
const app = express();

const { readFileSync } = require('fs');


const MemoryStore = require('memorystore')(session) //miejsce przechowywania sesji

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.use(session({
    store: new MemoryStore({
        checkPeriod: 1000, //1 min
        ttl: 1000*60*5 //5 min
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    maxAge: 1000*60*5 //5 min
}));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/login', require('./loginRoute'));
app.use(express.json());
app.use('/api', routes);
app.use('/remoteapi', remote);

app.get('/', (req, res)=>{
    let login
    // console.log(typeof req.session.user)
    if (typeof req.session.user != 'undefined'){
        login = (req.session.user.loggedin) ? req.session.user.username : false;
    }else{
        login = false;
    }
    res.render('pages/index', {login});
    //może jeśli użytkownik jest zalogowany, to przenieść go na jego stronę
    //w sensie do /user/zahashowanylogin zamiast na ten index
});

app.use('/user', require('./userRoute.js'));

//wylogowanie niszczy sesję
app.get('*/logout', (req, res)=>{
    req.session.user = null;
    req.session.destroy();
    res.redirect('/login/login');
});

// błędy serwerowe

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// włączenie serwera

http.createServer(app).listen(process.env.PORT || 80, '46.41.137.179');
