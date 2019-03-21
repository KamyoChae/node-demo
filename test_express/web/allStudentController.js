var stuDao = require("../dao/allStuDao")



function getAll(request, response) {
    stuDao.queryStudent((result)=>{
        response.writeHead(200)
        response.write(JSON.stringify(result))
        response.end()
    })
}
module.exports = getAll