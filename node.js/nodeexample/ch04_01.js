var url = require('url');

var urlstr = 'https://www.youtube.com/watch?v=RtOSw8TLCtQ&index=14&list=PLG7te9eYUi7tHH-hJ2yzBJ9h6dwBu1FUy';

var curUrl = url.parse(urlstr);

console.dir(curUrl);

console.log('query - >' + curUrl.query);

var curstr = url.format(curUrl);
console.log('url->' + curstr);



var querystring =  require('querystring');
var params = querystring.parse(curUrl.v);

console.log('검색어 : ' + params.query);