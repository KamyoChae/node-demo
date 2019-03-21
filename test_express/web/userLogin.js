var stuDao = require("../dao/allStuDao")
var url = require("url")



function userLogin(request, response) {
    var prams = url.parse(request.url, true).query;

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