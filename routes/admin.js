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
	var sqlUser = "select * from User u where u.User_id = " + id;
	var sqlOrder = "select * from History h, Flight f" +
				   " where h.History_user_id = " + id + " and h.History_flight_id = f.Flight_id";

	console.log("sqlUser is: " + sqlUser);
	console.log("sqlOrder is: " + sqlOrder);
	var session = req.session;
	
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

					res.render('userDetail_admin', {
						title : 'flightbooking',
						showU : resultsU,
						showO : resultsO
					});
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
				
				req.session.order =  {
						orderID : oid
					};
				console.log("session:: "+JSON.stringify(session));
					
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
	var model = req.param("model");
	var company = req.param("company");
	var eseats = req.param("eseats");
	var bseats = req.param("bseats");
	var fseats = req.param("fseats");
	var eprice = req.param("eprice");
	var bprice = req.param("bprice");
	var fprice = req.param("fprice");

	if(num.length > 0 && scity.length > 0 && ecity.length > 0 && stime.length > 0 && etime.length > 0 
			&& eseats.length > 0 && bseats.length > 0 && fseats.length > 0 && model.length > 0 
			&& company.length > 0 && eprice.length > 0 && bprice.length > 0 && fprice.length > 0) {
		var sql = "insert into Flight (Flight_num, Flight_scity, Flight_ecity, Flight_stime, " +
				  "Flight_etime, Flight_Eseats, Flight_Bseats, Flight_Fseats, Flight_model, Flight_company, " +
				  "Flight_Eprice, Flight_Bprice, Flight_Fprice) values ('"
				  + num + "', '" + scity + "', '" + ecity + "', '" + stime + "', '" + etime + "', "
				  + eseats + ", " + bseats + ", " + fseats + ", '" + model + "', '" + company + "', " 
				  + eprice + ", "+ bprice + ", " + fprice +")";
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


//1,f,10
//2,y,11
//
//var res = {data: []}
//for( var row : rows){
//	var item = {};
//	item.last_name = row.last_name;
//	item.age = row.age;
//	res.data.push(item);
//}

exports.toEditFlight_admin = function(req, res) {
	var fid = req.params.fid;
	console.log("fid = " + fid);
	var sql = "select * from Flight where Flight_id=" + fid;
	console.log("sql is ::" + sql);
	
	db.getConnection(function(err, connection) {
		var query = connection.query(sql, function(err, result) {
			if(err){
				console.log("err message: " + err.message);
			}else{
				console.log("\nConnection closed...");
				connection.release();
				console.log(JSON.stringify(result));
				res.render('editFlight_admin', {
					title : 'flightbooking',
					show : result
				});
			}
		});
	});	
}

function convert(date){
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var min = date.getMinutes();
	var s = date.getSeconds();
	
	return y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
}

exports.editFlight = function(req, res) {
	var fid = req.params.fid;
	var num = req.param("flightNum");
	var scity = req.param("scity");
	var ecity = req.param("ecity");
	var stime = req.param("stime");
	stime = convert(new Date(stime));
	//console.log("stime :: " + stime);	
	var etime = req.param("etime");
	etime = convert(new Date(etime));
	//console.log("etime :: " + etime);	
	var model = req.param("model");
	var company = req.param("company");
	var eseats = req.param("eseats");
	var bseats = req.param("bseats");
	var fseats = req.param("fseats");
	var eprice = req.param("eprice");
	var bprice = req.param("bprice");
	var fprice = req.param("fprice");
	
	var sql = "update Flight set Flight_num='" + num + "', Flight_scity='" + scity + "', Flight_ecity='"
			  + ecity + "', Flight_stime='" + stime + "', Flight_etime='" + etime + "', Flight_model='" 
			  + model + "', Flight_company='" + company + "', Flight_Eseats="
			  + eseats + ", Flight_Bseats=" + bseats + ", Flight_Fseats=" + fseats + ", Flight_Eprice=" 
			  + eprice + ", Flight_Bprice=" + bprice + ", Flight_Fprice=" + fprice + " where Flight_id="
			  + fid;
	console.log("sql :: " + sql);
	
	db.getConnection(function(err, connection) {
		var query = connection.query(sql, function(err, result) {
			if(err) {
				console.log("err message: " + err.message);
			}else{
				console.log("\nConnection closed...");
				connection.release();
				getAllFlights(function(err, result) {
					res.render('flightManagement', {
						title : 'flightbooking',
						show : result
					});
				});	
			}
		});
	});
}

exports.deleteUser = function(req, res) {
	var id = req.params.id;
	console.log("user id = " + id);
	
	var sql = "delete from User where User_id = " + id;
	console.log("sql :: " + sql);
	
	db.getConnection(function(err, connection) {
		var query = connection.query(sql, function(err, result) {
			if(err){
				console.log("err message: " + err.message);
			}else{
				console.log("\nConnection closed...");
				connection.release();
				getAllUsers(function(err, results) {
					res.render('userManagement', {
						title : 'flightbooking',
						show : results
					});
				});
			}
		});	
	});
}

exports.cancelOrder = function(req, res) {
	var oid = req.params.oid;
	console.log("order id = " + oid);
	
	var uid = req.query.uid;
	console.log("user id = " + uid);
	
	var sql = "delete from History where History_id = " + oid;
	console.log("sql :: " + sql);
	
	var sqlUser = "select * from User u where u.User_id = " + uid;
	var sqlOrder = "select * from History h, Flight f" +
				   " where h.History_user_id = " + uid + " and h.History_flight_id = f.Flight_id";

	console.log("sqlUser is: " + sqlUser);
	console.log("sqlOrder is: " + sqlOrder);
	
	db.getConnection(function(err, connection) {
		var query = connection.query(sql, function(err, result) {
			if(err){
				console.log("err message: " + err.message);
			}else{
				var query1 = connection.query(sqlUser, function(err, resultsU) {
					if(err){
						console.log("err message: " + err.message);
					}else{
						var query2 = connection.query(sqlOrder, function(err, resultsO) {
							console.log("info:"+resultsO);
							console.log("\nConnection closed...");
							connection.release();
							
							res.render('userDetail_admin', {
								title : 'flightbooking',
								showU : resultsU,
								showO : resultsO
							});
						});
					}
				});
			}
		});	
	});
}