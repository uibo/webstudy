var explaincontent = {
  etext:function (value) {
    document.querySelector('#explain').style.visibility = value ;
  },
  ebutton:function (self) {
    self.style.visibility = 'visible' ;
  }
}

var Links = {
  lopacity:function (value){
    var i = 0;
    var alist = document.querySelectorAll('a');
    while(i < alist.length){
      alist[i].style.opacity = value;
      i = i + 1;
    }
  }
}

function hideshow(self) {
  if (self.value === 'hide')  {
    //Links.textopacity('0.1') ;
    explaincontent.etext('hidden') ;
    explaincontent.ebutton(self) ;
    self.value = 'show' ;
    Links.lopacity('0.1')
  }
  else {
    //Links.textopacity('1') ;
    explaincontent.etext('visible') ;
    explaincontent.ebutton(self) ;
    self.value='hide' ;
    Links.lopacity('1')
  }
}
