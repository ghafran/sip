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

function trimQuotes(value){
    if(!value){
        return value;
    }
    value = value.replace(/^"(.*)"$/, '$1');
    return value;
}

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
    // var lines = message.split(/\r\n(?![ \t])/);
    var cleaned = message.replace(/\r?\n/g, '\n');
    var lines = cleaned.split('\n');
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

function parseParams(headerValue) {
    // param-name=param-value;
    var params = {};
    var matches = headerValue.match(/\s*;\s*([\w\-.!%*_+`'~]+)(?:\s*=\s*([\w\-.!%*_+`'~]+|"[^"\\]*(\\.[^"\\]*)*"))?/g);
    for (var i = 0; i < matches.length; i++) {
        var match = matches[i].match(/\s*;\s*([\w\-.!%*_+`'~]+)(?:\s*=\s*([\w\-.!%*_+`'~]+|"[^"\\]*(\\.[^"\\]*)*"))?/);
        params[match[1].toLowerCase()] = match[2] || '';
    }
    return params;
}

function parseAuthHeader(headerValue) {
    // first word is the scheme
    var matchWords = headerValue.match(/([^\s]*)\s+/g);
    var params = {
        scheme: matchWords[1].trim()
    };

    // comma delimited params
    var matches = headerValue.match(/([^\s,"=]*)\s*=\s*([^\s,"]+|"[^"\\]*(?:\\.[^"\\]*)*")\s*/g);
    for (var i = 0; i < matches.length; i++) {
        var match = matches[i].match(/([^\s,"=]*)\s*=\s*([^\s,"]+|"[^"\\]*(?:\\.[^"\\]*)*")\s*/);
        var value = match[2] || '';
        value = trimQuotes(value);
        params[match[1].toLowerCase()] = value;
    }
    return params;
}

function parseHeaderValueAof(headerValue) {
    var value;
    var matches = headerValue.match(/((?:[\w\-.!%*_+`'~]+)(?:\s+[\w\-.!%*_+`'~]+)*|"[^"\\]*(?:\\.[^"\\]*)*")?\s*<\s*([^>]*)\s*\>|((?:[^\s@"<]@)?[^\s;]+)/g);
    var match = matches[0].match(/((?:[\w\-.!%*_+`'~]+)(?:\s+[\w\-.!%*_+`'~]+)*|"[^"\\]*(?:\\.[^"\\]*)*")?\s*<\s*([^>]*)\s*\>|((?:[^\s@"<]@)?[^\s;]+)/);
    value = {
        name: match[1],
        uri: match[2] || match[3],
        params: {}
    };

    // TODO: parse params
    // var pmatches = headerValue.match(/\s*;\s*([\w\-.!%*_+`'~]+)(?:\s*=\s*([\w\-.!%*_+`'~]+|"[^"\\]*(\\.[^"\\]*)*"))?/g);
    // for(var r = applyRegex(re, data); r; r = applyRegex(re, data)) {
    //     value.params[r[1].toLowerCase()] = r[2];
    // }
    return value;
}

function parseVia(headerValue) {
    var matches = headerValue.match(/SIP\s*\/\s*(\d+\.\d+)\s*\/\s*([\S]+)\s+([^\s;:]+)(?:\s*:\s*(\d+))?/g);
    var match = matches[0].match(/SIP\s*\/\s*(\d+\.\d+)\s*\/\s*([\S]+)\s+([^\s;:]+)(?:\s*:\s*(\d+))?/);
    var value = {
        version: match[1],
        protocol: match[2],
        host: match[3],
        port: match[4] && +match[4],
        params: {}
    };
    // TODO: parse params
    // var pmatches = headerValue.match(/\s*;\s*([\w\-.!%*_+`'~]+)(?:\s*=\s*([\w\-.!%*_+`'~]+|"[^"\\]*(\\.[^"\\]*)*"))?/g);
    // for(var r = applyRegex(re, data); r; r = applyRegex(re, data)) {
    //     value.params[r[1].toLowerCase()] = r[2];
    // }
    return value;
}

function parseUri(uri) {
    if (typeof uri === 'object') {
        return uri;
    }

    var match = uri.match(/^(sips?):(?:([^\s>:@]+)(?::([^\s@>]+))?@)?([\w\-\.]+)(?::(\d+))?((?:;[^\s=\?>;]+(?:=[^\s?\;]+)?)*)(?:\?(([^\s&=>]+=[^\s&=>]+)(&[^\s&=>]+=[^\s&=>]+)*))?$/);

    if (match) {
        return {
            schema: match[1],
            user: match[2],
            password: match[3],
            host: match[4],
            port: +match[5],
            params: (match[6].match(/([^;=]+)(=([^;=]+))?/g) || [])
                .map(function (s) {
                    return s.split('=');
                })
                .reduce(function (params, x) {
                    params[x[0]] = x[1] || null;
                    return params;
                }, {}),
            headers: ((match[7] || '').match(/[^&=]+=[^&=]+/g) || [])
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

function getStatusText(statusCode) {
    statusCode = parseInt(statusCode);
    switch (statusCode) {
    case 200:
        return 'OK';
    case 202:
        return 'Accepted';
    case 204:
        return 'Accepted';
    case 401:
            return 'Authentication Required';
    default:
        return 'Uknown';
    }
}

module.exports.trimQuotes = trimQuotes;
module.exports.isRequestLine = isRequestLine;
module.exports.isStatusLine = isStatusLine;
module.exports.parseRequestLine = parseRequestLine;
module.exports.parseStatusLine = parseStatusLine;
module.exports.parseHeaders = parseHeaders;
module.exports.parseParams = parseParams;
module.exports.parseAuthHeader = parseAuthHeader;
module.exports.parseHeaderValueAof = parseHeaderValueAof;
module.exports.parseVia = parseVia;
module.exports.parseUri = parseUri;
module.exports.getStatusText = getStatusText;
