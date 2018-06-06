var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var expressSession = require('express-session');

var multer = require('multer');
var fs = require('fs');

var cors = require('cors');


var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:"my key",
    resave:true,
    saveUninitialized:true
}));

app.use(cors());

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads');
        
    },
    filename:function(req, file, callback) {
        //callback(null, file.originalname + Date.now());
        
        var extension = path.extname(file.originalname);
        var basename = path.basename(file.originalname, extension);
        callback(null, basename + Date.now() + extension);
    }
});

var upload = multer({
    storage:storage,
    limits:{
        files:10,
        fileSize:1024*1024*1024
    }
});


var router = express.Router();

router.route('/process/photo').post(upload.array('photo', 1), function(req, res) {
    console.log('/process/photo 라우팅 함수 호출됨.');
    
    var files = req.files;
    console.log('===== 업로드된 파일====');
    if (files.length > 0) {
        console.dir(files[0]);
    } else {
        console.log('파일 없다');
    }
    
    var originalnamel;
    var filename;
    var mimetype;
    var size;
    
    if (Array.isArray(files)) {
        for(var i = 0; i < files.length; i ++){
            originalname = files.originalname;
            filename = files[i].filename;
            mimetype = files[i].mimetype;
            size = files[i].size;
        }
    }
    
    

    
    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
    res.write("<h1>파일업로드성공</h1>");
    res.write("<p>원본파일 : " + originalname + "</p>");
    res.write("<p>저장파일 : " + filename + "</p>");
    res.end();
    
    
});

router.route('/process/product').get(function(req, res) {
    console.log('/process/product 라우팅 함수 호출됨.');
    
    if (req.session.user) {
        res.redirect('/public/product.html');
    } else {
        res.redirect('/public/login2.html');
    }
})

router.route('/process/login').post(function(req, res) {
    console.log('/process/login 라우팅 함수 호출됨.');
    
    var paramid = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 :' + paramid + ',' + paramPassword);
    
    if (req.session.user) {
        console.log('이미 로그인');
        
        res.redirect('/public/product.html');
    } else {
        req.session.user = {
            id:paramid,
            name:'hanchi',
            authorized:true
        };
        
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>로그인성공</h1');
        res.write('<p>id : ' + paramid + '</p>');
        res.write('<br><br><a href="/public/product.html">상품페이지로이동</a>');
        res.end();
    }
});

router.route('/process/logout').get(function(req, res) {
    console.log('/product/logout 라우팅함수 호출됨.');
     
    if(req.session.user) {
        console.log('로그아웃함다.');
        
        req.session.destroy(function(err) {
            if (err){
                console.log('세션삭제시에러발생');
                return;
            }
            console.log('세션삭제성공.');
            res.redirect('/public/login2.html');
        });
    } else {;
        console.log('로그인되어있지않음.');
        res.redirect('/public/login2.html');
    }
    
})


router.route('/process/setUserCookie').get(function(req, res) {
    console.log('/process/setUserCookie 라우팅 함수 호출됨.');
    
    res.cookie('user', {
        id:'mike',
        name:'hanchi',
        authorized:true
    });
    
    res.redirect('/process/showCookie');
});

router.route('/process/showCookie').get(function(req, res) {
    console.log('/process/showCookie 라우티 ㅇ함수 호출됨.');
    
    res.send(req.cookies);
});


router.route('/process/login').post(function(req,res) {
    console.log('/process/login 라우팅 함수에서 받음.');
    
    var paramid = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
    res.write("<h1>서버에서 로그인 응답</h1>")
    res.write("<div><p>" + paramid + "</p></div>");
    res.write("<div><p>" + paramPassword + "</p></div>");
    res.end();
    
    
});


app.use('/', router);

app.all('*', function(req, res) {
    res.status(404).send('<h1>요청하신페이지는없슴다.</h1>');
});

app.use(function(req, res, next) {
    console.log('첫번째 미들웨어 호출됨.');
    
    var userAgent = req.header('User-Agent');
    var paramid = req.body.id || req.query.id;
    
    res.send('<h3>서버에서 응답 useragent - > </h3>' + userAgent + 'Param id-> :' + paramid);
});



var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('익스프레스로 웹서버를 실행함 : ' + app.get('port'));
});