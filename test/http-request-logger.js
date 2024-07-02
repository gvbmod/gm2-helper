var http = require("http");

http.createServer((req,res) => {
	console.log(`HTTP ${req.method} ${req.url}`);
	res.end("");
}).listen(8060);