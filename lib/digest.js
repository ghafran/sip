/*
A WWW-Authenticate header field value contains an authentication
challenge.  See Section 22.2 for further details on its usage.

Example:

WWW-Authenticate: Digest realm="atlanta.com",
domain="sip:boxesbybob.com", qop="auth",
nonce="f84f1cec41e6cbe5aea9c8e88d359",
opaque="", stale=FALSE, algorithm=MD5
*/
var crypto = require('crypto'),
    Util = require('util');

function md5(value) {
    var hash = crypto.createHash('md5');
    hash.update(value);
    var hashed = hash.digest('hex');
    return hashed;
}

function numberTo8Hex(n) {
    n = n.toString(16);
    return '00000000'.substr(n.length) + n;
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
    var challenge = 'WWW-Authenticate: Digest realm="' + realm + '", domain="' + domain + '", qop="' + qop + '", nonce="' + nonce + '", opaque="' + opaque + '", stale=FALSE, algorithm="' + algorithm + '"';
    return challenge;
}

function validateAuthorization(authorizationHeader, realm, username, password, content) {

    if (!authorizationHeader) {
        return false;
    }

    var params = Util.parseAuthHeader(authorizationHeader);

    var cnonce = params.cnonce;
    var uri = params.uri;
    var qop = params.qop ? params.qop.toLowerCase() : params.qop;
    var nc = (params.nc || 0) + 1;

    var ha1 = md5(username + ':' + realm + ':' + password);
    if (params.algoritm === 'md5-sess') {
        ha1 = md5(ha1 + ':' + params.nonce + '' + cnonce);
    }

    var digest;
    if(qop === 'auth-int'){
        digest = md5(ha1 + ':' + params.nonce + ':' + numberTo8Hex(nc) + ':' + cnonce + ':' + qop, md5(params.method + ':' + uri + ':' + md5(content)));
    } else if(qop === 'auth'){
        digest = md5(ha1 + ':' + params.nonce + ':' + numberTo8Hex(nc) + ':' + cnonce + ':' + qop + ':' + md5(params.method + ':' + params.uri));
    } else {
        digest = md5(ha1 + ':' + params.nonce + ':' + md5(params.method + ':' + params.uri));
    }

    if (digest === 'something in header') {
        return true;
    }

    return false;
}

module.exports.createChallenge = createChallenge;
module.exports.validateAuthorization = validateAuthorization;
