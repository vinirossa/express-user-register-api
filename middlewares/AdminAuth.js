const jwt = require('jsonwebtoken')
var secret = "280fd29c01a04a178a05fc9cee283dd27764e932ea96f949e880ad56"

module.exports = function(req, res, next) {

    const authToken = req.headers['authorization']

    if (authToken == undefined) {
        res.status(401)
        res.send("O usuário não está autorizado")
        return
    }

    const bearer = authToken.split(' ')
    var token = bearer[1]

    try {
        var decoded = jwt.verify(token, secret)

        if (decoded.role != 1) {
            res.status(403)
            res.send("O usuário não possui permissão")
            return
        }

        next()
    } catch (err) {
        res.status(401)
        res.send("O usuário não está autorizado")
        return
    }
}