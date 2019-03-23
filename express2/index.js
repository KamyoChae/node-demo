// 拉取数据

let expres = require('express')
let config = require('./config')
let app = new expres()
app.use(expres.static(config["path"]))
app.listen(config["port"])
