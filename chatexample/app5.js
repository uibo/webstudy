var express = require('express')
  , http = require('http')
  , path = require('path');

var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

var expressErrorHandler = require('express-error-handler');

var expressSession = require('express-session');
  

var passport = require('passport');
var flash = require('connect-flash');


var config = require('./config/config');

var database = require('./database/database');

var route_loader = require('./routes/route_loader');

 

var socketio = require('socket.io');

var cors = require('cors');



var app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');


console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);
 

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use('/public', static(path.join(__dirname, 'public')));
 
app.use(cookieParser());

app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
 

app.use(cors());



var router = express.Router();
route_loader.init(app, router);


var configPassport = require('./config/passport');
configPassport(app, passport);

var userPassport = require('./routes/user_passport');
userPassport(router, passport);



var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생함 : ' + err);
	console.log('서버 프로세스 종료하지 않고 유지함.');
	
	console.log(err.stack);
});

process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database.db) {
		database.db.close();
	}
});

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

	database.init(app, config);
   
});


var io = socketio.listen(server);
console.log('socket.io 요청을 받아들일 준비가 되었습니다.');


var login_ids = {};

io.sockets.on('connection', function(socket) {
	console.log('connection info -> ' + JSON.stringify(socket.request.connection._peername));

	
	socket.remoteAddress = socket.request.connection._peername.address;
	socket.remotePort = socket.request.connection._peername.port;
    
    
    socket.on('login', function(input) {
        console.log('login 받음 -> ' + JSON.stringify(input));
        
        login_ids[input.id] = socket.id;
        socket.login_id = input.id;
        
        sendResponse(socket, 'login', 200, 'OK');
    });
    
    socket.on('message', function(message) {
        console.log('message 받음 -> ' + JSON.stringify(message));
        
        if (message.recepient == 'ALL') {
            console.log('모든 클라이언트에게 메시지 전송함.');
            
            io.sockets.emit('message', message);
        } else {
        	
        	if (message.command == 'chat') {
	        	
	        	if (login_ids[message.recepient]) {
	        		io.sockets.connected[login_ids[message.recepient]].emit('message', message);
	        		
	        		
	                sendResponse(socket, 'message', 200, '메시지를 전송했습니다.');
	        	} else {
	        		
	                sendResponse(socket, 'login', 404, '상대방의 로그인 ID를 찾을 수 없습니다.');
	        	}
        	} else if (message.command == 'groupchat') {
	        	
	        	io.sockets.in(message.recepient).emit('message', message);
	        		
	        	
	            sendResponse(socket, 'message', 200, '방 [' + message.recepient + ']의 모든 사용자들에게 메시지를 전송했습니다.');
        	}
        	
        }
    });
    
    socket.on('room', function(room) {
    	console.log('room 이벤트를 받았습니다.');
    	console.dir(room);
    	
        if (room.command === 'create') {

        	if (io.sockets.adapter.rooms[room.roomId]) { 
        		console.log('방이 이미 만들어져 있습니다.');
        		
        	} else {
        		console.log('방을 새로 만듭니다.');
        		
        		socket.join(room.roomId);
        		
	            var curRoom = io.sockets.adapter.rooms[room.roomId];
	            curRoom.id = room.roomId;
	            curRoom.name = room.roomName;
	            curRoom.owner = room.roomOwner;
        	}

        } else if (room.command === 'update') {
        	
            var curRoom = io.sockets.adapter.rooms[room.roomId];
            curRoom.id = room.roomId;
            curRoom.name = room.roomName;
            curRoom.owner = room.roomOwner;
             
        } else if (room.command === 'delete') {

            socket.leave(room.roomId);
 
            if (io.sockets.adapter.rooms[room.roomId]) { 
            	delete io.sockets.adapter.rooms[room.roomId];
            } else {  
            	console.log('방이 만들어져 있지 않습니다.');
            	
            }
        } else if (room.command === 'join') { 

            socket.join(room.roomId);
         
            
            sendResponse(socket, 'room', '200', '방에 입장했습니다.');
        } else if (room.command === 'leave') {  

            socket.leave(room.roomId);
         
            
            sendResponse(socket, 'room', '200', '방에서 나갔습니다.');
        }

        var roomList = getRoomList();
        
        var output = {command:'list', rooms:roomList};
        console.log('클라이언트로 보낼 데이터 : ' + JSON.stringify(output));
        
        io.sockets.emit('room', output);
    });
       
});

function getRoomList() {
	console.dir(io.sockets.adapter.rooms);
	
    var roomList = [];
    
    Object.keys(io.sockets.adapter.rooms).forEach(function(roomId) { 
    	console.log('current room id : ' + roomId);
    	var outRoom = io.sockets.adapter.rooms[roomId];
    	
    	
    	var foundDefault = false;
    	var index = 0;
        Object.keys(outRoom.sockets).forEach(function(key) {
        	console.log('#' + index + ' : ' + key + ', ' + outRoom.sockets[key]);
        	
        	if (roomId == key) {  
        		foundDefault = true;
        		console.log('this is default room.');
        	}
        	index++;
        });
        
        if (!foundDefault) {
        	roomList.push(outRoom);
        }
    });
    
    console.log('[ROOM LIST]');
    console.dir(roomList);
    
    return roomList;
}



function sendResponse(socket, command, code, message) {
    var output = {
        command: command,
        code: code,
        message: message
    };
    
    socket.emit('response', output);
}