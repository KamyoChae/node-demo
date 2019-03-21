var dbutil = require("./dbutil")
console.log(dbutil)
function queryStudent(succes) {
    var query = "select * from student "
    var connection = dbutil.createConnection()
    connection.connect();
    var age = 16
    connection.query(query, age, function (error, result) {
        if(error == null){
            succes(result)
        }else {
            console.log(error)
        }
    })
    connection.end()
}


module.exports = {"queryStudent": queryStudent}