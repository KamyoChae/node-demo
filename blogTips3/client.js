var net = require("net"); // 引用一个模块

var socket = net.connect(12306, "127.0.0.1"); // 创建一个连接 连接到ip地址为127.0.0.1的12306端口
socket.setTimeout(2000); // 设置超时器 2秒后触发超时事件

socket.on("timeout", function () {
    // 监听是否超时
    // console.log("超时啦") // 在客户端提示 “"超时啦”"
    socket.end() // 断开客户端的链接
});

socket.on("connect", function () {
    // 给socket绑定一个connect事件 当连接到服务器端的时候触发这个函数
    console.log("连接成功")
    socket.write("我在链接成功的一瞬间给你发了信息")
    socket.write("Hello World"); // 给服务器端发送信息
    socket.write("1Hello World1"); // 给服务器端发送信息
    socket.write("1Hello World2"); // 给服务器端发送信息
    socket.write("Hello World3"); // 给服务器端发送信息
    socket.write("Hello World4"); // 给服务器端发送信息
    socket.write("Hello World5"); // 给服务器端发送信息
    socket.write("Hello World6"); // 给服务器端发送信息
    socket.write("Hello World7"); // 给服务器端发送信息
    socket.write("Hello World8"); // 给服务器端发送信息
    socket.write("Hello World9"); // 给服务器端发送信息
    socket.on("data", function (data) {
        // 监听data事件 当收到服务器端传来信息的时候 打印输出
        console.log("data:" + data.toString())
    });
    console.log(socket.remoteAddress)
    console.log(socket.localAddress)
});

