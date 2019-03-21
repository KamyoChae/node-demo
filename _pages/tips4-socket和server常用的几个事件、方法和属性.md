
socket |--- 
---|---
事件|事件简述
connect|这个connect不是net的connect，虽然单词一样，但socket的connect是当socket连接上服务器的时候触发的一个事件
data|这个data就是用来接收数据的，只要是传过来的数据，都可以用data来接收一下
timeout|当超时器启动的时候触发这个函数
error|报错的时候触发一下
close|当客户端连接断开的时候触发这个函数
属性| 属性简述
remoteAddress|查看远程ip地址
remotePort|查看远程端口
localAddress|查看本地ip地址
localPort|查看本地端口
方法|方法简述
setTimeout|设置超时器，和timeout配合起来用
write|传递信息


server | - 
---|---
事件|事件简述
listening|在服务器监听启动状态，若服务器启动，则触发函数
connection|在服务器监听是否连接成功，若连接成功，则触发函数
close|监听服务器是否关闭
error|监听服务器有没有报错
方法|方法简述
listen|监听端口
close|关闭服务器
address|查看服务器地址


一个demo用完

// client.js
```javascript
var net = require("net"); // 引用一个模块

var socket = net.connect(12306, "127.0.0.1"); // 创建一个连接 连接到ip地址为127.0.0.1的12306端口
socket.setTimeout(2000); // 设置超时器 2秒后触发超时事件

socket.on("timeout",function(){
    // 监听是否超时
    // console.log("超时啦") // 在客户端提示 “"超时啦”"
    socket.end() // 断开客户端的链接
});

socket.on("connect", function(){
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
    socket.on("data", function(data){
        // 监听data事件 当收到服务器端传来信息的时候 打印输出
        console.log("data:"+data.toString())
    });
    console.log(socket.remoteAddress)
    console.log(socket.localAddress)
});


```

// server.js
```javascript

var net = require("net")

var server = net.createServer()
server.listen(12306, "127.0.0.1")
server.on("listening", function(){
    console.log("服务器启动")
})
server.on("connection", function(socket){
    console.log("有新的链接")
    socket.on("data",function(data){
        console.log(data.toString())
        socket.write("server收到 >> "+data.toString() + "\n")
    })
    socket.on("close",function(){
        console.log("客户端已关闭")
    //    server.close()
    })
})

```
值得注意的是，上面client的socket.write("1Hello World1")是分批次发送到服务端的，留个坑给你慢慢玩，很有趣
