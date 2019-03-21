这个接口实现的过程比较简单，所以后端我们只分为dao层、web层、省略了services层。

dao层：用于连接数据库，将数据传给web层。
web层：用于将数据返回给页面。

实现的要求：通过浏览器访问接口/getAll，返回所有学生的信息。

下面开始实现的过程。

### 第一步：基本配置

安装好git、node、express、mysql（5.7）

express的要求不多，只是一个框架而已。mysql安装好之后，通过datagrip存入学生数据。

相关设置如下：
```
host:"127.0.0.1",
port:"3306",
user:"root",
password:"123456",
database:"school"
```

### 第二步：使用express

在之前的几篇文章里面都是使用http模块进行前后端的实现，这里使用express的原因是http模块有一定局限性，比如上传文件容易乱码，而express是封装好的框架，做项目十分方便、效率极高。看下面代码：

在根目录下，创建一个server.conf文件，用于配置服务器，内容如下：

```
port=12306
page_path=page
```
随后创建一个config.js文件，用于读取配置文件的内容，并格式化：


```javascript
var fs = require("fs")

let conf = fs.readFileSync("./test_express/server.conf")

let confArr = conf.toString().split("\r\n")

var globalconf = {}

for ( let i = 0; i < confArr.length; i ++){
    globalconf[confArr[i].split("=")[0]] = confArr[i].split("=")[1]
}
console.log(globalconf)


module.exports = globalconf
```

最后创建我们express的核心代码，这是一个index.js文件：


```javascript
// 引入express模块
var express = require("express")

// 引入配置文件
var  globalconf = require("./config")

// 引入web层的模块，通过这个模块实现接口的调用
var allStuContr = require("./web/allStudentController")

// 使用这个express框架
var app = new express()

// 告诉express框架，静态文件全部放在这个globalconf["page_path"]路径了
app.use(express.static(globalconf["page_path"]))

// url访问接口，调用allStuContr这个函数
app.get("/getAll", allStuContr)

// 监听globalconf["port"]端口
app.listen(globalconf["port"])
```
index.js文件中，有几个值得注意的地方：

allStuContr：这是一个web层的模块，下面会讲到，通过它调用后面的函数实现接口的调用。

app： 这是express的实例对象

express.static(...)： 通过这个实例对象，设置参数，告诉express框架静态文件存放正在这里。

app.get("/getAll", allStuContr)：第一个参数是访问的接口，第二个参数是回调函数

### 第三步：打通dao层到web层

在根目录下，我们创建两个文件夹，一个文件夹叫dao，另一个叫web，分别代表dao层和web层。

dao层负责数据连接，web层负责将数据传给页面

#### 1 数据库连接
想要读取数据库的内容，我们首先要配置数据库的账号密码：

dbutil.js：
```javascript
var mysql = require("mysql")

var createConnection = () => {
    var connect = mysql.createConnection({
        host:"127.0.0.1",
        port:"3306",
        user:"root",
        password:"123456",
        database:"school"
    })
    return connect
}

module.exports.createConnection = createConnection
```
十分熟悉，在第一步基本配置创建数据库的时候，就是这个账号密码。

通过msql的createConnection方法，创建一个连接，最后返回这个链接，导出给一个函数createConnection，当这个函数执行的时候，也就意味着创建一次链接


#### 2 dao层实现

allStuDao.js：
```javascript
var dbutil = require("./dbutil") 
function queryStudent(succes) {
    var query = "select * from student "
    var connection = dbutil.createConnection()
    connection.connect();
    var age = 16
    connection.query(query, age, function (error, result) {
        if(error == null){
            succes(result) // 触发回调
        }else {
            console.log(error)
        }
    })
    connection.end()
}


module.exports = {"queryStudent": queryStudent}
```
注意，这里我们给queryStudent函数传了一个参数succes，其实这是一个回调函数。

到层到这里就实现完毕了

接下来是实现web层

#### 3 web层实现

allStudentController.js：

```javascript
var stuDao = require("../dao/allStuDao")

function getAll(request, response) {
    stuDao.queryStudent((result)=>{
        response.writeHead(200)
        response.write(JSON.stringify(result))
        response.end()
    })
}
module.exports = getAll
```

在这里，可以看出，函数getAll就是我们前面的index.js文件里面的app.get的接口。在web层，我们引入了上面dao层的文件，通过dao层导出的queryStudent函数，进行数据的查询。其中箭头函数就是刚刚在dao层设置的success回调函数，在这里我们通过形参response将读取到的后端数据渲染到前端页面。

由此，整个接口实现完成
