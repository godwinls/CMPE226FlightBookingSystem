
/**
 * Module dependencies.
 */

var express = require('express')
  , session = require('express-session')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , passport = require('passport');

var admin = require('./routes/admin')
  , passport = require('passport');

require('./config/passport')(passport);
var app = express();

app.use(session({secret: 'keyboard cat'}));
app.use(function(req, res, next){ 
	res.locals.session = req.session; 
	next(); 
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/signIn_admin', admin.signIn_admin);
app.get('/afterSignIn_admin', admin.afterSignIn_admin);
app.get('/signOut_admin', admin.signOut_admin);
app.get('/toAdminHomepage', admin.toAdminHomepage);
app.get('/listAllUsers', admin.listAllUsers);
app.get('/userDetail/:id', admin.userDetail);
app.get('/orderDetail/:oid', admin.orderDetail);


app.get('/signin',user.signin);
app.post('/signin',passport.authenticate('local-login',{ successRedirect:'/search',
    failureRedirect:'/signin',
    failureFlash:true}) 
    );
app.get('/search', user.search);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
