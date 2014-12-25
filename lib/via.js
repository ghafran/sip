var _ = require('lodash'),
    net = require('net'),
    Runtime = require('./runtime')(__filename),
    Util = require('./util');

function Via(data) {

    var _self = this;
    _self.via = data;

    _self.version = function () {

        var parsed = Util.parseVia(_self.via);
        var version = parsed.version;
        return version;
    };
    
    _self.protocol = function () {

        var parsed = Util.parseVia(_self.via);
        var protocol = parsed.protocol;
        return protocol;
    };
    
    _self.host = function () {

        var parsed = Util.parseVia(_self.via);
        var host = parsed.host;
        return host;
    };
    
    _self.port = function () {

        var parsed = Util.parseVia(_self.via);
        var port = parsed.port;
        return port;
    };

    return _self;
}

module.exports = function (data) {

    return new Via(data);
};
