function add(a,b, callback) {
    var result = a + b ;
    callback(result);
};

add(10,10, function(result) {
    console.log('in callback answer : ' + result);
    
});