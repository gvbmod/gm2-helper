var http = require("http");
var URL = require("url");

var debuggerMode = false; //Enable this for more advanced debugging.

function parseURL (url) {
	var parsed = URL.parse(url);
	return {
		host:parsed.hostname,
		path:parsed.path,
		port:parsed.port,
		protocol: 'http:'
	};
}

function HTTPGet(url) {
    return new Promise((resolve, reject) => {
        try {
			if (debuggerMode) {
				console.log("Preforming HTTP GET request on URL \""+url+"\"");
			}
			var timeout = null;
            var a = http.request({
                ...parseURL(url),
				method: "GET"
            }, (res) => {
                try {
                    var text = "";
                    res.on("data", (chunk) => {
                        text += chunk;
                    });
                    res.on("end", () => {
                        var replacementRES = {
                            data: text
                        };
						if (debuggerMode) {
							console.log("HTTP GET request finished. "+res.statusCode+" ");
						}
						clearTimeout(timeout);
                        resolve(replacementRES);
                    });
                } catch (e) {
                    if (debuggerMode) {
						console.log("Error on HTTP GET: ", e);
					}
                    reject(e);
                }
            });
            a.on("error", (e) => {
                if (debuggerMode) {
					console.log("Error on HTTP GET: ", e);
				}
                reject(e);
            });
			a.on("socket", () => {
				timeout = setTimeout(() => {
					try{
						a.abort();
					}catch(e){
						console.log(e);
					}
				},250);
			});
			a.end();
        } catch (e) {
            //console.log(e);
			reject(e);
        }
    })
}

function HTTPPost(url, body) {
    return new Promise((resolve, reject) => {
        try {
			if (debuggerMode) {
				console.log("Preforming HTTP POST request on URL \""+url+"\"");
			}
			var timeout = null;
            var a = http.request({
				...parseURL(url),
				method: "POST"
            }, (res) => {
                try {
                    var text = "";
                    res.on("data", (chunk) => {
                        text += chunk;
                    });
                    res.on("end", () => {
                        var replacementRES = {
                            data: text
                        };
						if (debuggerMode) {
							console.log("HTTP POST request finished. "+res.statusCode+" ");
						}
						clearTimeout(timeout);
                        resolve(replacementRES);
                    });
                } catch (e) {
                    if (debuggerMode) {
						console.log("Error on HTTP POST: ", e);
					}
                    reject(e);
                }
            });
            a.on("error", (e) => {
                if (debuggerMode) {
					console.log("Error on HTTP POST: ", e);
				}
                reject(e);
            });
			a.on("socket", () => {
				timeout = setTimeout(() => {
					try{
						a.abort();
					}catch(e){
						console.log(e);
					}
				},250);
			});
			if (body) {
				a.write(body);
			}
			a.end();
        } catch (e) {
            //console.log(e);
			reject(e);
        }
    })
}

function createWSDebugMessage (...msgs) {
	var messageJSON = {
		type:"debugger",
		messages:msgs
	};
	return JSON.stringify(messageJSON);
}

var utils = {
	debuggerMode:debuggerMode,
    http: {
        get: HTTPGet,
        post: HTTPPost
    },
	ws: {
		createDebugMessage: createWSDebugMessage
	}
};

module.exports = utils;
