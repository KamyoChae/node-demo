var http = require("http");
var url = require("url");
var fs = require("fs");
var loader = require("./loader")

var config = require("./config");

http.createServer(function(request, response){

    var pathName = url.parse(request.url).pathname;

    var params = url.parse(request.url).query;

    var isStatic = isStaticRequest(pathName);

    if(isStatic){
        var base = config["path_page"] + pathName
        try{
            console.log(base)
            var data = fs.readFileSync("./blogTips7" + base)

            response.writeHead(200)
            response.write(data.toString())
            response.end()
        }catch(e){
            response.writeHead(404)
            response.write("<html><body>404 NOT FOUND</body></html>")
            response.end()
        }

    }else {
        // 动态
        console.log("indexJS: " + pathName)
        if(loader.get(pathName) != null){
            try {
                loader.get(pathName)(request, response)
            }catch (e) {
                response.writeHead(500)
                response.write("<html><body>500 SERVER ERROR</body></html>")
                response.end()
            }
        }else {
            response.writeHead(404)
            response.write("<html><body>404 NOT FOUND</body></html>")
            response.end()
        }
    }

}).listen(config["port"]);

 function isStaticRequest(pathName) {
     var temp = null;
     for(var i = 0; i<config.static_file_type.length; i++){
         temp = config.static_file_type[i]
        if(pathName.indexOf(temp) == pathName.length - temp.length){

            // 说明访问的是静态文件
            return true
        }
     }
     // 说明访问的是动态文件
     return false

 }