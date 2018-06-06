var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var expressSession = require('express-session');

var expressErrorHandler = require('express-error-handler');


var MongoClient = require('mongodb').MongoClient;

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10, 
    host:'localhost',
    user:'root',
    password:'admin',
    database:'test',
    debug:false
});


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
	console.log('/process/login 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
	
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
	
	if (pool) {
		authUser(paramId, paramPassword, function(err, rows) {

			if (err) {
                console.error('사용자 로그인 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 로그인 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
			if (rows) {
				console.dir(rows);

				var username = rows[0].name;
				
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인 성공</h1>');
				res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
				res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
				res.write("<br><br><a href='/public/login2.html'>다시 로그인하기</a>");
				res.end();
			
			} else { 
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인  실패</h1>');
				res.end();
			}
		});

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
                res.write('<h1>사용자 데이터조회안됨.</h1>');
                res.end();
            }
        })
    } else {
        console.log('에러발생.');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터 베이스 연결안됨.</h1>');
        res.end();
    }
});

app.use('/', router);


var addUser = function(id, name, age, password, callback) {
	console.log('addUser 호출됨.')
	
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release(); 
            }
            
            callback(err, null);
            return;
        }   
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

    	var data = {id:id, name:name, age:age, password:password};
    	
        var exec = conn.query('insert into users set ?', data, function(err, result) {
        	conn.release(); 
        	console.log('실행된 SQL : ' + exec.sql);
        	
        	if (err) {
        		console.log('SQL 실행에러 발생함.');
        		callback(err, null);
        		return;
        	}
        	
        	callback(null, result);
        	
        });
        
        conn.on('error', function(err) {      
              console.log('데이터베이스 연결 시 에러 발생함.');
              console.dir(err);
              
              callback(err, null);
        });
    });
	
}

var authUser = function(db, id, password, callback ) {
    console.log('authUser 호출됨.' + id +',' + password);
    
    var users = db.collection('users');
    
    users.find({"id":id, "password":password}).toArray(function(err, docs) {
        if (err) {
            callback(err, null);
            return;
        }
        
        if (docs.length > 0) {
            console.log('일치하는 사용자 찾음.');
            callback(null, docs);
        } else {
            console.log('일치하는사용자찾지못함.');
            callback(null, null);
        }
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