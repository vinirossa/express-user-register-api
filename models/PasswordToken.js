const knex = require('../database/connection')
const User = require('./User')

class PasswordToken {

    async create(email) {
        var user = await User.findByEmail(email)

        if (user == undefined) {
            return { status: false, err: "O e-mail não existe no banco de dados" }
        }

        try {
            var token = Date.now()

            await knex.insert({ token: token, user_id: user.id, used: 0 }).table("password_tokens")
            return { status: true, token }
        } catch (err) {
            return { status: false, err: err }
        }
    }

    async validate(token) {

        try {
            var result = await knex.select().where({ token: token }).table("password_tokens")

            if (result.length <= 0) {
                return { status: false, err: "O token não foi encontrado" }
            }

            var token = result[0]

            if (token.used) {
                return { status: false, err: "O token já foi utilizado" }
            }

            return { status: true, token }

        } catch (err) {
            return { status: false, err: err }
        }
    }

    async setUsed(token) {
        await knex.update({ used: 1 }).where({ token }).table("password_tokens")
    }
}

module.exports = new PasswordToken()