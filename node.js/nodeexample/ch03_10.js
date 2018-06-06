var users = [{name : 'hanchi', age : 20},{name:'duchi',age:21}];


for (var i = 0; i < users.length; i++) {
    console.log('배열원소 #' + i + ' : ' + users[i].name);
}

users.forEach(function(item, index){
    console.log('배열 원소 #' + index + ' : ' +item.name);
});