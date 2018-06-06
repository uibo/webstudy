var users = [{name : 'hanchi', age : 20}, {name:'duchi', age:21},{name : 'sechi', age : 22}];

delete users[1];

console.dir(users);

users.forEach(function(item,index){
    console.log('원소 #' +index);
    console.dir(item);
});

users.splice(1,0,{name:'bbuggu', age : 24});
console.dir(users);

users.splice(2,1);
console.dir(users);