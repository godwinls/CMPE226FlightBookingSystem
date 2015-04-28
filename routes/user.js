var db = require('../routes/dbConnection.js');

/*
 * GET users listing.
 */
exports.signin = function(req, res){
  res.render('signin.ejs', {message: req.flash('loginMessage')});
  };
 
exports.logout = function(req,res){
	req.logout();
	res.redirect('/');
}


exports.home = function(req,res){
	res.redirect('/search')
}
		
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
	var Fprice= 0;
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
						if(seatType=="First") Fprice=flightresult[0].Flight_Fprice;
						else if(seatType=="Business") Fprice=flightresult[0].Flight_Bprice;
						else Fprice=flightresult[0].Flight_Eprice;
				connection.release();
						res.render('order.ejs',{user:userresult, flight:flightresult, seat:seatType, price:Fprice})
					}
				})
			}
		})
	})
};

exports.userDetail = function(req,res){
	var id = req.params.id;
	console.log("id = " + id);
	var sqlUser = "select * from User u where u.User_id = " + id;
	var sqlOrder = "select * from History h, Flight f" +
				   " where h.History_user_id = " + id + " and h.History_flight_id = f.Flight_id";

	
	db.getConnection(function(err, connection) {
		var query1 = connection.query(sqlUser, function(err, resultsU) {
			if(err){
				console.log("err message: " + err.message);
			}else{
				var query2 = connection.query(sqlOrder, function(err, resultsO) {
					console.log("info:"+resultsO);
					console.log("\nConnection closed...");
					connection.release();
					req.session.user =  {
						ID : id
					};
					console.log("session:: "+JSON.stringify(session));

					res.render('userDetail_user', {
						title : 'flightbooking',
						showU : resultsU,
						showO : resultsO
					});
				});
			}
		});
	});
};

exports.confirm = function(req, res){
	var Uid = req.params.Uid;
	var Fid = req.params.Fid;
	var type = req.params.type;
	var price = req.params.price;
	var now = new Date().toISOString().slice(0,19).replace('T',' ');
	var sql = "Insert into History SET History_time = '"+now+"' ,History_user_id = '"+Uid+"', History_flight_id = '"+Fid+"' , History_price = '"+price+
	          "', History_seat= '"+type+"' ";
	db.getConnection(function(err,connection){
		var query = connection.query(sql,function(err,results){
			if(err){
				console.log("err message: "+ err.message);
			}else{
				res.redirect('/history')
			}
		})
	})
};

exports.history = function(req, res){
	var id = req.user.User_id;
	var sql = "SELECT * FROM History, Flight WHERE Flight.Flight_id = History.History_flight_id AND History.History_user_id = '"+id+"'";
	db.getConnection(function(err,connection){
		var query = connection.query(sql,function(err,results){
			if(err){
				console.log("err message: "+ err.message);
			}else{
				res.render('history.ejs',{show: results})
			}
		})
	})
};

exports.cancel = function(req,res){
	var id =req.params.Hid;
	var sql1 = "SELECT * FROM History, Flight WHERE Flight.Flight_id = History.History_flight_id AND History.History_id = '"+id+"'";
	var sql2 = "DELETE FROM History WHERE History.History_id = '"+id+"'";
	db.getConnection(function(err, connection) {
		var query1 = connection.query(sql1, function(err, results) {
			if(err){
				console.log("err message: " + err.message);
			}else{
				var now = new Date()
				var t = results[0].Flight_stime;
				var time = new Date(t.toString());
				if(time>now){
					db.getConnection(function(err,connection){
						var query = connection.query(sql2,function(err,results){
							if(err){
								console.log("err message: "+ err.message);
							}else{
								res.redirect('/history');
							}
						})
					})
				}
				else{
					res.redirect('/history');
				}
			}
		});
	});
};


exports.profile = function(req,res){
	var id = req.user.User_id;
	var sql = " SELECT * FROM User WHERE User_id = '"+id+"'";
	db.getConnection(function(err,connection){
		var query = connection.query(sql,function(err,results){
			if(err){
				console.log("err message: "+ err.message);
			}else{
				res.render('userDetail_user.ejs',{showU: results})
			}
		})
	})
};

exports.edit = function(req,res){
	var id = req.user.User_id;
	var sql = " SELECT * FROM User WHERE User_id = '"+id+"'";
	db.getConnection(function(err,connection){
		var query = connection.query(sql,function(err,results){
			if(err){
				console.log("err message: "+ err.message);
			}else{
				res.render('userEdit.ejs',{show: results});
			}
		})
	})
};

exports.editUser = function(req,res){
	var id = req.user.User_id;
	var email = req.param("userEmail");
	var pwd = req.param("userPassword");
	var address = req.param("userAddress");
	var zip = req.param("userZip");
	var pay = req.param("userPay");
	var identi = req.param("userID");
	var identiType = req.param("userIDType");
	
	var sql = " Update User SET User_email = '"+email+"', User_password = '"+pwd+
	          "',  User_address = '"+address+"',  User_zip = '"+zip+
	          "',  User_pay = '"+pay+"',  User_identi = '"+identi+"',  User_identi_type = '"
	          +identiType+"' WHERE User_id = '"+id+"'";
	db.getConnection(function(err,connection){
		var query = connection.query(sql,function(err,results){
			if(err){
				console.log("err message: "+ err.message);
			}else{
				res.redirect('/profile');
			}
		})
	})
}
