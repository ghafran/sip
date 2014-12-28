/*
A WWW-Authenticate header field value contains an authentication
challenge.  See Section 22.2 for further details on its usage.

Example:

WWW-Authenticate: Digest realm="atlanta.com",
domain="sip:boxesbybob.com", qop="auth",
nonce="f84f1cec41e6cbe5aea9c8e88d359",
opaque="", stale=FALSE, algorithm=MD5
*/
var crypto = require('crypto');

function md5(value) {
    var hash = crypto.createHash('md5');
    hash.update(value);
    var hashed = hash.digest('hex');
    return hashed;
}

function generateNonce() {
    return md5(Math.random().toString() + ':' + Math.random().toString());
}

function createChallenge(realm, domain) {

    var nonce = generateNonce();
    var nc = 0;
    var qop = 'auth,auth-int';
    var algorithm = 'md5';
    var opaque = '';

    var challenge = {
        scheme: 'Digest',
        realm: realm,
        domain: domain,
        qop: qop,
        algorithm: algorithm,
        nonce: nonce,
        opaque: ''
    };
    return challenge;
}

module.exports.createChallenge = createChallenge;
