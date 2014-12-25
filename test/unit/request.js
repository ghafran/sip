var fs = require('fs'),
    xpect = require('chai').expect,
    chance = require('chance').Chance();

var Request = require('../../lib/request');

describe('Request', function () {

    describe('Initialize', function () {

        it('register', function (done) {

            var request = new Request('REGISTER sip:registrar.com SIP/2.0');
            xpect(request).to.exist();
            xpect(request.method()).to.equal('REGISTER');
            xpect(request.uri()).to.exist();
            xpect(request.uri().host()).to.equal('registrar.com');
            done();
        });
        
        it('invite', function (done) {

            var request = new Request('INVITE sip:user1@server2.com SIP/2.0');
            xpect(request).to.exist();
            xpect(request.method()).to.equal('INVITE');
            xpect(request.uri()).to.exist();
            xpect(request.uri().user()).to.equal('user1');
            xpect(request.uri().host()).to.equal('server2.com');
            done();
        });
    });
});
