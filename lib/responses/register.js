var _ = require('lodash'),
    Nutil = require('util'),
    Runtime = require('../runtime')(__filename),
    Responder = require('../responder'),
    Util = require('../util');

function RegisterResponse(message) {

    var _self = this;
    _self.message = message;

    _self.generate = function () {

        _self.statusCode = _self.statusCode || 200;
        _self.statusText = _self.statusText || Util.getStatusText(_self.statusCode);
        var startLine = Nutil.format('SIP/2.0 %s %s', _self.statusCode, _self.statusText);

        var viaProtocol = message.header('via').via().protocol();
        var viaBranch = message.header('via').param('branch').value();
        var via = Nutil.format('SIP/2.0/%s %s:%s;branch=%s;', viaProtocol, 'localhost', '5060', viaBranch);

        var to = message.header('to').value();

        var from = message.header('from').value();

        var callId = message.header('call-id').value();

        var cSeq = message.header('cseq').value();

        var contact = message.header('contact').value();

        var response = Nutil.format('%s\nVia: %s\nTo: %s\nFrom: %s\nCall-ID: %s\nCSeq: %s\nContact: %s\nExpires: 7200\nContent-Length: 0\n',
            startLine, via, to, from, callId, cSeq, contact);
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
