var webdriver = require('selenium-webdriver');
var async = require('async');
var val =require('./rewevalidations'),
    logs= require('./rewelogging'),
    uttil =require('./rewehelpers');

module.exports = {

    browser: null,

    addDriver:function(driver){
        module.exports.browser = driver;
    },

    addArray:function(array){
        module.exports.attArray = array;
    },

    clickelement: function (type, element, label, cb) {
      val.validateelementpresent(type, element, label);
      uttil.findelement(type, element).click().then(function () {
          logs.logtoconsole(label+' is clicked');
          logs.logtoconsole(label+' was clicked')

        }, function (err) {
           logs.errorroutine(err);
        });

    },

    clickbutton: function (type, element, label) {
        logs.logtoconsole(' Before ' + label + ' is clicked');
        val.validateelementdisplayed(type, element, label);
        uttil.findelement(type, element).click().then(function () {
            logs.logtoconsole(label+' is clicked');
            module.exports.browser.manage().timeouts().implicitlyWait(10000)

        }, function (err) {
            logs.errorroutine(err);
        });
    },

    clickspecificelementbytext: function (texttolocate, label, element) {
        logs.logtoconsole(' Before ' + label + ' is clicked');
        uttil.findelement('xpath', "//"+element+"[contains(text(), \"" + texttolocate + "\")]").click().then(function () {
            logs.logtoconsole(label+' is clicked');
            module.exports.browser.manage().timeouts().implicitlyWait(10000)
        }, function (err) {
            logs.errorroutine(err);
        });
    },

    getText: function (type, element,label,callback) {
        var name;
        val.validateelementpresent(type, element, label)
        uttil.findelement(type, element).getText().then(function(Text){
            logs.logtoconsole(label+'  is = '+Text)
            name =Text
            callback(null,name)
        },function(err){
            logs.errorroutine(err);
        })


    },

    sendkeys: function (type, element, label, text) {
        val.validateelementpresent(type, element, label);
        uttil.findelement(type, element).sendKeys(text).then(function(){
            logs.logtoconsole('PASS: '+'\"'+text+'\"' +' entered into '+label);
        },
            function(err){
            logs.errorroutine(err)
        });

    },

    clearkeys: function (type, element, label) {
        val.validateelementpresent(type, element, label);
        uttil.findelement(type, element).clear().then(function(){
                logs.logtoconsole('PASS: '+label+ ' cleared')

            },
            function(err){
                logs.errorroutine(err)
            });

    },

    clearandsendkeys: function (type, element, label, text) {
        async.series([function (cb) {

           module.exports.clearkeys(type, element, label);
           cb(null,module.exports.sendkeys(type, element, label, text));

        }
        ], function (err, result) {
            if(err) {
                logs.errorroutine(err);
            }
        });
    },

    hoverelement: function (hovertype, hoverelement, hoverlabel) {
        module.exports.mousemovetoelement(hovertype, hoverelement, hoverlabel);
        module.exports.browser.sleep(1000);
    },

    hoverandclickelement: function (hovertype, hoverelement, hoverlabel, clicktype, clickelement, clicklabel) {
        module.exports.mousemovetoelement(hovertype, hoverelement, hoverlabel);
        module.exports.browser.sleep(2000);
        module.exports.mousemoveandclick(clicktype, clickelement, clicklabel);
    },

    mousemovetoelement: function (type, element, label) {

        val.validateelementpresent(type, element, label);
        module.exports.browser.actions().mouseMove(uttil.findelement(type, element)).perform().then(function(){
                logs.logtoconsole('PASS: Moved to '+label)
            },
            function(err){
                logs.errorroutine(err)
            });

    },

    mousemoveandclick: function (type, element, label) {

        val.validateelementpresent(type, element, label);
        module.exports.browser.actions().mouseMove(uttil.findelement(type, element)).click().perform().then(function(){
                logs.logtoconsole('PASS: Moved to and Clicked '+label)
            },
            function(err){
                logs.errorroutine(err)
            });

    },

    getAttributeValue: function (xpath, orderid, label, callback) {
        is_compulsory = true;
        module.exports.browser.isElementPresent(webdriver.By.xpath(xpath)).then(
            function (present) {
                if (present) {
                    console.log(label + " found");
                    return module.exports.browser.findElement(webdriver.By.xpath(xpath)).getAttribute(orderid)
                        .then(function (val) {
                            console.log(orderid + " is: " + val);
                            module.exports.attArray[xpath] = val;
                            callback()
                        });
                } else {
                    if (is_compulsory == true) {
                        console.log(label + ' not found');
                        module.exports.takescreenshot();
                        module.exports.logtoFile(label + ' not found');
                        assert(present).isTrue();
                        return false;
                    }
                }
            });
    }

}
