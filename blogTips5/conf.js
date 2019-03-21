var fs = require("fs")

var globalConf = {}

var conf = fs.readFileSync("server.conf")
var confs = conf.toString().split("\r\n")

for(var i = 0; i < confs.length; i++){
    var tempConf = confs[i].split("=")
    if(tempConf.length < 2){
        continue
    }else {
        globalConf[tempConf[0]] = tempConf[1]
    }

}

module.exports = globalConf