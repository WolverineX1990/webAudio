var http = require('http');
var fs = require('fs');
var server = http.createServer(function(req, res) {
    //将index.html输出
    var url = req.url;
    if(!fs.existsSync(__dirname  + url)) {
    	res.end('');
    	return;
    }
    if(url.endsWith('/')) {
    	url = '/index.html';
    }
    // console.log(url);
    res.end(fs.readFileSync(__dirname + url));
}).listen(3000, function() {
    console.log('Listening at: http://127.0.0.1:3000');
});