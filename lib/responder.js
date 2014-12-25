var _ = require('lodash'),
    net = require('net'),
    Runtime = require('./runtime')(__filename);

function send(message, response) {
    Runtime.log('send');
    
    if (message.isTcp) {
        if (message.socket.connected) {
            message.socket.send(new Buffer(response, 'ascii'));
        }
        // TODO: if user not connected, then what?
    }
    
    // TODO: add udp support
    
}

module.exports.send = send;