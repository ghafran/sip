
var START_LINE_REQUEST_REGEX = /^([\w\-.!%*_+`'~]+)\s([^\s]+)\sSIP\s*\/\s*(\d+\.\d+)/;
var START_LINE_STATUS_REGEX = /^SIP\/(\d+\.\d+)\s+(\d+)\s*(.*)\s*$/;

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
	var match = message.match(/\s*;\s*([\w\-.!%*_+`'~]+)(?:\s*=\s*([\w\-.!%*_+`'~]+|"[^"\\]*(\\.[^"\\]*)*"))?/g);
	var headers = {};
	for(var i = 0; i < match.length; i++) {
		headers[match[1].toLowerCase()] = match[2];
	}
	return headers;
}

function parse(message) {

    var parsed = {};

    var lines = message.split('\n');

    var startLine = lines[0];
    parsed.isRequest = isRequestLine(startLine);
    parsed.isStatus = isStatusLine(startLine);

    if (parsed.isRequest) {

		parsed.request = parseRequestLine(startLine);
    } else if (parsed.isStatus) {

		parsed.status = parseStatusLine(startLine);
	}

	parsed.headers = parseHeaders(message);


	return parsed;
}

module.exports.parse = parse;
module.exports.isRequestLine = isRequestLine;
module.exports.isStatusLine = isStatusLine;
module.exports.parseRequestLine = parseRequestLine;
module.exports.parseStatusLine = parseStatusLine;
module.exports.parseHeaders = parseHeaders;
