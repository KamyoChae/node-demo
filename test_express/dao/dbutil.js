var mysql = require("mysql")

var createConnection = () => {
    var connect = mysql.createConnection({
        host:"127.0.0.1",
        port:"3306",
        user:"root",
        password:"123456",
        database:"school"
    })
    return connect
}

module.exports.createConnection = createConnection