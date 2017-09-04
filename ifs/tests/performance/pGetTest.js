var siege = require('siege');

// print process.argv
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
 });

siege()
	.on(3000)
	.for(100).times
	.get( '/' )
	.attack();

