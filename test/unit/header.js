var fs = require('fs'),
    xpect = require('chai').expect,
    chance = require('chance').Chance();

var Header = require('../../lib/header');

describe('Header', function () {

    describe('Initialize', function () {

        it('value', function (done) {

            fs.readFile(__dirname + '/assets/request_invite.txt', {
                encoding: 'utf8'
            }, function (err, request) {
                if (err) {
                    done(err);
                } else {
                    var header1 = new Header(request, 'to');
                    xpect(header1).to.exist();
                    xpect(header1.value()).to.equal('user2 <sip:user2@server2.com>');

                    var header2 = new Header(request, 'from');
                    xpect(header2).to.exist();
                    xpect(header2.value()).to.equal('user1 <sip:user1@server1.com>;tag=1928301774');

                    var header3 = new Header(request, 'call-id');
                    xpect(header3).to.exist();
                    xpect(header3.value()).to.equal('a84b4c76e66710@pc33.server1.com');

                    done();
                }
            });
        });
    });

    describe('aof', function () {
        it('simple', function (done) {

            fs.readFile(__dirname + '/assets/request_invite.txt', {
                encoding: 'utf8'
            }, function (err, request) {
                if (err) {
                    done(err);
                } else {
                    var header1 = new Header(request, 'to');
                    xpect(header1).to.exist();
                    xpect(header1.value()).to.equal('user2 <sip:user2@server2.com>');
                    xpect(header1.aof()).to.exist();
                    xpect(header1.aof().user()).to.equal('user2');
                    xpect(header1.aof().host()).to.equal('server2.com');
                    done();
                }
            });
        });
    });
});
