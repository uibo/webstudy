var mongoose = require('mongoose');


var database;
var UserSchema;
var UserModel;

function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';
    
    var databaseUrl = 'mongodb://localhost:27017/local';
    
    mongoose.Promise = global.Promise;
	mongoose.connect(databaseUrl);
	database = mongoose.connection;
	
	database.on('open', function () {
		console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
        
        createUserSchema();
        
        
		doTest();
        
    });
		
    
	database.on('disconnected', function() {
        console.log('데이터 베이스연결 끊어짐.');
    });
    database.on('error', console.error.bind(console.log( 'mongoose 연결에러.')));
}

function createUserSchema() {

	UserSchema = mongoose.Schema({
	    id: {type: String, required: true, unique: true},
	    name: {type: String, index: 'hashed', 'default':''},
	    age: {type: Number, 'default': -1},
	    created_at: {type: Date, index: {unique: false}, 'default': Date.now()},
	    updated_at: {type: Date, index: {unique: false}, 'default': Date.now()}
	});
    console.log('UserSchema 정의');
    
    UserSchema.virtual('info')
	  .set(function(info) {
	    var splitted = info.split(' ');
	    this.id = splitted[0];
	    this.name = splitted[1];
	    console.log('virtual info 설정함 : %s, %s', this.id, this.name);
	  })
	  .get(function() { return this.id + ' ' + this.name });
UserModel = mongoose.model("users4", UserSchema);
	console.log('UserModel 정의');
	
}

function doTest() {
    var user = new UserModel({"info":'hanchi'});
    user.save(function(err) {
		if (err) {
            console.log('에러발생');
            return;
        }
        
        console.log('데이터 추가.');
    })
}
    