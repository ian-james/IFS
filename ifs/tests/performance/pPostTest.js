var siege = require('siege');

// print process.argv
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
 });

 var port = 3000;
 var nTimes = 100;
 var route = "/login";

siege()
	.on(port)
	.for(nTimes).times
	.post( route, {username:"j@uoguelph.ca", password:"nonononononono" }) 
	.attack();

