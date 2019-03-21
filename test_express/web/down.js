var fs = require("fs")
var url = require("url")

module.exports = down = (request, response)=>{
    var params = url.parse(request.url, true).query

    var path = params.path
    try{
        console.log(path)
        var data = fs.readFileSync("./" + path)

        console.log(55)
        response.writeHead(200)
        response.write(data)
        response.end()
    }catch (e){
        response.writeHead(404)
        response.end()

    }
}