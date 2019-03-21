导读：在阅读本文之前，请先确保已经看完了我前面的12345篇[文章](https://github.com/KamyoChae/Kam-NodeJs)，若没看过就看这篇的话，有可能不知道我在说啥。
 

在第五篇文章里面，最后进行了url的分割处理


```JavaScript
var net = require("net")

var server = net.createServer()
server.listen(12306, "127.0.0.1")

server.on("listening", function () {
    console.log("server is run ")
})

server.on("connection", function(socket){
    console.log("new net come")
    socket.on("data", function (data) {
        var requst = data.toString().split("\r\n")
        var url = requst[0].split(" ")[1] 
         
        socket.write("HTTP 200OK\r\nContent-type:text/html\r\n\r\n<html><body>HELLO WORLD!</body></html>")
    })
})
```
为了更好的阅读体验，请先花两分钟回忆一下上面代码大概是什么意思，下面会贴出一份带注释的代码。


```JavaScript
// 引入一个net模块
var net = require("net")

// 通过net创建一个服务器端
var server = net.createServer()

// 这个服务器端监听12306端口 ip地址为127.0.0.1
server.listen(12306, "127.0.0.1")

// 监听服务器状态 启动时触发函数
server.on("listening", function () {
    console.log("server is run ")
})

// 监听服务器连接状态 有新的连接接入会触发函数
server.on("connection", function(socket){
    console.log("new net come") // 断点打印
    
    // 通过socket监听data事件，获取到socket传过来的http数据
    socket.on("data", function (data) {
    
        // 将其进行行分割
        var requst = data.toString().split("\r\n")
        
        // 取出索引值为1的值
        var url = requst[0].split(" ")[1] 
         
        // 给浏览器端传递http数据
        socket.write("HTTP 200OK\r\nContent-type:text/html\r\n\r\n<html><body>HELLO WORLD!</body></html>")
    })
})
```


简单对比一下上面的注释和你的理解。

#
### 下面开始文章的正文内容——如何用node搭建一个简单的服务器
#
首先，我们需要知道node里面有个模块叫“fs”，通过这个模块可以引入文件。

```javascript
var net = require("net")
var fs = require("fs") // 注意添加了这一行

var server = net.createServer()
server.listen(12306, "127.0.0.1")
server.on("listening", function(){
    console.log("服务器启动")
})

```
引入模块之后，我们能做些什么？试想当我们在浏览器url输入地址之后会发生....

既然fs是用来读取文件的，而我们又可以通过socket拿到前端url传过来的地址，而这个地址要找的就是我们的静态页面。

那么，是不是可以直接就把这个地址处理一下，获取到前端要找的静态页面名字，然后拿这个名字通过fs去读服务器上面的文件，如果读出来了就把这个文件封装一下传给前端页面，当然了，如果没有这个文件的话我们就告诉前端404，找不到这个页面。

代码实现如下:

```javascript
var net = require("net")
var fs = require("fs")

var server = net.createServer()
server.listen(12306, "127.0.0.1")
server.on("listening", function(){
    console.log("服务器启动")
})

server.on("connection", function(socket){
    socket.on("data", function(data){
        
        // 拿到前端传过来的url地址 处理一下
        var url = data.toString().split("\r\n")[0].split(" ")[1]
        console.log(data.toString().split("\r\n")[0]) // 通过换行来分割 拿到第一行
        console.log(url) // 拿到第一行之后再分割一次，拿到第二个字符串
        try{
        
            // 读取本地的文件
            var dataFlie = fs.readFileSync(__dirname+url)
            // 如果读取成功，就直接toString()传过去给前端页面 状态码是 200OK
            socket.write("HTTP/1.1 200OK \r\n\r\n" + dataFlie.toString())
        }catch(e){
        
            // 读取不到文件的话就返回个404状态码 然后是404页面
            socket.write("HTTP/1.1 404NotFound\r\n\r\n<html><body><h1>404 NOT Found</h1></body></html>>")
        }
    })
})

```
注：服务器连接成功后，data是这样子的

```javascript
GET /index.html HTTP/1.1
Host: 127.0.0.1:12306
Connection: keep-alive
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
```

### 嵌入图片出错的解决方案

在上面的代码里面，我们读取的是index.html文件，然后把它toString()变成字符串之后传给前端，但是当我们往index.html里面添加图片的时候，发现前端页面并没有返回图片。核心代码如下：

```javascript
server.on("connection", function(socket){
    socket.on("data", function(data){
        var url = data.toString().split("\r\n")[0].split(" ")[1]
        console.log(data.toString())
        console.log(url)
        try{
            var dataFile = fs.readFileSync(__dirname+url)
            socket.write("HTTP/1.1 200OK \r\n\r\n" + dataFile.toString())
        }catch(e){
            socket.write("HTTP/1.1 404NotFound\r\n\r\n<html><body><h1>404 NOT Found</h1></body></html>>")
        }
    })
    socket.end()
})
```
原因很简单，是因为我们把读取到的文件数据全部转换成字符串了，就连图片也是字符串。这里我们只要把dataFile.toString()改成dataFile同时单独写一行就好了。

修改如下：

```javascript
server.on("connection", function(socket){
    socket.on("data", function(data){
        var url = data.toString().split("\r\n")[0].split(" ")[1]
        console.log(data.toString())
        console.log(url)
        try{
            var dataFile = fs.readFileSync(__dirname+url)
            socket.write("HTTP/1.1 200OK \r\n\r\n" )
            socket.write(dataFile)
        }catch(e){
            socket.write("HTTP/1.1 404NotFound\r\n\r\n<html><body><h1>404 NOT Found</h1></body></html>>")
        }
    })
    socket.end()
})
```
[下一篇：Tips7 徒手写一个配置文件](https://github.com/KamyoChae/Kam-NodeJs/blob/master/_pages/tips7-%E7%94%A8node%E6%90%AD%E5%BB%BA%E4%B8%80%E4%B8%AA%E7%AE%80%E5%8D%95%E7%9A%84%E6%9C%8D%E5%8A%A1%E5%99%A8%EF%BC%88%E4%BA%8C%EF%BC%89.md)
