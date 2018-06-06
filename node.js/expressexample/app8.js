var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');



var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


var router = express.Router();


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

app.all('*', function(req, res) {
    res.status(404).send('<h1>요청하신페이지는없슴다.</h1>');
});

app.use('/', router);


app.use(function(req, res, next) {
    console.log('첫번째 미들웨어 호출됨.');
    
    var userAgent = req.header('User-Agent');
    var paramid = req.body.id || req.query.id;
    
    res.send('<h3>서버에서 응답 useragent - > </h3>' + userAgent + 'Param id-> :' + paramid);
});



var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('익스프레스로 웹서버를 실행함 : ' + app.get('port'));
});
