var _ = require('lodash'),
    Nutil = require('util'),
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

        // var viaProtocol = message.header('via').via().protocol();
        // var viaBranch = message.header('via').param('branch').value();
        // var via = Nutil.format('SIP/2.0/%s %s:%s;branch=%s;received=%s;', viaProtocol, '127.0.0.1', '5060', viaBranch, '127.0.0.1');
        // var via = Nutil.format('%s;received=127.0.0.1', message.header('via').value());
        var via = message.header('via').value() + ';received=127.0.0.1';

        var to =  message.header('to').value();

        var from = message.header('from').value();

        var callId = message.header('call-id').value();

        var cSeq = message.header('cseq').value();

        var response = startLine + '\r\n' +
            'Via: ' + via + '\r\n' +
            'To: ' +  to + '\r\n' +
            'From: ' + from + '\r\n' +
            'Call-ID: ' + callId + '\r\n' +
            'CSeq: ' + cSeq + '\r\n' +
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
