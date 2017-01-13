var router = require('express').Router();
var path = require('path');
var viewPath = path.join( __dirname + "/");


router.get('/', function( req, res , next ) {
    res.render( viewPath + "tool", { title: 'Tool Screen', message:"Something about tools"});
});

module.exports = router;