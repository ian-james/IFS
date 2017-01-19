var path = require('path');
var viewPath = path.join( __dirname + "/");


module.exports = function (app) {

    app.get('/question', function(req,res) {
        console.log("Inside question")
        res.render(viewPath + "questionsLayout", { title: 'Question Screen'});
    })

    app.get('/survey', function(req,res) {
    });
   
}