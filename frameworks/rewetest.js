
var async = require('async');
var config = require('../dataconfig');
var data = config.confData;
var help = require('./../rewehelpers.js');
var webdriver = require('selenium-webdriver');


var driver;


var logs= require('./../rewelogging');
var a = require('./../reweactions'),
    l = require('./../rewelogging'),
    v = require('./../rewevalidations');


module.exports = {

    browsername: null,
    attArray: [],
    delaying: false,

    openbrowser: function (browser) {
        if (typeof (browser) === 'undefined') {
            browser = data.default_browser;
        }
        module.exports.browsername = browser;
        driver = // new
            // webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();

            new webdriver.Builder().usingServer('http://localhost:4444/wd/hub')
                .withCapabilities({
                    'browserName': browser,
                    'chromeOptions': {
                        'args': ['--disable-extensions', '--start-maximized']
                    }
                }).build();

        v.addDriver(driver);
        a.addDriver(driver);
        help.addDriver(driver);
        l.addDriver(driver);
        a.addArray(module.exports.attArray);

        driver.manage().deleteAllCookies();
        //driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(25000);
    },

    openurl: function (url) {
        driver.manage().timeouts().pageLoadTimeout(60000);
        driver.get(url).then(function () {
        }, function (err) {
            logs.logtoconsole("Error Title: " + err.state);
            logs.assertTrue('Page','Displayed',err)
        });
        driver.manage().timeouts().implicitlyWait(20000);
    },

    login: function(type, logindetails, userdetails, cb) {
        async.series([
            function(callback){
                a.hoverandclickelement(type['xpath'], logindetails['loginGroupXpath'], "Logged In Group Details", type['xpath'], logindetails['loginXpath'], "Login Button");
                driver.sleep(3000);
                callback();
            },
            function (callback) {
                a.clearandsendkeys(type['id'], logindetails['loginEmailId'], "Email or Phone Textbox", userdetails['email']);
                callback();
            },
            function(callback) {
                a.clickbutton(type['id'], logindetails['loginContinueId'], "Continue button");
                driver.sleep(3000);
                callback();
            },
            function (callback) {
                a.clearandsendkeys(type['id'], logindetails['loginPasswordId'], "Password Textbox", userdetails['password']);
                callback();
            },
            function(callback) {
                a.clickbutton(type['id'], logindetails['loginSigninId'], "Signin button");
                driver.sleep(5000);
                callback();
            },
            function(callback) {
                v.validateelementcontainstext(type['xpath'], logindetails['loggedInXpath'], logindetails['loggedInGreetings'], "Logged In Greeting Text");
                driver.sleep(2000);
                callback();
            }
        ], cb)

    },


    logout: function(type, logindetails, userdetails, cb) {
        async.series([
            function(callback){
                a.hoverelement(type['xpath'], logindetails['loginGroupXpath'], "Logged In Group Details");
                driver.sleep(2000);
                callback();
            },
            function(callback) {
                a.clickbutton(type['id'], logindetails['logoutId'], "Signout Link");
                driver.sleep(7000);
                callback();
            }
        ], cb)

    },

    search: function(type, searchdetails, cb) {
        async.series([
            function (callback) {
                a.clearandsendkeys(type['id'], searchdetails['searchBoxId'], "Product Search Textbox", searchdetails['firstSearchWord']);
                callback();
            },
            function(callback) {
                a.clickbutton(type['xpath'], searchdetails['searchButtonXpath'], "Search button");
                driver.sleep(5000);
                callback();
            },
            function(callback) {
                v.validateelementcontainstext(type['xpath'], searchdetails['firstResultTitleXpath'], searchdetails['firstResultMustContainWord'], "Product Title");
                driver.sleep(7000);
                callback();
            },
            function(callback) {
                a.clickelement(type['xpath'], searchdetails['firstResultLinkXpath'], "Product Details Link");
                driver.sleep(7000);
                callback();
            },
            function(callback){
                a.hoverelement(type['id'], searchdetails['productImageMagId'], "Product Magnifier");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], searchdetails['productImageMagClickId'], "Product Magnifier Clicker");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], searchdetails['productImageZoomId'], "Product Zoom +");
                driver.sleep(6000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], searchdetails['productImageZoomId'], "Product Zoom -");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['class'], searchdetails['closeImageMagClass'], "Close Product Image Button");
                driver.sleep(5000);
                callback();
            }
        ], cb);
    },

    checkout: function(type, searchdetails, checkoutdetails, cb){
        async.series([
            function(callback) {
                a.clickelement(type['xpath'], checkoutdetails['changeSectionXpath'], "Product Category Selector");
                driver.sleep(2000);
                callback();
            },
            function(callback) {
                a.clickspecificelementbytext(checkoutdetails['changeSectionText'], "Product Category Choice", checkoutdetails['changeChoiceDomType']);
                driver.sleep(1000);
                callback();
            },
            function (callback) {
                a.clearandsendkeys(type['id'], searchdetails['searchBoxId'], "Product Search Textbox", checkoutdetails['firstSearchWord']);
                console.log("Searching for \"" + checkoutdetails['firstSearchWord'] + "\"");
                callback();
            },
            function(callback) {
                a.clickbutton(type['xpath'], searchdetails['searchButtonXpath'], "Search button");
                driver.sleep(5000);
                callback();
            },
            function(callback) {
                v.validateelementcontainstext(type['css'], checkoutdetails['firstResultTitleCss'], checkoutdetails['firstSearchWord'], "Product Title");
                driver.sleep(7000);
                callback();
            },
            function(callback) {
                a.clickelement(type['css'], checkoutdetails['firstResultLinkCss'], "Product Details Link");
                driver.sleep(5000);
                callback();
            },
            function(callback) {
                a.clickelement(type['id'], checkoutdetails['lookInsideId'], "Look Inside Product Link");
                driver.sleep(5000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['productImageZoom+Id'], "Product Zoom +");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['productImageZoom+Id'], "Product Zoom +");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['productImageZoom-Id'], "Product Zoom -");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['productImageZoom-Id'], "Product Zoom -");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['closeProductDetailsId'], "Close Product Details Button");
                driver.sleep(5000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['addToCartId'], "Add to Cart Button");
                driver.sleep(5000);
                callback();
            },
            function (callback) {
                a.clearandsendkeys(type['id'], searchdetails['searchBoxId'], "Product Search Textbox", checkoutdetails['secondSearchWord']);
                console.log("Searching for \"" + checkoutdetails['secondSearchWord'] + "\"");
                callback();
            },
            function(callback) {
                a.clickbutton(type['xpath'], searchdetails['searchButtonXpath'], "Search button");
                driver.sleep(5000);
                callback();
            },
            function(callback) {
                v.validateelementcontainstext(type['css'], checkoutdetails['firstResultTitleCss'], checkoutdetails['secondSearchWord'], "Product Title");
                driver.sleep(4000);
                callback();
            },
            function(callback) {
                a.clickelement(type['css'], checkoutdetails['firstResultLinkCss'], "Product Details Link");
                driver.sleep(5000);
                callback();
            },
            function(callback) {
                a.clickelement(type['id'], checkoutdetails['lookInsideId'], "Look Inside Product Link");
                driver.sleep(5000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['productImageZoom+Id'], "Product Zoom +");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['productImageZoom+Id'], "Product Zoom +");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['productImageZoom-Id'], "Product Zoom -");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['productImageZoom-Id'], "Product Zoom -");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['closeProductDetailsId'], "Close Product Details Button");
                driver.sleep(5000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['addToCartId'], "Add to Cart Button");
                driver.sleep(5000);
                callback();
            },
            function (callback) {
                a.clearandsendkeys(type['id'], searchdetails['searchBoxId'], "Product Search Textbox", checkoutdetails['thirdSearchWord']);
                console.log("Searching for \"" + checkoutdetails['thirdSearchWord'] + "\"");
                callback();
            },
            function(callback) {
                a.clickbutton(type['xpath'], searchdetails['searchButtonXpath'], "Search button");
                driver.sleep(5000);
                callback();
            },
            function(callback) {
                v.validateelementcontainstext(type['css'], checkoutdetails['firstResultTitleCss'], checkoutdetails['thirdSearchWord'], "Product Title");
                driver.sleep(4000);
                callback();
            },
            function(callback) {
                a.clickelement(type['css'], checkoutdetails['firstResultLinkCss'], "Product Details Link");
                driver.sleep(5000);
                callback();
            },
            function(callback) {
                a.clickelement(type['id'], checkoutdetails['lookInsideId'], "Look Inside Product Link");
                driver.sleep(5000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['productImageZoom+Id'], "Product Zoom +");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['productImageZoom+Id'], "Product Zoom +");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['productImageZoom-Id'], "Product Zoom -");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['productImageZoom-Id'], "Product Zoom -");
                driver.sleep(2000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['closeProductDetailsId'], "Close Product Details Button");
                driver.sleep(5000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['addToCartId'], "Add to Cart Button");
                driver.sleep(5000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['goToCartId'], "View Cart Button");
                driver.sleep(5000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['proceedToCheckoutId'], "Checkout Button");
                driver.sleep(10000);
                callback();
            },
            function(callback){
                console.log("RETURNING BACK TO CART TO DELETE SELECTED ITEMS.");
                console.log("I WOULD NOT WANT TO PLACE THIS ORDER FOR REAL...");
                console.log("JUST A TEST, YOU KNOW...  :)  :)  :)");
                help.navigateback();
                driver.sleep(5000);
                callback();
            },
            function(callback){
                a.clickelement(type['css'], checkoutdetails['itemDeletionCss'], "Item Deletion Link");
                driver.sleep(6000);
                callback();
            },
            function(callback){
                a.clickelement(type['css'], checkoutdetails['itemDeletionCss'], "Item Deletion Link");
                driver.sleep(6000);
                callback();
            },
            function(callback){
                a.clickelement(type['css'], checkoutdetails['itemDeletionCss'], "Item Deletion Link");
                driver.sleep(6000);
                callback();
            },
            function(callback){
                a.clickelement(type['id'], checkoutdetails['goToCartId'], "View Cart Button");
                driver.sleep(5000);
                callback();
            },
            function(callback) {
                v.validateelementcontainstext(type['xpath'], checkoutdetails['emptyCartIndicatorXpath'], checkoutdetails['emptyCartIndicatorText'], "Empty Cart Indicator");
                driver.sleep(4000);
                callback();
            }

        ], cb);

    },

    closebrowser: function (cb) {
        console.log("ready to close browser");
        driver.quit();
    }

};