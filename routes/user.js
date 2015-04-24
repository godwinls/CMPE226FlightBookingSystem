
/*
 * GET users listing.
 */
exports.signin = function(req, res){
  res.render('signin.ejs', {message: req.flash('loginMessage')});
  };
 
		
exports.search = function(req, res){
	res.render("search.ejs",{movies:null});
};
exports.aftersearch = function(req, res){
	  res.render("signin.ejs",{movies:null});
	};
	
