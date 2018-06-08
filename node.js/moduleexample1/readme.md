moduleexample
====================================

익스프레스로 웹 서버를 만들고 사용자 정보를 데이터베이스에 저장하는 방법에 대해 알아보았습니다. 코드양이 많아지며 코드를 해석하는것이 부담되기 시작하여서 각각의 기능을 부븐을 잘라내어 별도의 파일로 분리해서 해결 할수 있습니다. 또한 사용자가 볼 웹 페이지를 뷰템플릿으로 분리해서 만들수 있습니다. 이 폴더에서는 app.js 파일에 코드를 모듈파일로 분리하는것과 자주 수정하지않도록 설정파일을 만들어 사용하는 법을 알아보았습니다

-----------------------
user.js 파일로 만든 모듈을 사용하기 위해 require() 메소드를 호출합니다. require() 메소드로 불러들인 모듈은 user1 변수에 할당됩니다. require() 메소드는 exports 객체와 같다고 볼 수 있으므로 user1변수에 들어있는 getUser()함수를 호출할 수 있습니다.

![image2](http://drive.google.com/uc?export=view&id=1E7tSqwsMilGs4uWRF21KYZk2VbdXOc6F "image2")


메인 파일에서는 데이터베이스 객체를 사용할 수 있는 시점이 되면 app 객체의 set()메소드를 호출하여 데이터베이스 객체를 database속성으로 추가합니다. 이렇게 모듈파일인 user.js안에 정의한 login 함수를 호출할때 파라미터로 전달되는 요청 객체에있는 app 객체의 get()메소드로 데이터베이스 객체를 꺼내어 사용할 수 있습니다.
![image1](http://drive.google.com/uc?export=view&id=125VFUnF1793BLVf0hJ7GVqcRA7tcnLWS "image1")
