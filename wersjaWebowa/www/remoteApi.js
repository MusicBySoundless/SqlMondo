const express = require('express');
const router = express.Router();

//zapytania z aplikacji mobilnej

router.get('/verification', (req,res)=>{
    res.send('granted');
});

router.post('/login', require('./db/remote/logger'));
router.post('/check', require('./db/remote/checkToken'));
router.get('/edit/:token', require('./db/remote/editProfile'));

router.post('/user', require('./db/generateSalt2'), require('./db/remote/addUser'));

router.post('/activity', require('./db/remote/addActivity'));
router.delete('/activity', require('./db/remote/deleteActivity'));
router.put('/activity', require('./db/remote/editActivity'));
router.get('/activity', require('./db/remote/getActivities'));


module.exports = router;