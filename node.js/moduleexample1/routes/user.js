var login = function(req, res) {
    console.log('/process/login 라우팅함수 호출됨.');
    
    var paramid= req.body.id || req.query.id ;
    var parampassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramid + ',' + parampassword);
    
    
    var database = req.app.get('database');
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
};

var adduser = function(req, res) {
    console.log('/process/adduser 라우팅 함수 호출됨.');
    
    var paramid= req.body.id || req.query.id ;
    var parampassword = req.body.password || req.query.password;
    var paramname = req.body.name
    || req.query.name
    
    console.log('요청 파라미터 : ' + paramid + ',' + parampassword +',' +paramname);
    
    var database = req.app.get('database');
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
}



var listuser = function(req, res) {
	console.log('/process/listuser 호출됨.');

    
    var database = req.app.get('database');
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
};


var authUser = function(db, id, password, callback ) {
    console.log('authUser 호출됨.' + id +',' + password);
    
    db.UserModel.findById(id, function(err, results) {
		if (err) {
			callback(err, null);
			return;
		}
		
		console.log('아이디 %s로 검색됨.', id);
		if (results.length > 0) {
            var user = new UserModel({id:id});
			var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
            
			if (authenticated) { 
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
    
    var user = new db.UserModel({"id":id, "password":password, "name":name});

	user.save(function(err) {
		if (err) {
			callback(err, null);
			return;
		}
		
	    console.log("사용자 데이터 추가.");
	    callback(null, user);
	     
	});
};



module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;
