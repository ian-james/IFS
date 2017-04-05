/**
 * This module is simply meant to store commonly used names, for reference
 * and to minimize potential errors.
 */
function getFileExst() {
    return {
        "ZipExts": [ ".zip", ".tar", '.gz'],
        "DocExts": ["doc", "docx", "odt"],
        "SrcExts": ['c', "cpp", "cc"],
    };
}

function getFileTypes() {
    return {
        "AcceptFileTypes": { 'Programming':['json', 'cpp', 'c','h','zip','tar'],
               'Writing': ['txt', 'text', 'doc', 'docx', 'odt' ]
            },
        "AcceptMimeTypes": { 
            'Writing':[
                'text/plain',
                'text/markdown',
                'application/json',
                'application/msword',
                'application/vnd.oasis.opendocument.text',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ],
            "Programming": [
                'text/plain',
                'text/markdown',
                'text/x-csrc',
                'text/x-chdr',
                'application/json', 
                'application/zip',
                'application/x-compressed-zip',
                'application/x-tar'
            ]
        }
    };
}

function getRoutes() {
    return {
        "FeedbackRoute": "feedback",
        "CloudRoute": "cloud",
        "SummaryRoute":  "summary"
    };
}

function getDirectories() {
    return {
        "ZipDir": "unzipped",
        "UploadDir": "./uploads",
    };
}

function getDept() {
    return {
        "CS": "Programming",
        "PSY": "Writing"
    };
}

function getOutFiles () {
    return {
        "fbFiles": 'feedbackFiles',
    }
}


function getKeys() {
    return {
        "errKey": "err"
    };
}

function surveyDisplayDefaultOptions() {
    return {
        "range":[0,100],
        "questionsPerPage":4,
        "splitQuestionTypes": true
    };
}

module.exports.surveyDisplayDefaultOptions = surveyDisplayDefaultOptions;