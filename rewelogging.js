var fs = require('fs');
var path = require('path');
var filename;
var logfile;
var imgfile;
var htmlfile;
var suitelogfile;
var assert = require('selenium-webdriver/testing/assert');
var async = require('async');
var asserts = require('chai').assert;

module.exports = {

    browser: null,

    addDriver:function(driver){
        module.exports.browser = driver;
    },

    assertContains: function (string, Substring, label) {
        async.series([function (next) {
            takescreenshot(next)
        }],
        function (err, response) {
            console.log("response =" + response)
            actualmsg(label + string + " does not contain " +  Substring);
            expectedmsg(label + string + " contains " + Substring);
            assert(string).contains(Substring);

        })

    },
    assertTrue: function (label, condition, boolean) {
        async.series([function (next) {
            takescreenshot(next)
        }],
        function (err, response) {
            logtoconsole(label + " is not " + condition)
            actualmsg(label + " not " + condition);
            expectedmsg(label + " should be " + condition);
            sendreport(imgfile,logfile);
            asserts.isTrue(boolean, label + " is not " + condition)
        })
    },
    logtoconsole: function (msg) {
        module.exports.browser.wait(function () {
            console.log(msg);
            return true;
        }, 50000);
    },
    errorroutine: function (err) {
        async.series([
                function (next) {
                    takescreenshot(next)
                }
            ],
            function (error, response) {
                logtoconsole("Error Occured: " + err);
                console.log("response =" + response);
                logtoFile("Error Occured: " + err);
                sendreport(imgfile,logfile);
                assert(err).isTrue();

            })
    },

    settestname : function (test_name, suite_name) {
    logtoconsole("setting test name");
    logtoconsole('Testname: ' + test_name);
    logtoconsole('Suite name: ' + suite_name);
    filename = test_name;
    repdir ='./Reports';
    proddir='./Reports'+ path.sep+test_name;
    suitedir=proddir+ path.sep +suite_name+ 'logs';
    imgdir = suitedir+path.sep+ 'screenshots';
    async.series([function(cb){
        createdirSync(repdir);
        cb();
        },
        function (cb) {
            createdirSync(proddir);
            cb();
        },
        function (cb) {
            createdirSync(suitedir);
            cb();
        },
        function (cb) {
            createdirSync(imgdir);
            cb();
        }]);
    logfile = suitedir + path.sep + filename + ".txt";
    suitelogfile = suitedir + path.sep + filename + ".txt";
    imgfile = imgdir + path.sep + filename + ".png";
    htmlfile = suitedir + path.sep  + "ReweReport.html";
    deletefileSync(imgfile);
    deletefileSync(logfile);
    deletefileSync(htmlfile);
}
};

var takescreenshot= function (cb) {

    module.exports.browser.takeScreenshot().then(function (data) {
            console.log("in here ready to take ");
            console.log('saving screenshot to ' + imgfile);
            var base64Data = data.replace(/^data:image\/png;base64,/, "");
            cb(null,writeimagetofile(imgfile,base64Data));
            cb(null,sendreport(imgfile,logfile));
        },function(err){
            console.log(err)
        }
    );

}

var writeimagetofile=function(filename,imageData) {
    console.log("FILE NAME IS: ");
    console.log(filename);
    fs.writeFile(filename, imageData, 'base64', function (err) {
        console.log("writing imagetofile");
        if (err) {
            console.log( err );
        }
    })
};

var sendreport = function(imageuri, loguri){
    console.log("IMAGE URI IS: ");
    console.log(imageuri);
    console.log("LOG URI IS: ");
    console.log(loguri);
};

var logtoconsole= function (msg) {
     module.exports.browser.wait(function () {
            console.log(msg);
            return true
        }, 50000);
    };

var logtoFile = function (message) {

        module.exports.logtoconsole("logging to file: " + logfile);
        fs.appendFile(logfile, message + "\n", function (err) {
            if (err) {
                throw err;
            }
        });
    };

var actualmsg = function (message) {
        logtoconsole("logging actual msg to file: " + logfile);
        fs.appendFile(logfile, "Actual Result= " + message + "\n", function (err) {
            if (err) {
                throw err;
            }
        });

    };

var expectedmsg = function (message) {
        logtoconsole("logging expected msg to file: " + logfile);
        fs.appendFile(logfile, "Expected Result= " + message + "\n\r", function (err) {
            if (err) {
                throw err;
            }
        });
    };

var deletefileSync = function (filename) {
        fs.exists(filename, function (exists) {
            if (exists) {
                fs.unlinkSync(filename);
                logtoconsole("file deleted" + filename);
            }
        });
    };

var createdirSync = function (dirname) {
        fs.exists(dirname, function (exist) {
            if (!exist) {

                fs.mkdirSync(dirname);
                logtoconsole(dirname, " Directory created");
            }
            else {
                logtoconsole(dirname, " exists");
            }
        });

    };
