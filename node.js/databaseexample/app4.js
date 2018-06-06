var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var expressSession = require('express-session');

var expressErrorHandler = require('express-error-handler');



var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;

function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';
    
    mongoose.Promise = global.Promise;
	mongoose.connect(databaseUrl);
	database = mongoose.connection;
    	
	database.on('open', function () {
		console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
		

		UserSchema = mongoose.Schema({
		    id: {type: String, required: true, unique: true},
		    password: {type: String, required: true},
		    name: {type: String, index: 'hashed'},
		    age: {type: Number, 'default': -1},
		    created_at: {type: Date, index: {unique: false}, 'default': Date.now},
		    updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
		});
		console.log('UserSchema 정의.');
        
        UserSchema.static('findById', function(id, callback) {
			return this.find({id:id}, callback);
		});
        
        UserSchema.static('findAll', function(callback) {
			return this.find({}, callback);
		});
        
		UserModel = mongoose.model("users2", UserSchema);
		console.log('UserModel 정의.');
	});
    
	database.on('disconnected', function() {
        console.log('데이터 베이스연결 끊어짐.');
    });
    database.on('error', console.error.bind(console, 'mongoose 연결에러.'));
}



var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:"my key",
    resave:true,
    saveUninitialized:true
}));





var router = express.Router();

router.route('/process/login').post(function(req, res) {
    console.log('/process/login 라우팅함수 호출됨.');
    
    var paramid= req.body.id || req.query.id ;
    var parampassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramid + ',' + parampassword);
    
    if(database) {
        authUser(database, paramid, parampassword, function(err, docs) {
            if (err) {
                console.log('에러발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러발생</h1>');
                res.end();
                return;
            }
            
            if (docs) {
                console.dir(docs);
                
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 로그인성공</h1>');
                res.write('<div><p>사용자 : ' + docs[0].name + '</p></div>');
                res.write('<br><br><a href="/public/login.html">다시 로그인</a>');
                res.end();
                      
            } else {
                console.log('에러발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 조회안됨.</h1>');
                res.end();
            }
        })
    } 
});

router.route('/process/adduser').post(function(req, res) {
    console.log('/process/adduser 라우팅 함수 호출됨.');
    
    var paramid= req.body.id || req.query.id ;
    var parampassword = req.body.password || req.query.password;
    var paramname = req.body.name
    || req.query.name
    
    console.log('요청 파라미터 : ' + paramid + ',' + parampassword +',' +paramname);
    
    if (database) {
        addUser(database, paramid, parampassword, paramname, function(err, result) {
            if(err) {
                console.log('에러발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러발생</h1>');
                res.end();
                return;
            }
            if(result) {
                console.dir(result);
                
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가성공</h1>');
                res.write('<div><p>사용자 : ' + paramname + '</p></div>');
                res.end();
            } else {
                console.log('에러발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>.</h1>');
                res.end();
            }
        });
    } else {
        console.log('에러발생.');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터 베이스 연결안됨.</h1>');
        res.end();
    }
});


router.route('/process/listuser').post(function(req, res) {
	console.log('/process/listuser 호출됨.');

    
	if (database) {
		
		UserModel.findAll(function(err, results) {
			
			if (err) {
                console.log('에러 발생');
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>에러 발생</12>');
				res.end();
                
                return;
            }
			  
			if (results) {  
				console.dir(results);
 
				res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
				res.write('<h3>사용자 리스트</h3>');
				res.write('<div><ul>');
				
				for (var i = 0; i < results.length; i++) {
					var curId = results[i]._doc.id;
					var curName = results[i]._doc.name;
					res.write('    <li>#' + i + ' : ' + curId + ', ' + curName + '</li>');
				}	
			
				res.write('</ul></div>');
				res.end();
			} else {  
				res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>조회된 사용자 없음</h1>');
				res.end();
			}
		});
    } else { 
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
});

                                       
                                       
app.use('/', router);

var authUser = function(db, id, password, callback ) {
    console.log('authUser 호출됨.' + id +',' + password);
    
    UserModel.findById(id, function(err, results) {
		if (err) {
			callback(err, null);
			return;
		}
		
		console.log('아이디 %s 검색', id);
		if (results.length > 0) {
			if (results[0]._doc.password === password) {
				console.log('비밀번호 일치');
				callback(null, results);
			} else {
				console.log('비밀번호 일치하지 않음');
				callback(null, null);
			}
		} else {
	    	console.log("아이디와 일치하는 없음.");
	    	callback(null, null);
	    }
		
	});
};

var addUser = function(db, id ,password, name, callback) {
    console.log('addUser 호출됨 : ' + id + ',' + password +',' +name);
    
    var user = new UserModel({"id":id, "password":password, "name":name});

	user.save(function(err) {
		if (err) {
			callback(err, null);
			return;
		}
		
	    console.log("사용자 데이터 추가.");
	    callback(null, User);
	     
	});
};



var errorHandler = expressErrorHandler ({
    static : {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('익스프레스로 웹서버를 실행함 : ' + app.get('port'));
    
    connectDB();
});