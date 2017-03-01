var _ = require('lodash');
var XRegExp = require('xregexp');

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function setupRegExp( targetOptions )
{
    var def = { 
        'target':       targetOptions.needle || "",
        'targetPos':    targetOptions.targetPos ||   0 ,
        'flags':        targetOptions.flags || "m",
        'regex':        targetOptions.regex || null,
        'newText':      targetOptions.newText || ""
    };
    def.regex = new RegExp(escapeRegExp(def.target), def.flags );
    return def;
}

function handleRegExp( str, targetOpt, func ) {
    
    var regExp = setupRegExp( targetOpt );

    if(_.isNil(regExp) || _.isNil(regExp.target) || regExp.target == "" )
        return null;

    var res =   func(regExp);
    return res;
}


function findClosestMatch( str, targetOpt)
{
    // Must add g for exec otherwise infinite loops occuring
    // because the index doesn't get moved and it always find the same match.
    // Tried to manually move the index...didn't work 

    return handleRegExp(str, targetOpt, function(regExp) {

        var res, last = null;
        var closest = null;

        while( (res= regExp.regex.exec(str)) !== null) {

            //console.log("F and S ", res.index );
            if(closest == null )
            {
                closest = res;
            }
            else
            {
                var f = res.index - closest.index;
                var s = res.index - regExp.targetPos;

                if( s < f )
                    closest = res; 
            }
        }
        return closest;
    });
}


function replaceText(str, targetOpt )
{
    return  handleRegExp(str, targetOpt, function(regExp) {
        
        var res = XRegExp.replace( str, regExp.regex, function(match,index) {
            if( index == targetOpt.targetPos ) {
                return regExp.newText;
            }
            return match;
        });
        return res;
    });
}

module.exports.findClosestMatch = findClosestMatch;
module.exports.replaceText = replaceText;

