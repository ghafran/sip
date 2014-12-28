/*
When a UAS receives a request from a UAC, the UAS MAY authenticate
the originator before the request is processed.  If no credentials
(in the Authorization header field) are provided in the request, the
UAS can challenge the originator to provide credentials by rejecting
the request with a 401 (Unauthorized) status code.

The WWW-Authenticate response-header field MUST be included in 401
(Unauthorized) response messages.  The field value consists of at
least one challenge that indicates the authentication scheme(s) and
parameters applicable to the realm.
*/
var _ = require('lodash'),
    Nutil = require('util'),
    Digest = require('../digest'),
    Responder = require('../responder'),
    Util = require('../util');

function RegisterResponse(message) {

    var Runtime = require('../runtime')(__filename);
    var _self = this;
    _self.message = message;

    _self.generate = function () {

        _self.statusCode = _self.statusCode || 200;
        _self.statusText = _self.statusText || Util.getStatusText(_self.statusCode);
        var startLine = Nutil.format('SIP/2.0 %s %s', _self.statusCode, _self.statusText);

        var via = message.header('via').value() + ';received=127.0.0.1'; // don't add ';' after received param

        var to =  '<' + message.header('to').value() + '>';

        var from = message.header('from').value();

        var callId = message.header('call-id').value();

        var cSeq = message.header('cseq').value();

        var wwwAuthenticate;
        if(_self.statusCode === 401){

            var realm = message.header('to').uri().host();
            var domain = message.header('to').uri().host();
            wwwAuthenticate = Digest.createChallenge(realm, domain);
        }

        var response = startLine + '\r\n' +
            'Via: ' + via + '\r\n' +
            'To: ' +  to + '\r\n' +
            'From: ' + from + '\r\n' +
            'Call-ID: ' + callId + '\r\n' +
            'CSeq: ' + cSeq + '\r\n' +
            (wwwAuthenticate ? wwwAuthenticate + '\r\n' : '') +
            'Content-Length: 0' + '\r\n\r\n';
        return response;
    };

    _self.status = function (statusCode, statusText) {
        _self.statusCode = statusCode;
        _self.statusText = statusText;
        return _self;
    };

    _self.send = function () {

        var response = _self.generate();
        Responder.send(_self.message, response);
    };

    return _self;
}

module.exports = function (message) {

    return new RegisterResponse(message);
};
