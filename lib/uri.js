var _ = require('lodash'),
    net = require('net'),
    Runtime = require('./runtime')(__filename),
    Util = require('./util');

function Uri(data) {

    var _self = this;
    _self.uri = data;

    _self.host = function () {

        var parsed = Util.parseUri(_self.uri);
        var host = parsed.host;
        return host;
    };

    return _self;
}

module.exports = function (data) {

    return new Uri(data);
};
