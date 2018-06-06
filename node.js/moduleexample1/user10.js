function User(id, name) {
	this.id = id;
	this.name = name;
}

User.prototype.getUser = function() {
	return {id:this.id, name:this.name};
}

User.prototype.group = {id:'group1',name:'friend'};

User.prototype.printUser = function() {
	console.log('user : ' + this.name + ', group : ' + this.group.name);
}

module.exports = User;