# 实现客户端与服务端的通信 

这篇文章初步讲述一下客户端与服务器端的通信过程

我们要做一个这样子的效果：
客户端给服务器端发送一条信息，服务器端返回响应的信息到客户端

看上去是不是很简单？我们来看看在webstorm上面的效果是怎样的

![client.jpg](https://github.com/KamyoChae/Kam-NodeJs/blob/master/_images/client.JPG)

## 开始撸代码

既然是要做客户端和服务端，那么首先必不可少的就是需要创建一个客户端和一个服务端。当然前提是你的电脑已经安装好了[node](https://nodejs.org/zh-cn/download/)

于是，我们在webstorm分别创建了表示客户端的client.js和表示服务端的server.js 

打开client.js输入以下代码

//client.js
```javascript
var net = require("net")

```
这句代码的意思是：我要引入一个系统自带的模块，这个模块叫做net。net模块的用处是创建服务的，在下面我们可以见识到。

接着我们不断的往里面添加代码，我会在每次添加代码的后面简单说一下这句代码的含义：

//client.js
```javascript
var net = require("net")

var socket = net.connet(12306, "127.0.0.1"); 
// 创建一个连接 连接到ip地址为127.0.0.1的12306端口
```
新增的这行代码里面，net.connet是链接的意思，链接到哪？连接到端口12306, ip地址为127.0.0.1的地方。
客户端写到这里就可以了。

这时候我们需要打开server.js写上以下代码

//server.js
```javascript
var net = require("net")

var server = net.createServer()
server.listen(12306, "127.0.0.1")
```
server.js里面有两行代码和client.js不同，net.createServer()表示我要创建一个服务。而client.js里面则是net.connet(端口，ip)

server.listen(12306, "127.0.0.1")表示要在服务器端监听这个端口。

看到这里，你可能会问，问什么有两个(12306, "127.0.0.1")？他们是用来做什么的啊。

其实，ip+端口就是用来配对客户端和服务器端的。只要他俩都设置了一样的ip地址和端口号，他们就能成功的传递小纸条。不然说不准就会传到隔壁老王家里了。

我怎么知道客户端有没有给我传信息啊？其实这也很简单。
在服务器端绑定个connetion事件，当有新的连接连进来的时候，我们就能知道了。写法如下

//server.js

```javascript
var net = require("net")

var server = net.createServer()
server.listen(12306, "127.0.0.1")

server.on("listening", function(){
    console.log("服务器启动")
})

server.on("connection", function(socket){
    console.log("有新的链接")
})

```
怎么一下子多了两个on？别慌，先猜猜看这是什么。不难看出，这长得有点像事件绑定啊！其实它就是事件绑定。

- listening：当服务器启动的时候触发这个函数
- connection：当服务器有链接接入的时候触发这个函数

不对！等等！为什么connection这个事件里面还有个socket？？是不是我还能在里面做点什么？

当有了新的连接接入时，我们在服务器端的一系列操作都可以放在这个函数里面。比如

//server.js
```javascript
var net = require("net")

var server = net.createServer()
server.listen(12306, "127.0.0.1")

server.on("listening", function(){
    console.log("服务器启动")
})

server.on("connection", function(socket){
    console.log("有新的链接")
    
    socket.on("data",function(res){
        console.log(res.toString())
        socket.write("server收到 >> "+res.toString() + "\n")
    })

})

```
里面新增了几行函数。我们给socket绑定了一个data事件，这个事件用来输出client给我们传的值。res就是穿过来的数据，我们需要用toString()处理一下成字符串输出。
通过这个socket的write方法我们可以给client发送信息。

我们在client里面不是只写了两行代码吗？他怎么就发信息过来了？
其实在这里我们需要给client添加几行代码即可。

//client
```javascript
var net = require("net"); // 引用一个模块

var socket = net.connect(12306, "127.0.0.1"); 
// 创建一个连接 连接到ip地址为127.0.0.1的12306端口
 
socket.on("connect", function(){
    // 给socket绑定一个connect事件 当连接到服务器端的时候触发这个函数
    console.log("连接成功") 
    socket.write("Hello World"); // 给服务器端发送信息 
});
```
当客户端连接服务端成功的时候，就会触发connect这个事件，接着通过socket给服务端发送一条信息，"Hello World"。

所以目前完整的代码是这样子的：

// client
```javascript
var net = require("net"); // 引用一个模块

var socket = net.connect(12306, "127.0.0.1"); 
// 创建一个连接 连接到ip地址为127.0.0.1的12306端口
 
socket.on("connect", function(){
    // 给socket绑定一个connect事件 当连接到服务器端的时候触发这个函数
    console.log("连接成功") 
    socket.write("Hello World"); // 给服务器端发送信息 
    
    socket.on("data", function(data){
        // 监听data事件 当收到服务器端传来信息的时候 打印输出
        console.log("data:"+data.toString())
    });
});


```

//server.js
```javascript
var net = require("net")

var server = net.createServer()
server.listen(12306, "127.0.0.1")

server.on("listening", function(){
    console.log("服务器启动")
})

server.on("connection", function(socket){
    console.log("有新的链接")
    
    socket.on("data",function(res){
        console.log(res.toString())
        socket.write("server收到 >> "+res.toString() + "\n")
    })

})

```
这时候，我们先运行服务端，再运行客户端。
（webstorm右键>"Run xxx.js"）

就可以看到输出

![client.jpg](https://github.com/KamyoChae/Kam-NodeJs/blob/master/_images/client.JPG)

完成！！
