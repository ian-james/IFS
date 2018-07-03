/**
 * This is CRUD calls for questions
 */
var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");

function getQuestions( surveyId, callback ) {
    var req = "SELECT * FROM " + dbcfg.question_table + " WHERE surveyId = ? ORDER BY id ASC";
    db.query(req, surveyId, function(err,data){
        callback(err,data);
    });
}

function insertQuestion( questionData, callback ) {
    var req = "INSERT INTO " + dbcfg.question_table + " (surveyId, language, origOrder, text, visualFile, type) values (?,?,?,?,?,?)";
    db.query(req, questionData, function(err,data){
        callback(err,data);
    });
}

function updateQuestion( questionData, callback ) {
    var req = "UPDATE " + dbcfg.question_table + " (questionData) values (?, ?, ?)";
    db.query(req,[questionData], function(err,data){
        callback(err,data);
    });
}

function deleteQuestion( questionData, callback ) {
    var req = " DELETE FROM " + dbcfg.question_table + " WHERE questionName = ?";
    db.query(req,questionData, function(err,data){
        callback(err,data);
    });
}

/*let getQuestionCount = (id, callback) => {
    var q = 'SELECT COUNT(id) as numQ from ' + dbcfg.question_table + ' WHERE surveyId = ?';
    db.query(q, id, (err, data) => {
        callback (err, data);
    })
};*/

const selectNRandomQuestions =  (surveyId, n, callback) => {
    const q = 'SELECT * from ' + dbcfg.question_table + ' WHERE surveyId = ? ORDER BY RAND() LIMIT ?';
    db.query (q, [surveyId, n], (err, data) => {
        callback (err, data);
    });
};


module.exports.getQuestions = getQuestions;
module.exports.insertQuestion = insertQuestion;
module.exports.deleteQuestion = deleteQuestion;
module.exports.selectRandomQuestions = selectNRandomQuestions;