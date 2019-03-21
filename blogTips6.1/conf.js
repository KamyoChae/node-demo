var fs = require("fs")

var globleConfig = {}

var conf = fs.readFileSync("blogTips6.1/server.conf")

console.log(conf.toString())

var temp = conf.toString().split("\r\n")
for(var i = 0; i<temp.length; i++){
    if(temp[i] === ""){
        continue
    }else {
        globleConfig[temp[i].split("=")[0]] = temp[i].split("=")[1]
        if(globleConfig["path_position"] === "relative"){
            globleConfig.basePath = __dirname + globleConfig["path"]
        }else if(globleConfig["path_position"] === "absolute"){
            globleConfig.basePath =  globleConfig["path"]
        }
    }
}
// console.log(globleConfig)
module.exports = globleConfig;