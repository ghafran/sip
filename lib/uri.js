var _ = require('lodash'),
    net = require('net'),
    Runtime = require('./runtime')(__filename),
    Util = require('./util');

function Uri(data) {

    var _self = this;
    _self.uri = data;

    _self.schema = function () {

        var parsed = Util.parseUri(_self.uri);
        var schema = parsed.schema;
        return schema;
    };
    
    _self.user = function () {

        var parsed = Util.parseUri(_self.uri);
        var user = parsed.user;
        return user;
    };
    
    _self.password = function () {

        var parsed = Util.parseUri(_self.uri);
        var password = parsed.password;
        return password;
    };
    
    _self.host = function () {

        var parsed = Util.parseUri(_self.uri);
        var host = parsed.host;
        return host;
    };
    
    _self.port = function () {

        var parsed = Util.parseUri(_self.uri);
        var port = parsed.port;
        return port;
    };

    return _self;
}

module.exports = function (data) {

    return new Uri(data);
};
