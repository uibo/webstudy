var users = [{name : 'hanchi', age:20}, {name:'duchi', age:21}];

var oper = function(a,b) {
    return a + b ;
}

users.push(oper);
console.dir(users);

console.log('세번째 요소 함수실행 : ' + users[2](20,20));