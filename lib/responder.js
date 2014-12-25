var _ = require('lodash'),
    net = require('net'),
    Runtime = require('./runtime')(__filename),
    Util = require('./util');

function send(message, response) {
    Runtime.log('send');

    var via = message.header('via').via();

    // respond using tcp?
    if (via.protocol().toLower() === 'tcp') {

        // was request sent through tcp?
        if (message.isTcp) {

            // is request using same socket as via response
            if (message.socket.remoteAddress === via.host() && message.socket.remotePort === via.port()) {
                
                // request socket still connected?
                if (message.socket.connected) {
                    
                    // send using same socket as request
                    message.socket.send(new Buffer(response, 'ascii'));
                }
                else {
                    // TODO: user not connected. Connect and send response.
                }
            }
            else {
                // TODO: user not connected. Connect and send response.
            }
        }
        else {
            // TODO: send response via non tcp
        }
    } else if (via.protocol().toLower() === 'udp') {
        
        // TODO: send response via udp to via.host(), via.port()
    }
}

module.exports.send = send;