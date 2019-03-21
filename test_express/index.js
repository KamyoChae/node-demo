var express = require("express")
var fs = require("fs")
var url = require("url")
var  globalconf = require("./config")

var cookie = require("cookie-parser")

var allStuContr = require("./web/allStudentController")
var userLogin = require("./web/userLogin")

var uploadControl = require("./web/uploadControl")
// var down = require("./web/down")

var multer = require("multer")


var app = new express()

app.use(express.static(globalconf["page_path"]))
app.use(cookie())

var upload = multer({dest:"./file"})

app.post("/upload", upload.single("file"), uploadControl)

app.get("/api/*",function(request,response,next){
    console.log(request.cookies.id)
    if(request.cookies.id){
        next()
    }else {
        response.redirect("/login.html")
    }
})

app.get("/api/getAll", allStuContr)
app.get("/login", userLogin)
// app.get("/getPath", down)
app.get("/getPath", (request, response)=>{
    var params = url.parse(request.url, true).query

    console.log(params.path)
    var path = params.path
    try{
        console.log(54)
        var data = fs.readFileSync("./" + path)
        console.log(55)
        response.writeHead(200)
        response.write(data)
        response.end()
    }catch (e){
        response.writeHead(404)
        response.end()

    }
})

app.listen(globalconf["port"])