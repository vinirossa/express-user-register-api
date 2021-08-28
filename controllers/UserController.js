const User = require('../models/User')
const PasswordToken = require('../models/PasswordToken')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

var secret = "280fd29c01a04a178a05fc9cee283dd27764e932ea96f949e880ad56"

class UserController {

    async findAll(req, res) {
        var users = await User.findAll()
        res.json(users)
    }

    async findById(req, res) {
        var id = req.params.id
        var user = await User.findById(id)

        if (user == undefined) {
            res.status(404)
            res.json({})
        } else {
            res.json(user)
        }

        res.json(user)
    }

    async create(req, res) {

        var { name, email, password } = req.body

        if (email == undefined) {
            res.status(400)
            res.json({ err: "O e-mail é inválido." })
            return
        }

        if (await User.findEmail(email)) {
            res.status(409)
            res.json({ err: "O e-mail já existe na base de dados." })
            return
        }

        await User.create(name, email, password)

        res.status(200)
        res.send("Registro inserido com sucesso.")
    }

    async update(req, res) {
        var { id, name, email, role } = req.body
        var result = await User.update(id, name, email, role)

        if (result != undefined) {
            if (result.status) {
                res.status(200)
                res.send("Registro alterado com sucesso.")
            } else {
                res.status(406)
                res.send(result.err)
            }
        } else {
            res.status(406)
            res.send("Ocorreu um erro ao alterar o registro")
        }

    }

    async delete(req, res) {
        var id = req.params.id
        var result = await User.delete(id)

        if (!result.status) {
            res.status(406)
            res.send(result.err)
        }

        res.status(200)
        res.send("Registro deletado com sucesso.")
    }

    async recoverPassword(req, res) {
        var email = req.body.email

        var result = await PasswordToken.create(email)

        if (!result.status) {
            res.status(406)
            res.send(result.err)
        }

        res.status(200)
        res.send(result.token.toString())
    }

    async changePassword(req, res) {
        var token = req.body.token
        var password = req.body.password

        var isTokenValid = await PasswordToken.validate(token)

        if (!isTokenValid.status) {
            res.status(406)
            res.send("O token é inválido.")
        }

        try {
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)

            res.status(200)
            res.send("A senha foi alterada.")
        } catch (err) {
            res.status(406)
            res.send(err)
        }
    }

    async login(req, res) {
        var { email, password } = req.body

        var user = await User.findByEmail(email)

        if (user == undefined) {
            res.status(404)
            res.send("O usuário não foi encontrado")
        }

        var result = await bcrypt.compare(password, user.password)

        if (!result) {
            res.status(403)
            res.send("A senha está incorreta")
        }

        var token = jwt.sign({ email: user.email, role: user.role }, secret)

        res.status(200)
        res.send({ token })
    }
}

module.exports = new UserController()