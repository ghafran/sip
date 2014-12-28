function createChallenge(realm, isProxy) {

    var nonce = rbytes();
    var nc = 0;
    var qop = 'auth,auth-int';
    var algorithm = 'md5';

    var hname = isProxy ? 'proxy-authenticate' : 'www-authenticate';
    var challenge = {
        scheme: 'Digest',
        realm: realm,
        qop: qop,
        algorithm: algorithm,
        nonce: nonce,
        opaque: opaque
    };
    return challenge;
}

module.exports.createChallenge = createChallenge;
