var _ = require('lodash'),
    net = require('net'),
    Runtime = require('./runtime')(__filename),
    Util = require('./util');

function Message(data) {

    var _self = this;
    _self.raw = data;
    _self.isRequest = false;
    _self.isStatus = false;

    _self.parse = function(){

        var startLine = _self.raw.split('\n')[0];
        _self.isRequest = Util.isRequestLine(startLine);
        _self.isStatus = Util.isStatusLine(startLine);

        if (_self.isRequest) {

            _self.request = _.merge(_self, Util.parseRequestLine(startLine));
        } else if (_self.isStatus) {

            _self.status = _.merge(_self, Util.parseStatusLine(startLine));
        }

        _self.headers = Util.parseHeaders(_self.raw);
    };

    if(_self.raw){
        _self.parse();
    }

    return _self;
}

module.exports = function (data) {

    return new Message(data);
};
