var net = require("net")
var fs = require("fs")
var globalConf = require("./conf")

var server = net.createServer()
server.listen(globalConf.port, "127.0.0.1")

server.on("listening", function () {
    console.log("server is run ")
})

server.on("connection", function(socket){
    console.log("连接进来了")
    socket.on("data", function (data) {
        var requst = data.toString().split("\r\n")
        var url = requst[0].split(" ")[1]
        try{
            var dataFile = fs.readFileSync(__dirname + globalConf.path + url)

            socket.write("HTTP 200OK\r\nContent-type:text/html\r\n\r\n"+dataFile.toString())
        }catch(e){
            socket.write("HTTP 404NotFound\r\nContent-type:text/html\r\n\r\n<html><body>404NotFound!</body></html>")
        }
    })
})