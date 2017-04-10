const spawn = require('child_process').spawn;

const ls = spawn('hunspell',['-d', 'en_US','-a', 'testFile.txt']);

ls.stdout.on('data', (data) =>{
    console.log( data.toString() );
});

ls.stderr.on('data', (data) =>{
    console.log(data.toString() );
});

ls.on('close', (code) =>{
    console.log('Child processed existed with code ', code.toString() );
});

ls.on('error', data  => {
    console.log("An Error occured: ", data.toString() );
});