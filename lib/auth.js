var _ = require('lodash'),
    net = require('net'),
    Uri = require('./uri'),
    Util = require('./util');

function Auth(data) {

    var Runtime = require('./runtime')(__filename);
    var _self = this;
    _self.data = data;

    _self.params = function () {

        var params = Util.parseAuthHeader(_self.data);
        return params;
    };

    return _self;
}

module.exports = function (data) {

    return new Auth(data);
};
