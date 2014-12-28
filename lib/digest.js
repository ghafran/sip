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

function validateAuthorization = function (authorizationHeader, rq, creds) {

    if (!authorizationHeader) {
        return false;
    }

    var params = Util.parseAuthHeader(authorizationHeader);

    var cnonce = unq(params.cnonce);
    var uri = unq(params.uri);
    var qop = unq(lowercase(params.qop));
    var nc = (params.nc || 0) + 1;

    if (!ctx.ha1) {
        ctx.userhash = creds.hash || calculateUserRealmPasswordHash(creds.user, ctx.realm, creds.password);
        ctx.ha1 = ctx.userhash;
        if (ctx.algoritm === 'md5-sess')
            ctx.ha1 = kd(ctx.userhash, ctx.nonce, cnonce);
    }

    var digest = calculateDigest({
        ha1: ctx.ha1,
        method: rq.method,
        nonce: ctx.nonce,
        nc: numberTo8Hex(ctx.nc),
        cnonce: cnonce,
        qop: qop,
        uri: uri,
        entity: rq.content
    });
    if (digest === unq(response.response)) {
        ctx.cnonce = cnonce;
        ctx.uri = uri;
        ctx.qop = qop;

        return true;
    }

    return false;
}

module.exports.createChallenge = createChallenge;
module.exports.validateAuthorization = validateAuthorization;
