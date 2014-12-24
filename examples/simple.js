var sip = require('../lib/sip');
var app = sip();

var db = {};

app.register(function (req, res) {

    db[req.user.address] = {
        address: req.user.address,
        domain: req.user.domain,
        contact: req.user.contact
    };

    res.send(200);
});

app.listen();
