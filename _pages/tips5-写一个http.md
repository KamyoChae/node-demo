首先我们要简单理解一下应用层和传输层。在这片文章里面姑且可以把http看做是应用层的东西，TCP/IP看做是传输层的东西，传输层的东西负责传输数据，应用层的东西负责显示数据。

下面开始我们的代码

首先写一个服务器端

//sever.js
```javascript
var net = require("net")

var server = net.createServer()
server.listen(12306, "127.0.0.1")

server.on("listening", function () {
    console.log("server is run ")
})

server.on("connection", function(socket){
    console.log("new net come")
    socket.on("data", function (data) {
        console.log(data.toString())
    })
})
```
当我们运行这段代码，并在浏览器url上面写上ip地址+端口（即 http://localhost:12306 ） 的时候，可以看到控制台有这么一段输出：

![tips51](https://github.com/KamyoChae/Kam-NodeJs/blob/master/_images/tips5/tips51.JPG)

很明显，这就是我们前端开发过程中经常打交道的http请求。

为什么data.toString()就可以看到http请求？带着这个问题，我们回忆起在浏览器地址栏输入url之后...经典面试题（详情看我的另一篇博客）

回忆杀结束后，其实可以简单概括成一句话：http是应用层上面的东西，而我们的tcp/ip是传输层上面的东西，我们在传输层（server层）就获取到了应用层的http协议。

拿到http协议之后，我们能做些什么？看第一行 “GET / HTTP/1.1”是不是很眼熟？如果我们把url改一下呢，写成http://localhost:12306/index.html 

带着疑问进行了以下测试，于是结果如下：

![tips52](https://github.com/KamyoChae/Kam-NodeJs/blob/master/_images/tips5/tips52.JPG)

可见 GET后面的 /index.html就是我们在url上面写的东西。

知道了这个我们能做些什么？能不能做个根据访问的页面来实现数据查询或是页面查询？可以的，不过这个问题在下一篇文章会进行详细说明，这里咱先不急。

话说回头，浏览器给我们发了个http，我们总不能啥都不做吧。如果我们也得给它回个信息怎么做？看到这里你可能会有个大胆的想法，用socket.write("返回给浏览器一个数据")

带着这个大胆的想法，我们决定实践一下：

```javascript
var net = require("net")

var server = net.createServer()
server.listen(12306, "127.0.0.1")

server.on("listening", function () {
    console.log("server is run ")
})

server.on("connection", function(socket){
    console.log("new net come")
    socket.on("data", function (data) {
        console.log(data.toString())
        socket.write("返回给浏览器一个数据")
    })
})

```
结果报了个错：

![53](https://github.com/KamyoChae/Kam-NodeJs/blob/master/_images/tips5/tips53.JPG)

这是为什么？难道用write不对吗？？

不是的，用write没错，但是你传给浏览器的也必须是个http协议啊

这么说吧，浏览器发过来的http是请求头，那么你返回去的就必须是个响应头。如果不是响应头，就失败。意思是谁知道你会传过去什么鬼东西，不收不收。


修改后代码如下：

```javascript
var net = require("net")

var server = net.createServer()
server.listen(12306, "127.0.0.1")

server.on("listening", function () {
    console.log("server is run ")
})

server.on("connection", function(socket){
    console.log("new net come")
    socket.on("data", function (data) {
        console.log(data.toString())
        socket.write("HTTP 200OK\r\nContent-type:text/html\r\n\r\n<html><body>HELLO WORLD!</body></html>")
    })
})
```

结果如图：

![54](https://github.com/KamyoChae/Kam-NodeJs/blob/master/_images/tips5/tips54.JPG)

简单说一下，响应头长这个样子：

```
HTTP 200OK
Content-type:text/html

<html><body>HELLO WORLD!</body></html>
```
\r\n是传义字符，表示空格 换行


可见，http协议传过去了。由此，我们明白了后端是怎么给前端传值的。


最后，我们将代码优化一下，分割获取出访问的页面是啥

```javascript
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
        console.log(url)
         
        socket.write("HTTP 200OK\r\nContent-type:text/html\r\n\r\n<html><body>HELLO WORLD!</body></html>")
    })
})
```

