nodeexample
========================

노드로 프로그램을 만드는 것은 자바스크립트로 프로그램을 만드는것과 같다. 자바스크립트로 만든 파일은 노드실행파일을 사용해서 실행 할 수 있다. 노드프로젝트를 단계별로 살펴보고 노드의 기본 사용법을 확인한다

----------------------------------------

url 모듈에서 문자열을 객체로 만들거나 객체를 문자열로 만들기 위해사용하는 주요 메소드 
url 모듈을 사용하는 코드
parse 와 format 메소드를 호출후 문자열을 url 객체로 만들고 url 객체에 들어있는 속성을 출력한다
![image1](http://drive.google.com/uc?export=view&id=1zaYufOqQAWfeE2oMZBr2GV8e1Q2ReyQA "image1")


버퍼 객체를 사용하고 버퍼객체의 기능을 이용한다. 두개의 버퍼를 서로다른 방식으로 만들고 문자열을 파라미터로 전달하였다. 이 두개의 버퍼에대해 toString()메소드를 호출하여 결과 문자열을 확인하면 문자열이 똑같이 들어 있는 것을 알수있다.
![텍스트](http://drive.google.com/uc?export=view&id=1bBRC5tYdVRntJ-8N-dK2YgPD3Rw_0F4C "image2")

fs 모듈로 파일을 다루고 파일을 읽기위해 readfile()메소드를 사용하여 파일을 스트림 객체로 읽어온다. 클라이언트의 요청이 들어왔을때 파일을 읽고 응답하도록 만든다
![텍스트](http://drive.google.com/uc?export=view&id=1byjxuMivDI6eg5m8crRvSeYYeM-yb8zS "image3")
