var person={};

person.name = 'girlsgeneration';
person['age'] = 20;

person.add = function(a,b) {
    return a + b;
}

console.log('plus : ' + person.add(20,20));
console.log(person);