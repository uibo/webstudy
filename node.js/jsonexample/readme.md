Jsonexample
=======================
이전까지 웹 서버와 채팅서버를 만들었습니다. 서버와 클라이언트 사이에서 데이터를 주고받는 과정이 조금 복잡하게 느껴졌습니다. 이렇게 복잡해진 코드를 간단하게 보이게하고 각 기능도 분리해서 만들 수 있다고 합니다. 그래서 JSON-RPC 모듈을 사용해서 서버를 간편하게 만들어 보았습니다.

-----------------
RPC는 서버에 데이터를 요청하여 응답받는 과정을 라이브러리에서 자동으로 처리합니다. RPC는 여러 가지 방법으로 사용할 수 있는데, 그중에서 특히 JSON-RPC는 JSON포맷으로 데이터를 주고 받을 수 있어서 자바스크립트를 사용하는 노드에서 자연스럽게 사용할 수있습니다.

![image1](http://drive.google.com/uc?export=view&id=1H_JeIu8IEoHgquYhY8-YqzfrEUUQYL2d "image1")

database 객체는 서버가 실행될 때 global 전역 변수에 속성으로 추가되었으므로 global.database 코드를 사용해 참조할 수 있습니다. database 객체에는 사용자 정보를 담고 있는 모델 객체가 UserModer 속성으로 추가되어 있습니다. 따라서 모델 객체의 findALL()메소드를 호출하여 사용자를 조회합니다 조회과정에 오류가 없다면 사용자 ID와 name을 속성으로 가지는 객체를 만들어 배열에 추가한 후 배열객체를 응답으로 보냅니다.

![image2](http://drive.google.com/uc?export=view&id=1pt2n0QvdlzmC2svqJ-V3Z984SAFVYkyi "image2")
