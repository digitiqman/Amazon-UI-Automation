/**
 * Created by Daniel Oluwole Bejide on 10/09/18.
 * For Rewe Group Test
 **/

var framework = require('../../frameworks/rewetest.js');
var config = require('../../dataconfig');
var data = config.confData;

var test = require('selenium-webdriver/testing');
var logs = require('../../rewelogging.js');


test.describe('Amazon Test Suites', function() {

    test.before(function(){
        framework.openbrowser();
        logs.settestname("Amazon Test Cases Suite", "Amazon End To End Sanity Test Suite");
        framework.openurl(data.home.url);
    });

    test.it('Testing Amazon Login', function() {
        framework.login(data.type, data.logindetails, data.userdata);
    });

    test.it('Testing Amazon Search', function() {
        framework.search(data.type, data.searchdetails);
    });

    test.it('Testing Amazon Checkout', function() {
        framework.checkout(data.type, data.searchdetails, data.checkoutdetails);
    });

    test.it('Testing Amazon Log Out', function() {
        framework.logout(data.type, data.logindetails, data.userdata);
    });

    test.after(function () {
        framework.closebrowser();
    });
});