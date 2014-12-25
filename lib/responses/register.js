var _ = require('lodash'),
    Runtime = require('../runtime')(__filename),
    Responder = require('../responder'),
    Util = require('../util');

function RegisterResponse(message) {

    var _self = this;
    _self.message = message;
    
    _self.generate = function(){
        
    };
    
    _self.status = function(statusCode){
        _self.statusCode = statusCode;
        return _self;
    }
    
    _self.send = function(){
        
        var response = _self.generate();
        Responder.send(_self.message, response);
    }

    return _self;
}

module.exports = function (message) {

    return new RegisterResponse(message);
};
