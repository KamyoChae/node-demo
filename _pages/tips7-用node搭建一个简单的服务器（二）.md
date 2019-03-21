### 徒手写一个配置文件
[上一篇：tips6](https://github.com/KamyoChae/Kam-NodeJs/blob/master/_pages/tips6-%E7%94%A8node%E6%90%AD%E5%BB%BA%E4%B8%80%E4%B8%AA%E7%AE%80%E5%8D%95%E7%9A%84%E6%9C%8D%E5%8A%A1%E5%99%A8%EF%BC%88%E4%B8%80%EF%BC%89.md)

由于这一篇涉及到模块化开发的概念，所以单独分开讲，不然我估计很多读者难坚持看完上一篇..

先看上一篇的代码，熟悉一下：

```javascript
var net = require("net")
var fs = require("fs") 

var server = net.createServer() 
server.listen("12306", "127.0.0.1")
server.on("listening", function(){
    console.log("服务器启动")
})

server.on("connection", function(socket){
    socket.on("data", function(data){
        var url = data.toString().split("\r\n")[0].split(" ")[1] 
        try{
            var dataFile = fs.readFileSync(__dirname + url)
            socket.write("HTTP/1.1 200OK \r\n\r\n" + dataFile.toString())
        }catch(e){
            socket.write("HTTP/1.1 404NotFound\r\n\r\n<html><body><h1>404 NOT Found</h1></body></html>>")
        }
    })
    // socket.end()
})
```
这时候我们抛出一个问题，能不能我们自己写一个配置文件？？

抛出这个问题的原因是前面我们用到了fs这个读取文件的模块，如果写了一个配置文件，然后通过fs读取出来，是不是就可以将端口、文件路径这些关键的东西分离出来独立管理？？这无疑是极好的，大大降低了系统耦合度。

捋清楚思路之后，下面开始写一个配置文件：

文件：server.conf
```
port=12306
path=/web
path_position=relative

```
文件：conf.js
```javascript
// 引入fs文件模块
var fs = require("fs")
// 定义一个全局配置变量
var globleConfig = {}
// 读取文件 注意 这里的"blogTips6.1"是我的电脑项目路径，可以适当改下
var conf = fs.readFileSync("blogTips6.1/server.conf")
// 输出看看conf读出来没有
console.log(conf.toString())

// 下面开始数据的处理
var temp = conf.toString().split("\r\n")
for(var i = 0; i<temp.length; i++){
    if(temp[i] === ""){
        continue
    }else {
        globleConfig[temp[i].split("=")[0]] = temp[i].split("=")[1]
        
        // 将数据封装到前面的全局配置变量中 这样的思路我们做项目的时候经常用到
        if(globleConfig["path_position"] === "relative"){
        // 如果路径是相对的，我们就用相对路径
            globleConfig.basePath = __dirname + globleConfig["path"]
        }else if(globleConfig["path_position"] === "absolute"){
        // 如果路径是绝对的，我们就直接用绝对路径
            globleConfig.basePath =  globleConfig["path"]
        }
    }
}
// console.log(globleConfig)
module.exports = globleConfig; // 最后 将模块导出
```
module.exports是模块化开发的概念，不理解的同学可以看前面的12345篇文章有详细讲解


文件：index.js
```javascript
var net = require("net")
var fs = require("fs")

// 注意这列引入了刚刚导出的模块
var global = require("./conf")

var server = net.createServer()
console.log(global["port"])
// 注意这里通过导出的模块配置了端口号
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
        
            // 注意这里的路径也改动了 
            var dataFile = fs.readFileSync(global.basePath + url)
            socket.write("HTTP/1.1 200OK \r\n\r\n" + dataFile.toString())
        }catch(e){
            socket.write("HTTP/1.1 404NotFound\r\n\r\n<html><body><h1>404 NOT Found</h1></body></html>>")
        }
    })
    socket.end() // 关闭服务器
})
```

以上，就是整个徒手搭建简易服务器的整个核心代码。
