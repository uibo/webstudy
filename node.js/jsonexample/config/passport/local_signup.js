var LocalStrategy = require('passport-local').Strategy;


module.exports =  new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true    
	}, function(req, email, password, done) {
        
        var paramName = req.body.name || req.query.name;
		console.log('passport의 local-signup 호출됨 : ' + email + ', ' + password + ', ' + paramName);
		

        var database = app.get('database');
        database.UserModel.findOne({ 'email' :  email }, function(err, user) {
            
            if (err) {
                return done(err);
            }

            
            if (user) {
                console.log('기존에 계정이 있음.');
                return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));  
            } else {
                
                var user = new database.UserModel({'email':email, 'password':password, 'name':paramName});
                user.save(function(err) {
                    if (err) {
                        console.log('데이터 베이스저장시 에러.');
                        return done(null, false, req.flash('signupMessage', '사용자 정보 저장시 에러발생'));  
                    }

                    console.log("사용자 데이터 추가함.");
                    return done(null, user);  
                });
            }
        });    

})