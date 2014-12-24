var sip = require('../lib/sip');
var app = sip();

app.register(function(req){

    // console.log(req);
});

app.invite(function(req){

    // console.log(req);
});

app.listen();
