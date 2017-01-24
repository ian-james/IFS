
/* 
    Passing a JSON object that represents a tool with options
    
    ***
    Required members are (please update as this changes)
    progName-> name of the command to run this program.

    Optional:
    options: can be a list of arguments or none

    Return: A blank object if error
            Else: returns an object wtih combination of arguments are program name.
*/

const progName = "progName";
const options = "options";
const runCmd = "runCmd";

function buildPromiseToolObj( obj ) {

    if( jsonObj.get( progName ) ){
        
        var cmd = cmdObj[progName] + ( cmdObj[options] || '');
        cmd[runCmd] = cmd;
        return cmd;
    }
    return {};
}

function buildTool( displayName, programName ) {
    return {
            displayName: displayName,
            progName: programName,
            options: [];
    };
}

function addToolOption( tool, option ){
    tool[options].push( option );
}

function buildToolOptions( obj, toolOptions, function( mapOptions ) )
{
    // The idea here will be have a function that takes the form options and maps them to your tool
}

// Exports below
module.export.buildTool = buildTool;
module.export.addToolOption = addToolOption;