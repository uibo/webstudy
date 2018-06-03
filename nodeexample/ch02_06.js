var nconf = require('nconf');
var value = nconf.get('OS');
nconf.env();
console.log('OS 환경변수 값 : ' + value);