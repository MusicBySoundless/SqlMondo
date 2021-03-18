const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'localhost',
     user:'*USER*', 
     password: '*PASSWORD*',
     database: 'sqlmondo',
     connectionLimit: 10
});
module.exports = pool;
//ustawienia połączenia z mariądb