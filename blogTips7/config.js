var fs = require("fs");

var conf = fs.readFileSync("./blogTips7/server.conf").toString();

var confArr = conf.split("\r\n");

var globalConfig = {}
for(var i = 0; i < confArr.length; i++){
    globalConfig[confArr[i].split("=")[0]] = confArr[i].split("=")[1];
}

if(globalConfig.static_file_type){
    globalConfig.static_file_type = globalConfig.static_file_type.split("|")
}else {
    return new Error("配置文件加载异常，缺少：static_file_type")
}

module.exports = globalConfig;