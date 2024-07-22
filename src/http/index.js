//This is still unfinished.

var util = require("../util.js");
var http = require("http");

var httpUtil = util.http;
var httpServers = {};

class HTTP {
	constructor (ws) {
		this.ws = ws;
		this.connectedRokuIP = null;
		var t = this;
		ws.on("message", (raw) => {
			t.handleMessage(JSON.parse(raw));
		});
	}
	handleMessage (d) {
		if (this[d.funct]) {
			this[d.funct](d);
		} else {
			if (util.debuggerMode) {
				console.log("Unknown function \""+d.funct+"\"");
			} else {
				//Stop the connection, for saftety purposes.
				this.ws.send(util.ws.createDebugMessage("Unknown function \""+d.funct+"\""));
				this.ws.close();
			}
		}
	}
	
	open(data) {
		var port = 8080;
		if (data.port) {
			port = data.port;
		}
		var server = 
	}
}
module.exports = HTTP;