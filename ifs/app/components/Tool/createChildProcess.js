const spawn = require('child_process').spawn;

module.exports = { 

    testObj: {
        progName: 'hunspell',
        targs: ['-d','en_US', '-a', 'testFile.txt']
        //progName: 'ls',
        //targs:[]
    },

    hunspellTool: function( progName, targs ) {
        const spawnObj = spawn(progName, targs);

        spawnObj.stdout.on('data', (data) =>{
            console.log( data.toString() );
        });

        spawnObj.stderr.on('data', (data) =>{
            console.log(data.toString() );
        });

        spawnObj.on('close', (code) =>{
            console.log('Child processed existed with code ', code.toString() );
        });

        spawnObj.on('error', data  => {
            console.log("An Error occured: ", data.toString() );
        });
        return spawnObj;
    }
};


