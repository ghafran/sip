var _ = require('lodash'),
    net = require('net'),
    Message = require('./message');

function Sip(options) {

    var _self = this;

    _self.options = _.merge(options || {}, {
        address: '0.0.0.0',
        port: 5060
    });

    _self.handleMessage = function (message) {

        console.log(message.isRequest);
        if (message.isRequest) {
            if (message.method === 'REGISTER') {
                _self.registerCallback(message);
            }
        }
    };

    _self.onTcpServerConnection = function (socket) {

        socket.on('data', function (data) {

            var sdata = data.toString('ascii');
            var message = new Message(sdata);
            message.isTcp = true;
            message.socket = socket;
            _self.handleMessage(message);
        });

        socket.on('end', function () {

        });
    };

    _self.listen = function () {

        _self.tcpServer = net.createServer(_self.onTcpServerConnection);
        _self.tcpServer.listen(_self.options.port, _self.options.address);
    };

    _self.register = function (registerCallback) {
        _self.registerCallback = registerCallback;
    };

    return _self;
}

module.exports = function (options) {

    return new Sip(options);
};
