var fs = require('fs'),
    xpect = require('chai').expect,
    chance = require('chance').Chance();

var Uri = require('../../lib/uri');

describe('Uri', function () {

    describe('Initialize', function () {

        it('simple', function (done) {

            var uri = new Uri('sip:user1@domain.com');
            xpect(uri).to.exist();
            xpect(uri.schema()).to.equal('sip');
            xpect(uri.user()).to.equal('user1');
            xpect(uri.host()).to.equal('domain.com');
            xpect(uri.address()).to.equal('user1@domain.com');
            done();
        });
        
        it('all', function (done) {

            var uri = new Uri('sip:user1:pass1@domain.com:5060');
            xpect(uri).to.exist();
            xpect(uri.schema()).to.equal('sip');
            xpect(uri.user()).to.equal('user1');
            xpect(uri.password()).to.equal('pass1');
            xpect(uri.host()).to.equal('domain.com');
            xpect(uri.port()).to.equal(5060);
            xpect(uri.address()).to.equal('user1@domain.com');
            done();
        });
    });
});
