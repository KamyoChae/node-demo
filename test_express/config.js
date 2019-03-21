var fs = require("fs")

// let conf = fs.readFileSync("./test_express/server.conf")
let conf = fs.readFileSync("./server.conf")
let confArr = conf.toString().split("\r\n")

var globalconf = {}

for ( let i = 0; i < confArr.length; i ++){
    globalconf[confArr[i].split("=")[0]] = confArr[i].split("=")[1].trim()
}
console.log(globalconf)


module.exports = globalconf