
var fs = require("fs")

var config = require("./config")

var files = fs.readdirSync("./blogTips7" + config["web_path"])

var controllerSet = []
var pathMap = new Map()
for (var i = 0; i < files.length; i ++){
    var temp = require("./" + config["web_path"] + "/" + files[i])

    if(temp.path){
        for (var [k,v] of temp.path){
            if(pathMap.get(k) == null){
                pathMap.set(k,v);
            }else {
                throw new Error("URL path异常： url：" + k)
            }
            controllerSet.push(temp)
        }
    }
}

module.exports = pathMap