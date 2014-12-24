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
                    xpect(message.type()).to.equal('request');
                    done();
                }
            });
        });
    });
});
