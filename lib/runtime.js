var debug = require('debug');

function Runtime(path) {

    if (path === null || path === undefined) {
        path = 'apgar:unknown';
    } else {
        // format file path into a debug format
        path = path.replace(/\/srv\//g, '');
        path = path.replace(/\//g, ':');
        path = path.replace(/.js/g, '');
    }

    var _self = this;
    _self.path = path;
    _self.debug = debug(_self.path);

    _self.log = function () {
        _self.debug.apply(null, arguments);
    };

    _self.logf = function (fname, args) {

        if(typeof fname === 'string'){
            _self.debug(fname, args);
        } else {
            args = fname;
            _self.debug(args.callee.name, args);
        }
    };

    return _self;
}

module.exports = Runtime;
