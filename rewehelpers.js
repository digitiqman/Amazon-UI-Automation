var webdriver = require('selenium-webdriver');

module.exports ={

    browser: null,

    addDriver: function(driver){
        module.exports.browser = driver;
    },

    elementpresent: function (type, element){
        switch(type) {
            case "css":
                return module.exports.browser.findElements(webdriver.By.css(element));
            case "id":
                return module.exports.browser.findElements(webdriver.By.id(element));
            case "xpath":
                return module.exports.browser.findElements(webdriver.By.xpath(element));
            case "linkText":
                return module.exports.browser.findElements(webdriver.By.linkText(element));
            case "name":
                return module.exports.browser.findElements(webdriver.By.name(element));
            case "class":
                return module.exports.browser.findElements(webdriver.By.className(element));
            default:
                return module.exports.browser.findElements(webdriver.By.id(element));
        }
    },
    findelement: function (type, element){
        switch(type) {
            case "css":
                return module.exports.browser.findElement(webdriver.By.css(element));
            case "id":
                return module.exports.browser.findElement(webdriver.By.id(element));
            case "xpath":
                return module.exports.browser.findElement(webdriver.By.xpath(element));
            case "linkText":
                return module.exports.browser.findElement(webdriver.By.linkText(element));
            case "name":
                return module.exports.browser.findElement(webdriver.By.name(element));
            case "class":
                return module.exports.browser.findElement(webdriver.By.className(element));
            default:
                return module.exports.browser.findElement(webdriver.By.id(element));
        }

    },

    getAttributeValue: function (xpath, orderid, label, is_compulsory) {
        if (typeof (is_compulsory) == 'undefined') {
            is_compulsory = true;
        }
        module.exports.browser.findElements(webdriver.By.xpath(xpath)).then(function (present) {
            if (present) {
                loggs.logtoconsole(label + " found");
                return module.exports.browser.findElement(webdriver.By.xpath(xpath)).getAttribute(orderid).then(function (val) {
                    loggs.logtoconsole(orderid + " is: " + val);
                    return module.exports.attArray[xpath] = val;
                });
            } else {
                if (is_compulsory == true) {
                    module.exports.failroutine(present, label + ' not found');
                }
            }
        });

    },

   navigateback :function(){
       module.exports.browser.sleep(50000);
       module.exports.browser.navigate().back();
    }

}