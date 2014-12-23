var xpect = require('chai').expect,
    chance = require('chance').Chance();

var message = require('../../lib/message');

describe('message', function () {

    describe('isRequestLine', function () {

        it('true', function () {

            var startLine = 'REGISTER sip:' + chance.email() + ' SIP/2.0';
            var isRequestLine = message.isRequestLine(startLine);
            return xpect(isRequestLine).to.equal(true);
        });

        it('false', function () {

            var startLine = 'SIP/2.0 200 OK';
            var isRequestLine = message.isRequestLine(startLine);
            return xpect(isRequestLine).to.equal(false);
        });
    });

    describe('isStatusLine', function () {

        it('true', function () {

            var startLine = 'SIP/2.0 200 OK';
            var isStatusLine = message.isStatusLine(startLine);
            return xpect(isStatusLine).to.equal(true);
        });

        it('false', function () {

            var startLine = 'REGISTER sip:' + chance.email() + ' SIP/2.0';
            var isStatusLine = message.isStatusLine(startLine);
            return xpect(isStatusLine).to.equal(false);
        });
    });

    describe('parseRequestLine', function () {

        it('valid', function () {

            var uri = 'sip:' + chance.email();
            var startLine = 'REGISTER ' + uri + ' SIP/2.0';
            var request = message.parseRequestLine(startLine);
            xpect(request).to.exist();
            xpect(request.method).to.equal('REGISTER');
            xpect(request.uri).to.equal(uri);
            xpect(request.version).to.equal('2.0');
        });
    });

    describe('parseStatusLine', function () {

        it('valid', function () {

            var startLine = 'SIP/2.0 200 OK';
            var status = message.parseStatusLine(startLine);
            xpect(status).to.exist();
            xpect(status.version).to.equal('2.0');
            xpect(status.status).to.equal('200');
            xpect(status.reason).to.equal('OK');
        });
    });

    describe('parseHeaders', function () {

        // it('valid', function () {
        //
        //     var startLine = 'SIP/2.0 200 OK';
        //     var status = message.parseStatusLine(startLine);
        //     xpect(status).to.exist();
        //     xpect(status.version).to.equal('2.0');
        //     xpect(status.status).to.equal('200');
        //     xpect(status.reason).to.equal('OK');
        // });
    });
});
