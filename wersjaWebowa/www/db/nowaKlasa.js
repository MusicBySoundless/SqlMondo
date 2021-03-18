const pool = require('../mariaPool');


async function nowaKlasa(req, res, next) {
	//stworzenie nowej klasy przez nauczyciela, zapisanie w bazie
	if (req.resCode == 500) return next()
	else if (req.session.user.typ != "nauczyciel"){
		req.resCode = 403;
		next();
	}
	else{
		let conn;
		try{
			conn = await pool.getConnection();
			const result = await conn.query(`INSERT INTO Klasy values (NULL, '${req.body.class_name}', ${req.session.user.id}, '${req.classCode}')`, [1, "mariadb"]);
			req.resCode = 200;
		}
		catch (error){
			req.resCode = 500;
			req.errMsg = error.message;
		}
		finally{
			next()
			if (conn) return conn.end();
		}
	}
	
}

module.exports = nowaKlasa;
