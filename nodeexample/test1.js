console.log('be like tom 소여.');

console.log('숫자입니다. %d', 150, 10 );
console.log('문자열입니다. %s', '안녕');

var person = {
    name :'인간',
    age : 20
    
}


console.log('자스객체입니다. %j', person);


console.dir(person);

console.time('duration_time');

var result = 0;
var i = 0;
for (var i = 0; i < 10000; i++){
    result += 1;   
}

console.timeEnd('duration_time');

console.log('파일이름 : %s', __filename);
console.log('패스 : %s', __dirname);