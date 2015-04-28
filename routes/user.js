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
				res.render('searchresult.ejs',{show:results, userId: req.user.User_id})
			}
		})
	})
};

exports.order = function(req,res){
	var userId =req.param("userId");
	var flightId =req.param("flightId");
	var seatType = req.param("seatType");
	var sql1 = "SELECT * FROM Flight WHERE Flight_id = "+flightId;
	
	var sql2 = "SELECT * FROM User WHERE User_id = '"+userId+"'";
	
	
	db.getConnection(function(err,connection){
		var query1 = connection.query(sql1,function(err,flightresult){
			if(err){
				console.log("err message: "+ err.message);
			}else{
				var query2 = connection.query(sql2,function(err,userresult){
					if(err){
						console.log("err message: "+ err.message);
					}else{
						connection.release();
						if(seatType=="First") Fprice=flightresult.Fprice;
						else if(seatType=="Business") Fprice=flightresult.Bprice;
						else Fprice=flightresult.Fprice;
						res.render('order.ejs',{user:userresult, flight:flightresult, seat:seatType, price:Fprice})
					}
				})
			}
		})
	})
};
	