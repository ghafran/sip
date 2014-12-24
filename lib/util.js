var START_LINE_REQUEST_REGEX = /^([\w\-.!%*_+`'~]+)\s([^\s]+)\sSIP\s*\/\s*(\d+\.\d+)/;
var START_LINE_STATUS_REGEX = /^SIP\/(\d+\.\d+)\s+(\d+)\s*(.*)\s*$/;
var HEADER_REGEX = /^([\S]*?)\s*:\s*([\s\S]*)$/;

var COMPACT_FORMS = {
    i: 'call-id',
    m: 'contact',
    e: 'contact-encoding',
    l: 'content-length',
    c: 'content-type',
    f: 'from',
    s: 'subject',
    k: 'supported',
    t: 'to',
    v: 'via'
};

function isRequestLine(startLine) {
    // Request-Line  =  Method SP Request-URI SP SIP-Version CRLF
    var match = startLine.match(START_LINE_REQUEST_REGEX);
    return match ? true : false;
}

function isStatusLine(startLine) {
    // Status-Line  =  SIP-Version SP Status-Code SP Reason-Phrase CRLF
    var match = startLine.match(START_LINE_STATUS_REGEX);
    return match ? true : false;
}

function parseRequestLine(startLine) {
    // Request-Line  =  Method SP Request-URI SP SIP-Version CRLF
    var match = startLine.match(START_LINE_REQUEST_REGEX);
    var request = {
        method: unescape(match[1]),
        uri: match[2],
        version: match[3]
    };
    return request;
}

function parseStatusLine(startLine) {
    // Status-Line  =  SIP-Version SP Status-Code SP Reason-Phrase CRLF
    var match = startLine.match(START_LINE_STATUS_REGEX);
    var status = {
        version: match[1],
        status: match[2],
        reason: match[3]
    };
    return status;
}

function parseHeaders(message) {
    // field-name: field-value
    var headers = {};
    var lines = message.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var match = lines[i].match(HEADER_REGEX);
        if (match) {
            var name = unescape(match[1]).toLowerCase();
            name = COMPACT_FORMS[name] || name;
            var value = match[2];
            headers[name] = value;
        }
    }
    return headers;
}

function parseUri(s) {
    if (typeof s === 'object') {
        return s;
    }
    var re = /^/;

    var r = re.exec(s);

    if (r) {
        return {
            schema: r[1],
            user: r[2],
            password: r[3],
            host: r[4],
            port: +r[5],
            params: (r[6].match(/([^;=]+)(=([^;=]+))?/g) || [])
                .map(function (s) {
                    return s.split('=');
                })
                .reduce(function (params, x) {
                    params[x[0]] = x[1] || null;
                    return params;
                }, {}),
            headers: ((r[7] || '').match(/[^&=]+=[^&=]+/g) || [])
                .map(function (s) {
                    return s.split('=');
                })
                .reduce(function (params, x) {
                    params[x[0]] = x[1];
                    return params;
                }, {})
        };
    }
}

module.exports.isRequestLine = isRequestLine;
module.exports.isStatusLine = isStatusLine;
module.exports.parseRequestLine = parseRequestLine;
module.exports.parseStatusLine = parseStatusLine;
module.exports.parseHeaders = parseHeaders;
module.exports.parseUri = parseUri;
