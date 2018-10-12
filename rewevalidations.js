var async = require('async');
var loggs =require('./rewelogging');
var help = require('./rewehelpers');

module.exports = {

    browser: null,

    addDriver:function(driver){
        module.exports.browser = driver;
    },

    validateelementpresent: function (type, element, label) {
        module.exports.browser.manage().timeouts().implicitlyWait(120000);
       help.elementpresent(type, element).then(function (present) {
            if (present) {
                loggs.logtoconsole("Validation == PASS :: " + label + " is Present");
                return true;
            }
            else {
                loggs.assertTrue(label,'present',present)
            }
        }, function (err) {
           loggs.errorroutine(err);
       });
    },

    validateelementdisplayed: function (type, element, label) {
        module.exports.browser.manage().timeouts().implicitlyWait(12000);
        module.exports.validateelementpresent(type, element, label);
        help.findelement(type, element).isDisplayed().then(function (Link) {
            loggs.logtoconsole('Link = ' + Link);
            if (Link) {
                loggs.logtoconsole("Validation == PASS :: " + label + " is displayed");
                return true;
            } else {
                loggs.assertTrue(label,'displayed',Link)
            }
        }, function (err) {
            loggs.errorroutine(err);
        });

    },

    validateelementcontainstext: function (type, element, text, label) {
        async.series([function (callbackpro) {
            module.exports.validateelementdisplayed(type, element, label);
            module.exports.browser.manage().timeouts().implicitlyWait(120000);
            help.findelement(type, element).getText().then(function (Text) {
               loggs.logtoconsole('Current text is :' + Text);
                loggs.logtoconsole('Expected text is :' + text);
                var link = Text.indexOf(text) > -1;
                if (link) {
                    loggs.logtoconsole("Validation == PASS :: " + text + " is found in " + Text);
                    return true;
                } else {
                    loggs.assertContains(Text,text,label)
                }
            });
            callbackpro(null);
        }], function (err, result) {
            if(err) {
               loggs.errorroutine(err);
            }
        });

    }

}
