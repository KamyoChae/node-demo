文件上传的方式很简单~~

简直简单到令人发指




```javascript
var express = require("express")
 
var uploadControl = require("./web/uploadControl")

var multer = require("multer")
 
var app = new express()
 
var upload = multer({dest:"./file1"})

app.post("/upload", upload.single("file"), uploadControl)

 
```

安装multer模块引入之后，通过```multer({dest:"./file1"})```指定上传文件到这个file1文件夹

我们上传的东西肯定不只有文件，还会有一些附带的参数，所以在这里我们需要将上传的文件进行筛选一下：
```
app.post("/upload", upload.single("file"), uploadControl)
```
app.post(接口, 筛选文件, 回调函数)

在回调函数里面，其实只需要这样写即可：


```javascript
function uploadControl(request, response) {

    response.end("finish")
}
module.exports = uploadControl
```

别的根本不需要弄，就这样完成了。

下面列一下request到的file文件怎么查看：

```javascript
console.log(request.file.size) // 文件大小
console.log(request.file.mimetype) // 文件类型
console.log(request.file.originalname) // 文件名
console.log(request.file.path) // 文件存储路径
console.log(request.file.filename) // 服务器中文件的路径=文件名
console.log(request.file.fieldname) // 服务器中文件名
console.log(request.file.destination) // 文件的服务器文件夹

```

整个过程就这么简单~

当然还需要我们前端实现ajax上传文件，这里简单贴一下代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>

    <input id="file" type="file">
    <input type="button" onclick="upload()" value="send">
<script>
    function upload() {
        console.log(22)
        var file = document.getElementById("file").files[0]

        var form = new FormData()
        form.append("file", file)
        console.log(file)

        var xhr = new XMLHttpRequest()
        xhr.open("post", "/upload", true)
        xhr.onload = function () {
            alert("上传成功")
        } 
        xhr.send(form)

    }

</script>
</body>
</html>
``
