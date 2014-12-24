var _ = require('lodash'),
    net = require('net'),
    Runtime = require('./runtime')(__filename),
    Message = require('./message');

function Sip(options) {

    var _self = this;

    _self.options = _.merge(options || {}, {
        address: '0.0.0.0',
        port: 5060
    });

    _self.handleMessage = function (message) {

        Runtime.log('handleMessage');
        if (message.isRequest) {

            if (message.method === 'REGISTER') {
                _self.registerCallback(message);
            } else if (message.method === 'INVITE') {
                _self.inviteCallback(message);
            }
        }
    };

    _self.onTcpServerConnection = function (socket) {

        socket.on('data', function (data) {

            Runtime.log('tcp data from', socket.remoteAddress, socket.remotePort);
            var sdata = data.toString('ascii');
            var message = new Message(sdata);
            message.isTcp = true;
            message.socket = socket;
            _self.handleMessage(message);
        });

        socket.on('end', function () {

            Runtime.log('tcp socket closed');
        });
    };

    _self.listen = function () {

        _self.tcpServer = net.createServer(_self.onTcpServerConnection);
        _self.tcpServer.listen(_self.options.port, _self.options.address);
        Runtime.log('tcp server listening on', _self.options.address, _self.options.port);
    };

    _self.register = function (registerCallback) {
        _self.registerCallback = registerCallback;
    };

    _self.invite = function (inviteCallback) {
        _self.inviteCallback = inviteCallback;
    };

    return _self;
}

module.exports = function (options) {

    return new Sip(options);
};
