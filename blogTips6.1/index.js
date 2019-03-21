var net = require("net")
var fs = require("fs")
var global = require("./conf")

var server = net.createServer()
console.log(global["port"])
server.listen(global["port"], "127.0.0.1")
server.on("listening", function(){
    console.log("服务器启动")
})

server.on("connection", function(socket){
    socket.on("data", function(data){
        var url = data.toString().split("\r\n")[0].split(" ")[1]
        // console.log(data.toString())
        // console.log(url)
        try{
            var dataFile = fs.readFileSync(global.basePath + url)
            socket.write("HTTP/1.1 200OK \r\n\r\n" + dataFile.toString())
        }catch(e){
            socket.write("HTTP/1.1 404NotFound\r\n\r\n<html><body><h1>404 NOT Found</h1></body></html>>")
        }
    })
    // socket.end()
})