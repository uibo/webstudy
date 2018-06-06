console.log('argv 속성의 파라미터 수 : ' + process.argv.length);

console.dir(process.argv);

process.argv.forEach(function(item, index) {
    console.log(index + ' : ' + item);
});



var calc = require('./calc');
console.log("모듈로 분리 exports : " + calc.add(21,23));



var calc2 = require('./calc2');
console.log("모듈로 분리 module.exports : "+calc2.add(10,20));