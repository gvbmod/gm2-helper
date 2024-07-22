var fs = require("fs");

console.log(JSON.stringify(fs.readFileSync("ascii.txt",{encoding:"UTF-8"})));