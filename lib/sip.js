var _ = require('lodash'),
    net = require('net'),
    Runtime = require('./runtime')(__filename),
    Message = require('./message'),
    RegisterRequest = require('./requests/register'),
    RegisterResponse = require('./responses/register');

function Sip(config) {

    var _self = this;

    _self.config = _.merge(config || {}, {
        address: '0.0.0.0',
        port: 5060
    });

    _self.handleMessage = function (message) {

        Runtime.log('handleMessage');
        if (message.type() === 'request') {

            if (message.request().method() === 'REGISTER') {

                var registerRequest = new RegisterRequest(message);
                var registerResponse = new RegisterResponse(message);
                _self.registerCallback(registerRequest, registerResponse);
            } else if (message.request().method() === 'INVITE') {
                _self.inviteCallback(message);
            }
        }
    };

    _self.onTcpServerConnection = function (socket) {

        socket.connected = true;
        socket.on('data', function (data) {

            Runtime.log('tcp data from', socket.remoteAddress, socket.remotePort);
            var sdata = data.toString('ascii');
            var message = new Message(sdata);
            message.isTcp = true;
            message.socket = socket;
            _self.handleMessage(message);
        });

        socket.on('end', function () {

            socket.connected = false;
            Runtime.log('tcp socket closed');
        });
    };

    _self.listen = function () {
        _self.tcpServer = net.createServer(_self.onTcpServerConnection);
        _self.tcpServer.listen(_self.config.port, _self.config.address);
        Runtime.log('tcp server listening on', _self.config.address, _self.config.port);
    };

    _self.register = function (registerCallback) {
        _self.registerCallback = registerCallback;
    };

    _self.invite = function (inviteCallback) {
        _self.inviteCallback = inviteCallback;
    };

    _self.ack = function (ackCallback) {
        _self.ackCallback = ackCallback;
    };

    _self.cancel = function (cancelCallback) {
        _self.cancelCallback = cancelCallback;
    };

    _self.options = function (optionsCallback) {
        _self.optionsCallback = optionsCallback;
    };

    _self.invite = function (byeCallback) {
        _self.byeCallback = byeCallback;
    };

    return _self;
}

module.exports = function (config) {

    return new Sip(config);
};
