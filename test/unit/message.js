var fs = require('fs'),
    xpect = require('chai').expect,
    chance = require('chance').Chance();

var Message = require('../../lib/message');

describe('Message', function () {

    describe('Initialize', function () {

        it('valid', function (done) {

            fs.readFile(__dirname + '/assets/request_invite.txt', {
                encoding: 'utf8'
            }, function (err, request) {
                if (err) {
                    done(err);
                } else {
                    var message = new Message(request);
                    xpect(message).to.exist();
                    xpect(message.headers).to.exist();
                    xpect(message.isRequest).to.equal(true);
                    xpect(message.method).to.equal('INVITE');
                    xpect(message.headers['call-id']).to.equal('a84b4c76e66710@pc33.server1.com');
                    done();
                }
            });
        });
    });
});
