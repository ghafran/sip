var sip = require('../lib/sip');
var app = sip();

var db = {};

app.register(function (req, res) {

    db[req.user.address] = {
        domain: req.register.domain,
        address: req.user.address,
        contact: req.user.contact
    };

    res.send(200);
});

app.listen();
