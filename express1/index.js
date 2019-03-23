// express 搭建静态服务器

let express = require('express') // 引用express

let app = new express() // 创建express对象

app.use(express.static('./express1/pages')) // 设置静态文件目录

app.listen(12306) // 监听端口