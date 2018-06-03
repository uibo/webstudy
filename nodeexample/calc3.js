var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Calc = function() {
    this.on('stop', function() {
        console.log('Calc에 stop 이벤트 전달됨.');
    });
};

util.inherits(Calc, EventEmitter);

Calc.prototype.add = function(a,b) {
    return a + b;
};

module.exports= Calc;