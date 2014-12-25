var fs = require('fs'),
    xpect = require('chai').expect,
    chance = require('chance').Chance();

var Header = require('../../lib/header');

describe('Header', function () {

    describe('Initialize', function () {

        it('register', function (done) {

            var header = new Header('REGISTER sip:registrar.com SIP/2.0');
            xpect(header).to.exist();
            done();
        });
    });
});
