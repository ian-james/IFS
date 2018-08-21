var path = require('path');
var viewPath = path.join(__dirname + "/");
var fs = require("fs");
var _ = require('lodash');
var Logger = require(__configs + "loggingConfig");
var async = require('async');

var url = require('url');
var defaultTool = require(__components + 'Preferences/setupDefaultToolType.js');
var event = require(__components + "InteractionEvents/buildEvent.js");
var tracker = require(__components + "InteractionEvents/trackEvents.js");

var Constants = require(__components + "Constants/programConstants");
var SurveyManager = require(__components + "Survey/helpers/surveyManager");
var SurveyBuilder = require(__components + "Survey/helpers/surveyBuilder");
var Survey = require(__components + "Survey/models/survey");

var preferencesDB = require(__components + 'Preferences/preferenceDB.js');
var TipManager = require(__components + 'TipManager/tipManager.js');

var {Assignment} = require("../../models/assignment");
var {Course} = require("../../models/course");
var {StudentClass} = require("../../models/studentClass");

module.exports = function (app, iosocket) {

  /**
   * Takes the tool preferences and the tools and updates the curren default and preferred values.
   * @param  {[type]} toolPreferences [description]
   * @param  {[type]} tools           [description]
   * @return {[type]}                 [description]
   */
   function updateJsonWithDbValues(toolPreferences, tools) {
   	var toolPrefix = "enabled-";
   	var optionPrefix = "opt-";
   	for (var i = 0; i < toolPreferences.length; i++) {

   		var optionName = toolPreferences[i].toolName;
   		if (_.startsWith(optionName, toolPrefix)) {
		//Enable the tool checkbox
		optionName = _.replace(optionName, toolPrefix, "");
		var r = _.find(tools, _.matchesProperty('displayName', optionName));
		if (r)
			r['prefValue'] = false;
	} else if (_.startsWith(optionName, optionPrefix)) {
		var r = undefined;
		for (var y = 0; y < tools.length && !r; y++) {
			var options = tools[y].options;
			r = _.find(options, _.matchesProperty("name", optionName));
			if (r) {
				if (r.type == "checkbox")
					r['prefValue'] = "on";
				else if (r.type == "select" || r.type == "text")
					r['prefValue'] = toolPreferences[i].toolValue;
			}
		}
	}
}
}

app.post('/tool/assignment', async function(req, res) {

	var insert = req.body.insert;

	var val = 0;
	var result = [];

	if(insert == "*" || insert == "None")
	{
		res.send({'result': result});
	}
	else
	{
		// find assignments which are associated with the course code the student is enrolled in
		var val = await Assignment.query()
		.whereIn('classId', (builder) => {
			builder.select('id')
			.from('class')
			.where('code', insert);
		})
		.catch(function(err) {
			res.send({
				'value': val
			});
			console.log(err.stack);
			return;
		});

		for(var i = 0; i < val.length; i++)
		{
			result.push(val[i].name);
		}

		res.send({'result': result});
	}

});

app.get('/tool/course', async function(req, res) {

	var val = 0;
	var result = [];
	var id = [];
	var classes = [];
	var userId = req.user.id;

	// query course database to find the courses the student is enrolled in
	var val = await Course.query()
	.whereIn('id', (builder) =>{
		builder.select('classId')
		.from('student_class')
		.where('studentId', userId);
	})
	.catch(function(err) {
		res.send({
			'value': val
		});
		console.log(err.stack);
		return;
	});

	for(var i = 0; i < val.length; i++)
	{
		result.push(val[i].code);
		id.push(val[i].id);
	}

	res.send({
		'result': result,
		'id': id
	});

});

app.get('/tool/data', function (req, res) {
	fs.readFile(req.session.toolFile, 'utf-8', function (err, toolData) {
		if (err) {
		//Unable to get supported tools file, larger problem here.
		Logger.error(err);
		res.end();
	} else {
		//Load JSON tool file and send back to UI to create inputs
		preferencesDB.getStudentPreferencesByToolType(req.user.id, req.session.toolSelect, function (err, toolPreferences) {

			var jsonObj = JSON.parse(toolData);
			var tools = jsonObj['tools'];

			if (toolPreferences)
				updateJsonWithDbValues(toolPreferences, tools);
			res.json(tools);
		});
	}
});
});

  /**
   * This loads all the survey data required for loading time.
   * @param  {[type]} req  [description]
   * @param  {[type]} res  [description]
   * @param  {[type]} next )             {                var userId [description]
   * @return {[type]}      [description]
   */
  app.get('/tool', function (req, res, next) {
    const userId = req.user.id || req.passport.user;

    TipManager.selectTip(req, res, userId, () => {
      SurveyBuilder.getPulseSurvey(req.session.toolSelect.toLowerCase(), userId, (survey) => {
        if (!survey) {
          survey = [];       
        }
        res.render(viewPath + "tool", {
          "title": req.session.toolSelect + ' Tool Screen',
          "surveyQuestions": survey
        });
      });
    });
  });
}
