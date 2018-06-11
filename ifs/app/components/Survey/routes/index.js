module.exports = (app, iosocket) => {
 // Admin related routes
 require('./surveyBuildRoutes.js')(app);
 // General survey routes
 require('./surveyRoutes.js')(app, iosocket);
};
