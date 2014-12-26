var _ = require('lodash'),
    net = require('net'),
    Util = require('./util');

function Param(data, name) {

    var Runtime = require('./runtime')(__filename);
    var _self = this;
    _self.raw = data;
    _self.name = name;

    _self.value = function () {

        var params = Util.parseParams(_self.raw);
        var value = params[_self.name];
        return value;
    };

    return _self;
}

module.exports = function (data, name) {

    return new Param(data, name);
};
