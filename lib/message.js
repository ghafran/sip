var _ = require('lodash'),
    net = require('net'),
    Util = require('./util'),
    Request = require('./request'),
    Header = require('./header');

function Message(data) {

    var Runtime = require('./runtime')(__filename);
    var _self = this;
    _self.raw = data;

    _self.type = function () {

        _self.startLine = _self.raw.split('\n')[0];
        var isRequest = Util.isRequestLine(_self.startLine);
        var isStatus = Util.isStatusLine(_self.startLine);

        if (isRequest) {
            return 'request';
        } else if (isStatus) {
            return 'status';
        } else {
            return 'unknown';
        }
    };

    _self.request = function () {

        _self.startLine = _self.raw.split('\n')[0];
        var request = new Request(_self.startLine);
        return request;
    };

    _self.header = function (name) {

        var header = new Header(_self.raw, name);
        return header;
    };

    return _self;
}

module.exports = function (data) {

    return new Message(data);
};
