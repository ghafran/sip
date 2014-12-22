var rawbody = require('raw-body');

function isRequestLine(rq, m) {
	// Request-Line  =  Method SP Request-URI SP SIP-Version CRLF
	var match = rq.match(/^([\w\-.!%*_+`'~]+)\s([^\s]+)\sSIP\s*\/\s*(\d+\.\d+)/);
	return match ? true: false;
}

function isStatusLine(startLine) {
	// Status-Line  =  SIP-Version SP Status-Code SP Reason-Phrase CRLF
	var match = startLine.match(/^SIP\/(\d+\.\d+)\s+(\d+)\s*(.*)\s*$/);
	return match ? true: false;
}

function parse(message) {

	var parsed = {};

	if(!message || typeof message !== 'string'){
		return parsed;
	}

	var lines = message.split('\n');

	var startLine = lines[0];


	if(!(parseResponse(data[0], m) || parseRequest(data[0], m)))
		return;

		m.headers = {};

		for(var i = 1; i < data.length; ++i) {
			var r = data[i].match(/^([\S]*?)\s*:\s*([\s\S]*)$/);
			if(!r) {
				return;
			}

			var name = unescape(r[1]).toLowerCase();
			name = compactForm[name] || name;

			m.headers[name] = (parsers[name] || parseGenericHeader)({s:r[2], i:0}, m.headers[name]);
		}

		return m;


	if(lines) {
		var m = parse(r[1]);

		if(m) {
			if(m.headers['content-length']) {
				var c = Math.max(0, Math.min(m.headers['content-length'], r[2].length));
				m.content = r[2].substring(0, c);
			}
			else {
				m.content = r[2];
			}

			return m;
		}
	}
}

module.exports = parse;
