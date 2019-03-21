var studentDao = require("../dao/studentDao")

function queryStudentService(succes) {
    studentDao.queryStudent(succes)
}

module.exports = {
    "queryStudentService":queryStudentService,
}