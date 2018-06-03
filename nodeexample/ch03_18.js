function person(name,age) {
    this.name = name;
    this.age = age;
}

person.prototype.walk = function(speed) {
    console.log(speed + 'km 속도로 걸어갑니다.');
    
};

var person3 = new person('hanchi',20);
var person4 = new person('duchi',21);

person3.walk(10);

console.log(person3);
console.log(new person('nechi',23));