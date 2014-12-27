var sip = require('../lib/sip');
var app = sip();

var db = {};

app.register(function (req, res) {

    // get requesting username
    var username = req.auth.username;

    // get password from database for username
    var password = 'password';

    // validate password
    var valid = req.auth.validate({
        password: 'password'
    });

    if (valid) {
        db[req.user.address] = {
            domain: req.register.domain,
            address: req.user.address,
            contact: req.user.contact
        };

        res.status(200).send();
    } else {
        res.status(401).send();
    }
});

app.listen();
