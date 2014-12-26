var net = require('net');

var client = new net.Socket();
client.connect(5060, '127.0.0.1', function() {
    console.log('Connected');
    client.write('REGISTER sip:127.0.0.1 SIP/2.0\r\n' +
    'Via: SIP/2.0/TCP ' + client.localAddress + ':' + client.localPort + ';alias;branch=z9hG4bK.Ytk88Sykk;rport\r\n' +
    'From: <sip:test@localhost>;tag=kFUkwBLr5\r\n' +
    'To: sip:test@localhost\r\n' +
    'CSeq: 20 REGISTER\r\n' +
    'Call-ID: rO40bEXUAf\r\n' +
    'Max-Forwards: 70\r\n' +
    'Supported: outbound\r\n' +
    'Contact: <sip:test@127.0.0.1:59322;transport=tcp>;+sip.instance="<urn:uuid:16f43843-39b6-4eb5-a9e8-6f398fe899ef>"\r\n' +
    'Expires: 600\r\n' +
    'User-Agent: (belle-sip/1.3.1)\r\n' +
    'Content-Length: 0\r\n');
});

client.on('data', function(data) {
    console.log('Received: ' + data);
    client.destroy(); // kill client after server's response
});

client.on('close', function() {
    console.log('Connection closed');
});
