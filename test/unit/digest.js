var fs = require('fs'),
    xpect = require('chai').expect,
    chance = require('chance').Chance();

var Digest = require('../../lib/digest');

describe('Digest', function () {

    describe('validateAuthorization', function () {

        it('validate', function (done) {

            var isValid = Digest.validateAuthorization('Digest realm="localhost", ' +
            'nonce="1513532f02cf1dca6dc855c45cb96ad7", opaque="", ' +
            'username="test",  uri="sip:localhost", response="bf599e1ffb9ab0ae950896cecb2d15e9", ' +
            'cnonce="faaa9095", nc=00000001, qop=auth',
            'localhost', 'test', 'test', 'REGISTER', '');
            xpect(isValid).to.equal(true);
            done();
        });

        it('validate2', function (done) {

            var isValid = Digest.validateAuthorization('Digest realm="localhost", ' +
            'nonce="180b1dc2c0f6abe5a8c3d574fdd009c5", opaque="", ' +
            'username="test",  uri="sip:localhost", response="8b7fe745cc0249bff4d998dacb80dfd9", ' +
            'cnonce="faaaaa85", nc=00000001, qop=auth',
            'localhost', 'test', 'test', 'REGISTER', '');
            xpect(isValid).to.equal(true);
            done();
        });
    });
});
