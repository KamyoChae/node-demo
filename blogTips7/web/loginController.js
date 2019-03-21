var studentService = require("../service/studentService")
var path = new Map()

function getData (request, response){
    studentService.queryStudentService(function (result) {
        response.writeHead(200)
        response.write(result.toString())
        response.end()
    })
}
path.set("/getData", getData)

function getData2 (request, response){

}
path.set("/getData2", getData)

module.exports.path = path