express重定向的方式很简单，其实vue也可进行页面的重定向，但与vue的页面路由重定向不同，这里讲的是express的页面重定向


这里我们介绍一个新的模块cookie-parser

cookie-parser是对cookie进行封装的一个模块，方便我们对cookies进行操作。


index.js：
```javascript
var express = require("express")
var  globalconf = require("./config")
var allStuContr = require("./web/allStudentController")

// 引入cookie-parser模块
var cookie = require("cookie-parser") 

var app = new express()
app.use(express.static(globalconf["page_path"]))

// 使用cookie模块
app.use(cookie())
app.get("/api/*",function(request,response,next){
    
    
    // 读取cookie，如果cookie中有id值，就放行
    if(request.cookies.id){
        next()
    }else {
    // 否则就重定向到login.html页面
        response.redirect("/login.html")
    }
})

 
app.get("/api/getAll", allStuContr)
app.listen(globalconf["port"])
```

这里只是简单进行了重定向的授权，思路是这样子的：

当用户访问了某个页面，如果这个页面符合某个条件，那就执行某个函数，否则就重定向到某个页面。由于前面已经定义过静态文件的路径了，所有重定向的时候不用再设置一次重定向路径，而是直接写html文件名

在express里面，由于设置了"/api/*"，因此就算是访问/api/getAll接口，只要没有写入cookie，都会对页面进行重定向

#

假设有这样一个场景：我们登录账号密码之后，要去访问某个页面，这个页面根据我们是否登录的情况显示不同的内容。但是，这个页面怎么知道我们是否已经登录？

这里我们可以通过给浏览器写入cookie来实现。

这里主要讲一下核心思路，代码过程很简单。

当登录框输入账户密码提交之后，后端可以写一个接口：

index.js接口：

```javascript
app.get("/login", userLogin)
```



web层：

```html
<form action="/login" method="get">
    <input type="number">
    <input type="password">
    <input type="submit">
</form>
```

```javascript
var stuDao = require("../dao/allStuDao")
var url = require("url")



function userLogin(request, response) {
    var prams = url.parse(request.url, ture).query;

    stuDao.queryStudent(prams.stu_Num, (result)=>{

        if(result && result.length > 0 && result[0].pwd == prams.pwd){
            // 写入cookie

            response.cookie("id", result[0].id)
            response.redirect("/api/getAll")
        }else {
            response.redirect("LoginError.html")
        }

    })
}
module.exports = userLogin
```

由于在上面做过关于cookie的重定向，这里写入cookie，相当于实现了一个单例模式，通过这个开关，轻松实现利用cookie进行自动登录
