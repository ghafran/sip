/*
Request-Line  =  Method SP Request-URI SP SIP-Version CRLF

Method: This specification defines six methods: REGISTER for
registering contact information, INVITE, ACK, and CANCEL for
setting up sessions, BYE for terminating sessions, and
OPTIONS for querying servers about their capabilities.  SIP
extensions, documented in standards track RFCs, may define
additional methods.

Request-URI: The Request-URI is a SIP or SIPS URI as described in
Section 19.1 or a general URI (RFC 2396 [5]).  It indicates
the user or service to which this request is being addressed.
The Request-URI MUST NOT contain unescaped spaces or control
characters and MUST NOT be enclosed in "<>".

SIP elements MAY support Request-URIs with schemes other than
"sip" and "sips", for example the "tel" URI scheme of RFC
2806 [9].  SIP elements MAY translate non-SIP URIs using any
mechanism at their disposal, resulting in SIP URI, SIPS URI,
or some other scheme.

SIP-Version: Both request and response messages include the
version of SIP in use, and follow [H3.1] (with HTTP replaced
by SIP, and HTTP/1.1 replaced by SIP/2.0) regarding version
ordering, compliance requirements, and upgrading of version
numbers.  To be compliant with this specification,
applications sending SIP messages MUST include a SIP-Version
of "SIP/2.0".  The SIP-Version string is case-insensitive,
but implementations MUST send upper-case.

Status-Line  =  SIP-Version SP Status-Code SP Reason-Phrase CRLF

The Status-Code is a 3-digit integer result code that indicates the
outcome of an attempt to understand and satisfy a request.  The
Reason-Phrase is intended to give a short textual description of the
Status-Code.  The Status-Code is intended for use by automata,
whereas the Reason-Phrase is intended for the human user.  A client
is not required to examine or display the Reason-Phrase.
*/
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

        _self.startLine = _self.raw.split('\n')[0];
        _self.isRequest = Util.isRequestLine(_self.startLine);
        _self.isStatus = Util.isStatusLine(_self.startLine);

        if (_self.isRequest) {

            _self.request = Util.parseRequestLine(_self.startLine);
        } else if (_self.isStatus) {

            _self.status = Util.parseStatusLine(_self.startLine);
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
