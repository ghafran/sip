var _ = require('lodash'),
    net = require('net'),
    dgram = require('dgram'),
    Runtime = require('./runtime')(__filename),
    Util = require('./util');

function send(message, response) {
    Runtime.log('send');

    var via = message.header('via').via();

    // respond using tcp?
    if (via.protocol().toLowerCase() === 'tcp') {

        Runtime.log('send via tcp');

        // was request sent through tcp?
        if (message.isTcp) {

            Runtime.log('request was via tcp');

            // is request using same socket as via response
            if (message.socket.remoteAddress === via.host() && message.socket.remotePort === via.port()) {

                Runtime.log('request using same socket as via response');

                // request socket still connected?
                if (message.socket.connected) {

                    // send using same socket as request
                    message.socket.write(response, 'ascii');
                    Runtime.log('socket write', response);
                } else {

                    Runtime.log('request tcp socket no longer connected');
                    // TODO: user not connected. Connect and send response.
                }
            } else {

                Runtime.log('request not using same socket as via response', message.socket.remoteAddress, message.socket.remotePort, via.host(), via.port());
                // TODO: user not connected. Connect and send response.
            }
        } else {
            // TODO: send response via non tcp
        }
    } else if (via.protocol().toLowerCase() === 'udp') {

        Runtime.log('send via udp');

        var udpData = new Buffer(response);
        var client = dgram.createSocket(net.isIPv6(via.host()) ? 'udp6' : 'udp4');
        client.send(udpData, 0, udpData.length, via.port(), via.host(), function (err, bytes) {
            if (err) {
                Runtime.log('error sending udp packet', err);
            } else {
                Runtime.log('udp packent sent', via.host(), via.port(), response);
                client.close();
            }
        });
    }
}

module.exports.send = send;
