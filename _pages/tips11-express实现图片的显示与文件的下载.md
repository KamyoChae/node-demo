举个简单的例子，用户选择图片，点击上传之后，需要把上传成功的图片显示出来，这个怎么实现？

在上一篇文章，我们通过multer实现了文件的上传，通过前端发送一个ajax到服务器，就搞定了。同时我们也知道了，在服务器通过request.file.filename可以得知服务器中文件的 “路径/文件名” 。这时候，是不是联想到什么？

当我们在服务端的回调函数里面写上response.write(request.file.path)，前端就可以通过xhr.resposetext看到后端写过来的数据，也就知道文件存在哪了。

最后，我们把获取到的图片路径用js拼接到img元素的src中，前端就可以解析到这张图。

但是要注意的是，单单是给img的src写上图片地址还不够。原因是src也是一种请求，需要往后端获取资源，就得让后端提前实现获取图片的接口。

整个过程有点绕，不过实现起来并不是很难。跟前面的几篇文章提到的一样，这里实现图片的显示也是通过app.get("接口"，"回调函数")这样的方式实现。


## 下面开始贴显示图片的代码：

### 第一步，上传图片之后，web层返回的一串数据：


```javascript
function uploadControl(request, response) {
 

    response.write(request.file.path)
    response.end()
}
module.exports = uploadControl
```
当文件上传之后（续上一篇文章），后端给前端返回了一个文件在服务器端的路径。

### 第二步，前端接收这个路径，并拼接给img：


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

    <img id="pic" src="#">
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
        xhr.onreadystatechange=()=>{
            if (xhr.readyState == 4 && xhr.status == 200){}
            console.log(xhr.responseText)

            document.getElementById("pic").src = "/getPath?path=" + xhr.responseText

        }

    }

</script>
</body>
</html>
```
通过上面代码，上传成功之后控制台会输出服务器端返回的一个路径,即xhr.responseText:：

`file\1dafabab8e6d00a32391bc4465d56665`

> 1dafabab8e6d00a32391bc4465d56665 是上传的文件名，服务器为了避免文件重名造成覆盖问题，自动生成了一串代码。
> 
> file就是文件所在服务器的文件夹

我们利用这个返回的路径，再访问一次后端提供给我们的接口/getPath：

`document.getElementById("pic").src = "/getPath?path=" + xhr.responseText`

### 第三步，img也有自己的接口

通过访问这个接口，我们希望后端给我们找到刚刚上传到服务器的图片，服务器端代码如下：


```javascript
app.get("/getPath", (request, response)=>{
    var params = url.parse(request.url, true).query
 
    var path = params.path
    try{ 
        var data = fs.readFileSync("./" + path)
  
        response.writeHead(200)
        response.write(data)
        response.end()
    }catch (e){
        response.writeHead(404)
        response.end()

    }
})
```
由于是通过src直接访问接口，所以接口返回的数据直接渲染到img元素上面，不需要进行其他操作，到此，图片的显示完成。



如何实现文件的下载？html的超链接a元素就可以轻松实现，不过也有一个前提，a元素的href路径正确，通过a元素的download属性，可以设置下载文件的文件名。例如：

```html
<a href="/getPic?path='1dafabab8e6d00a32391bc4465d56665'" download="2.png">点击下载</a>
```

就这么简单，通过express实现图片的显示与文件的下载，轻松提高开发效率
