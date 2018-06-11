module.exports = (app, iosocket) => {
 // Admin related routes - keeping this for legacy purposes atm, might remove later
 require('./surveyBuildRoutes.js')(app);
 // General survey routes
 require('./surveyRoutes.js')(app, iosocket);
 
};
