
function add(a,b, callback) {
    var result = a+b;
    callback(result);
    var history = function() {
        return a + '+' + b + '=' + result;
    };
    return history;
    
}


var add_history = add(20,20, function(result){
    console.log('plus answer : ' + result);
});

console.log('add_history의 자료형 : ' + typeof(add_history));

console.log('결과값 함수 실행 : ' + add_history());




