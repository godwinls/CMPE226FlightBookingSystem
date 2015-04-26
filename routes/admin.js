var ejs = require('ejs');
var db = require('../routes/dbConnection.js');


exports.signIn_admin = function(req, res) {
	res.render('signIn_admin', {
		title : 'flightbooking'
	});
}

exports.afterSignIn_admin = function(req, res) {
	var adminEmail = "admin@gmail.com";
	var adminPass = "admin";
	var email = req.param("email");
	var pass = req.param("password");
	var session = req.session;
	
	console.log(JSON.stringify(session));
	req.session.admin = {
			email : req.param("email"),
			password : req.param("password")
	};
	console.log(JSON.stringify(session));
	
	if(email == adminEmail && pass == adminPass) {
		res.render('homepage_admin', {
			title : 'flightbooking'
		});
	}else {
		console.log("wrong admin sign in info....");
		res.render('signIn_admin', {
			title : 'flightbooking'
		});
	}
}

exports.signOut_admin = function(req, res) {
	req.session.admin = null;
	res.render('index', {
		title : 'flightbooking'
	});
}

function getAllUsers(callback) {
	var allUsers = "select * from User";
	console.log("query is: " + allUsers);
	db.getConnection(function(err, connection) {
		var query = connection.query(allUsers, function(err, result) {
			if(err) {
				console.log("err message: " + err.message);
			}else {
				callback(err, result);
				console.log("\nConnection closed...");
				connection.release();
			}
		});
		//console.log("query is: " + query);
	});	
}

exports.listAllUsers = function(req, res) {
	getAllUsers(function(err, result) {
		res.render('userManagement', {
			title : 'flightbooking',
			show : result
		});
	});
}


function getAllFlights(callback) {
	var allFlights = "select * from Flight";
	console.log("query is: " + allFlights);
	db.getConnection(function(err, connection) {
		var query = connection.query(allFlights, function(err, result) {
			if(err) {
				console.log("err message: " + err.message);
			}else {
				callback(err, result);
				console.log("\nConnection closed...");
				connection.release();
			}
		});
	});	
}

exports.listAllFlights = function(req, res) {
	getAllFlights(function(err, result) {
		res.render('flightManagement', {
			title : 'flightbooking',
			show : result
		});
	});
}

exports.toAdminHomepage = function(req, res) {
	res.render('homepage_admin', {
		title : 'flightbooking'
	});
}

exports.userDetail = function(req, res) {
	var id = req.params.id;
	console.log("id = " + id);
	var sql = "select * from User u, History h, Flight f" +
			  " where u.User_id = " + id + " and h.History_user_id = " 
			  + id + " and h.History_flight_id = f.Flight_id";
	console.log("sql is: " + sql);
	var session = req.session;
	
	db.getConnection(function(err, connection) {
		var query = connection.query(sql, function(err, results) {
			if(err){
				console.log("err message: " + err.message);
			}else{
				console.log("info:"+results);
				console.log("\nConnection closed...");
				connection.release();
//				req.session.user =  {
//					ID : id,
//					fname : results.User_fname,
//					lname : results.User_lname,
//					email : results.User_email,
//				};
//				console.log("session:: "+JSON.stringify(session));

				res.render('userDetail_admin', {
					title : 'flightbooking',
					show : results
				});
			}
		});
	});
}

exports.orderDetail = function(req, res) {
	var oid = req.params.oid;
	console.log("oid = " + oid);
	var sql = "select * from User u, History h, Flight f" +
			  " where h.History_id = " + oid + " and h.History_user_id = u.User_id and h.History_flight_id = f.Flight_id";
	console.log("sql is: " + sql);
	var session = req.session;
	
	db.getConnection(function(err, connection) {
		var query = connection.query(sql, function(err, results) {
			if(err){
				console.log("err message: " + err.message);
			}else{
				console.log("info:"+results);
				console.log("\nConnection closed...");
				connection.release();
				res.render('orderDetail_admin', {
					title : 'flightbooking',
					show : results
				});
			}
		});
	});
}

exports.toAddFlight = function(req, res) {
	res.render('addFlight_admin', {
		title : 'flightbooking'
	});
}

exports.addFlight = function(req, res) {
	var num = req.param("flightNum");
	var scity = req.param("scity");
	var ecity = req.param("ecity");
	var stime = req.param("stime");
	var etime = req.param("etime");
	var seats = req.param("seats");
	var model = req.param("model");
	var price = req.param("price");
	if(num.length > 0 && scity.length > 0 && ecity.length > 0 && stime.length > 0 && etime.length > 0 && seats.length > 0 && model.length > 0 && price.length > 0) {
		var sql = "insert into Flight (Flight_num, Flight_scity, Flight_ecity, Flight_stime, " +
				  "Flight_etime, Flight_seats, Flight_model, Flight_price) values ('"
				  + num + "', '" + scity + "', '" + ecity + "', '" + stime + "', '" + etime + "', "
				  + seats + ", '" + model + "', '" + price + "')";
		console.log("sql is :: " + sql);
		
		db.getConnection(function(err, connection) {
			var query = connection.query(sql, function(err, result) {
				if(err){
					console.log("err message: " + err.message);
				}else{
					//console.log("info:"+result);
					console.log("\nConnection closed...");
					connection.release();
					res.render('homepage_admin', {
						title : 'flightbooking'
					});
				}
			})
		})
	}else {
		res.render('addFlight_admin', {
			error : "You have blank space!"
		})
	}
}

exports.editFlight_admin = function(req, res) {
	var fid = req.params.fid;
	console.log("fid = " + fid);
	res.render('editFlight_admin', {
		title : 'flightbooking'
	});
}