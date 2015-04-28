var db = require('../routes/dbConnection.js');

/*
 * GET users listing.
 */
exports.signin = function(req, res){
  res.render('signin.ejs', {message: req.flash('loginMessage')});
  };
 
		
exports.search = function(req, res){
	res.render("search.ejs");
};
exports.aftersearch = function(req, res){
	var depCity =req.param("DepCity");
	var arriCity =req.param("ArriCity");
	var depTimel = req.param("DepTimel");
	var depTimeh = req.param("DepTimeh");
	var sql = "SELECT * FROM Flight WHERE Flight_scity = '"+depCity+"' AND Flight_ecity = '"+arriCity+"' AND Flight_stime Between '"+
	          depTimel+"' AND '"+depTimeh+"' AND (Flight_Fseats>0 OR Flight_Bseats>0 OR Flight_Eseats>0)";
	
	db.getConnection(function(err,connection){
		var query = connection.query(sql,function(err,results){
			if(err){
				console.log("err message: "+ err.message);
			}else{
				console.log("info:"+results);
				connection.release();		
				res.render('searchresult.ejs',{show:results})
			}
		})
	})
};
	