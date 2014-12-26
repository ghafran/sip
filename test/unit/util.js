var fs = require('fs'),
    xpect = require('chai').expect,
    chance = require('chance').Chance();

var Util = require('../../lib/util');

describe('Util', function () {

    describe('isRequestLine', function () {

        it('true', function () {

            var startLine = 'REGISTER sip:' + chance.email() + ' SIP/2.0';
            var isRequestLine = Util.isRequestLine(startLine);
            return xpect(isRequestLine).to.equal(true);
        });

        it('false', function () {

            var startLine = 'SIP/2.0 200 OK';
            var isRequestLine = Util.isRequestLine(startLine);
            return xpect(isRequestLine).to.equal(false);
        });
    });

    describe('isStatusLine', function () {

        it('true', function () {

            var startLine = 'SIP/2.0 200 OK';
            var isStatusLine = Util.isStatusLine(startLine);
            return xpect(isStatusLine).to.equal(true);
        });

        it('false', function () {

            var startLine = 'REGISTER sip:' + chance.email() + ' SIP/2.0';
            var isStatusLine = Util.isStatusLine(startLine);
            return xpect(isStatusLine).to.equal(false);
        });
    });

    describe('parseRequestLine', function () {

        it('valid', function () {

            var uri = 'sip:' + chance.email();
            var startLine = 'REGISTER ' + uri + ' SIP/2.0';
            var request = Util.parseRequestLine(startLine);
            xpect(request).to.exist();
            xpect(request.method).to.equal('REGISTER');
            xpect(request.uri).to.equal(uri);
            xpect(request.version).to.equal('2.0');
        });
    });

    describe('parseStatusLine', function () {

        it('valid', function () {

            var startLine = 'SIP/2.0 200 OK';
            var status = Util.parseStatusLine(startLine);
            xpect(status).to.exist();
            xpect(status.version).to.equal('2.0');
            xpect(status.status).to.equal('200');
            xpect(status.reason).to.equal('OK');
        });
    });

    describe('parseHeaders', function () {

        it('valid', function (done) {

            fs.readFile(__dirname + '/assets/request_invite.txt', {
                encoding: 'utf8'
            }, function (err, request) {
                if (err) {
                    done(err);
                } else {
                    var headers = Util.parseHeaders(request);
                    xpect(headers).to.exist();
                    xpect(headers['to']).to.equal('user2 <sip:user2@server2.com>');
                    xpect(headers['from']).to.equal('user1 <sip:user1@server1.com>;tag=1928301774');
                    xpect(headers['call-id']).to.equal('a84b4c76e66710@pc33.server1.com');
                    done();
                }
            });
        });

        it('should not contain returns', function (done) {

            var headers = Util.parseHeaders('From: <sip:test@localhost>;tag=kFUkwBLr5\r\n' +
                'To: sip:test@localhost\r\n' +
                'CSeq: 20 REGISTER\r\n');
            xpect(headers).to.exist();
            xpect(headers['to']).to.not.have.string('\r');
            xpect(headers['to']).to.not.have.string('\n');
            xpect(headers['from']).to.not.have.string('\r');
            xpect(headers['from']).to.not.have.string('\n');
            done();
        });
    });

    describe('parseParams', function () {

        it('valid', function (done) {

            var params = Util.parseParams('SIP/2.0/TCP 127.0.0.1:59108;alias;branch=z9hG4bK.3Hhn~YCyt;rport');
            xpect(params).to.exist();
            xpect(params['branch']).to.equal('z9hG4bK.3Hhn~YCyt');
            xpect(params['alias']).to.equal('');
            xpect(params['rport']).to.equal('');
            done();
        });
    });

    describe('parseHeaderValueAof', function () {

        it('<>', function (done) {

            var aof = Util.parseHeaderValueAof('user2 <sip:user2@server2.com>');
            xpect(aof).to.exist();
            xpect(aof.name).to.equal('user2');
            xpect(aof.uri).to.equal('sip:user2@server2.com');
            done();
        });

        it('no <>', function (done) {

            var aof = Util.parseHeaderValueAof('sip:user2@server2.com');
            xpect(aof).to.exist();
            xpect(aof.uri).to.equal('sip:user2@server2.com');
            done();
        });
    });

    describe('parseUri', function () {

        it('valid', function (done) {

            var uri = Util.parseUri('sip:user1@server1.com');
            xpect(uri).to.exist();
            xpect(uri.schema).to.equal('sip');
            xpect(uri.user).to.equal('user1');
            xpect(uri.host).to.equal('server1.com');
            done();
        });
    });

    describe('getStatusText', function () {

        it('valid', function (done) {

            var text = Util.getStatusText(200);
            xpect(text).to.equal('OK');
            done();
        });
    });
});
