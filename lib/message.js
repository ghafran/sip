var rawbody = require('raw-body');

function parse(message) {

	var parsed = {};

	if(!message || typeof message !== 'string'){
		return parsed;
	}

	var lines = message.split('\n');

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
