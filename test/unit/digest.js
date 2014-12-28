var fs = require('fs'),
    xpect = require('chai').expect,
    chance = require('chance').Chance();

var Digest = require('../../lib/digest');

describe('Digest', function () {

    describe('validateAuthorization', function () {

        it('validate', function (done) {

            var isValid = Digest.validateAuthorization('Digest realm="host.com", ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
            'username="test",  uri="/dir/index.html", response="6629fae49393a05397450978507c4ef1", ' +
            'cnonce="0a4f113b", nc=00000001, qop=auth',
            'host.com', 'Mufasa', 'Circle Of Life', 'GET', '');
            xpect(isValid).to.equal(true);
            done();
        });
    });
});
