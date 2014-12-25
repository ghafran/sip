var _ = require('lodash'),
    Nutil = require('util'),
    Runtime = require('../runtime')(__filename),
    Responder = require('../responder'),
    Util = require('../util');

function RegisterResponse(message) {

    var _self = this;
    _self.message = message;
    
    _self.generate = function(){
        
        _self.statusCode = _self.statusCode || 200;
        _self.statusText = _self.statusText || Util.getStatusText(_self.statusCode);
        var startLine = Nutil.format('SIP/2.0 %s %s', _self.statusCode, _self.statusText);
        var response = startLine;
        return response;
    };
    
    _self.status = function(statusCode, statusText){
        _self.statusCode = statusCode;
        _self.statusText = statusText;
        return _self;
    };
    
    _self.send = function(){
        
        var response = _self.generate();
        Responder.send(_self.message, response);
    };

    return _self;
}

module.exports = function (message) {

    return new RegisterResponse(message);
};
