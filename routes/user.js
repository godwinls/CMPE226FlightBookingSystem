
/*
 * GET users listing.
 */
exports.signin = function(req, res){
  res.render('signin.ejs', { message: req.session.messages});
  };
 
		
exports.search = function(req, res){
  res.render("index.ejs");
};
exports.aftersearch = function(req, res){
	  res.render("signin.ejs");
	};
	

exports.list = function(req, res){
  res.send("respond with a resource");
};

