var router = require('express').Router();
var path = require('path');
var viewPath = path.join( __dirname + "/");


router.get('/', function( req, res , next ) {
	console.log("\n\n" + path );
	res.render( viewPath + "login", { title: 'Default Login Screen', message:'ok'})
});

module.exports = router;