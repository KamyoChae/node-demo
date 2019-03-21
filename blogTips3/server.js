var net = require("net")

var server = net.createServer()
server.listen(12306, "127.0.0.1")
server.on("listening", function () {
    console.log("服务器启动")
})
server.on("connection", function (socket) {
    console.log("有新的链接")
    socket.on("data", function (data) {
        console.log(data.toString())
        socket.write("server收到 >> " + data.toString() + "\n")
    })
    socket.on("close", function () {
        console.log("客户端已关闭")
        //    server.close()
    })
})
