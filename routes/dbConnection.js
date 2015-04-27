var mysql = require('mysql');

//node Mysql pool
module.exports = mysql.createPool({
	host:'localhost',
	user:'root',
	database:'226',
	password: '5245193'
});
