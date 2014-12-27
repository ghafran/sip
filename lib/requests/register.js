/*
The following header fields, except Contact, MUST be included in a
REGISTER request.  A Contact header field MAY be included:

Request-URI: The Request-URI names the domain of the location
service for which the registration is meant (for example,
"sip:chicago.com").  The "userinfo" and "@" components of the
SIP URI MUST NOT be present.

To: The To header field contains the address of record whose
registration is to be created, queried, or modified.  The To
header field and the Request-URI field typically differ, as
the former contains a user name.  This address-of-record MUST
be a SIP URI or SIPS URI.

From: The From header field contains the address-of-record of the
person responsible for the registration.  The value is the
same as the To header field unless the request is a third-
party registration.

Call-ID: All registrations from a UAC SHOULD use the same Call-ID
header field value for registrations sent to a particular
registrar.

If the same client were to use different Call-ID values, a
registrar could not detect whether a delayed REGISTER request
might have arrived out of order.

CSeq: The CSeq value guarantees proper ordering of REGISTER
requests.  A UA MUST increment the CSeq value by one for each
REGISTER request with the same Call-ID.

Contact: REGISTER requests MAY contain a Contact header field with
zero or more values containing address bindings.
*/

var _ = require('lodash'),
    Util = require('../util');

function RegisterRequest(message) {

    var Runtime = require('../runtime')(__filename);
    var _self = this;
    _self.message = message;

    _self.create = function () {

        _self.register = {
            domain: _self.message.request().uri().host(),
            from: _self.message.header('from').aof().address(),
            callid: _self.message.header('callid').value(),
            cseq: _self.message.header('cseq').value()
        };

        _self.user = {
            address: _self.message.header('to').aof().address(),
            contact: _self.message.header('contact').value(),
        };

        _self.auth = {};
        
        if (_self.message.header('authorization').exist()) {
            _self.auth.username = _self.message.header('authorization').auth().params().username;
            _self.auth.realm = _self.message.header('authorization').auth().params().realm;
            _self.auth.params = _self.message.header('authorization').auth().params();
        }

    };

    if (_self.message) {
        _self.create();
    }

    return _self;
}

module.exports = function (message) {

    return new RegisterRequest(message);
};
