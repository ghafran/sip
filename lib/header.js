/*
[H4.2] also specifies that multiple header fields of the same field
name whose value is a comma-separated list can be combined into one
header field.  That applies to SIP as well, but the specific rule is
different because of the different grammars.  Specifically, any SIP
header whose grammar is of the form

header  =  "header-name" HCOLON header-value *(COMMA header-value)

allows for combining header fields of the same name into a comma-
separated list.  The Contact header field allows a comma-separated
list unless the header field value is "*".
*/
var _ = require('lodash'),
    net = require('net'),
    Runtime = require('./runtime')(__filename),
    Util = require('./util'),
    Uri = require('./uri');

function Header(data, name) {

    var _self = this;
    _self.raw = data;
    _self.name = name;

    _self.value = function () {

        var headers = Util.parseHeaders(_self.raw);
        var value = headers[_self.name];
        return value;
    };

    _self.aof = function () {

        var headers = Util.parseHeaders(_self.raw);
        var value = headers[_self.name];
        var parsed = Util.parseHeaderValueAof(value);
        var uri = new Uri(parsed.uri);
        return uri;
    };

    return _self;
}

module.exports = function (data, name) {

    return new Header(data, name);
};
