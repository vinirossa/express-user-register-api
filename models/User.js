const knex = require('../database/connection')
const bcrypt = require('bcrypt')
const PasswordToken = require('./PasswordToken')

class User {

    async findAll() {
        try {
            var result = await knex.select("id", "name", "email", "role").table("users")
            return result
        } catch (error) {
            console.log(err)
            return undefined
        }
    }

    async findById(id) {
        try {
            var result = await knex.select("id", "name", "email", "role").where({ id: id }).table("users")

            if (result.length <= 0) {
                return undefined
            }

            return result[0]

        } catch (error) {
            console.log(err)
            return undefined
        }
    }

    async findByEmail(email) {
        try {
            var result = await knex.select("id", "name", "email", "password", "role").where({ email: email }).table("users")

            if (result.length <= 0) {
                return undefined
            }

            return result[0]

        } catch (error) {
            console.log(err)
            return undefined
        }
    }

    async create(name, email, password, role = 0) {

        try {

            var hash = await bcrypt.hash(password, 10)
            await knex.insert({ name, email, password: hash, role }).table("users")

        } catch (error) {
            console.log(error)
        }
    }

    async findEmail(email) {

        try {
            var result = await knex.select().from("users").where({ email: email })

            if (result.length > 0) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async update(id, name, email, role) {
        var user = await this.findById(id)

        if (user == undefined) {
            return { status: false, err: "O usuário não existe" }
        }

        var editedUser = []

        if (name != undefined) {
            editedUser.name = name
        }

        if (email != undefined) {
            if (email != user.email) {
                var result = await this.findEmail(email)

                if (result == true) {
                    return { status: false, err: "O e-mail já está cadastrado" }
                } else {
                    editedUser.email = email
                }
            }
        }

        if (role != undefined) {
            editedUser.role = role
        }

        try {
            await knex.update(editedUser).where({ id: id }).table("users")
            return { status: true }
        } catch (err) {
            console.log(err)
            return { status: false, err: err }

        }
    }

    async delete(id) {
        var user = await this.findById(id)

        if (user == undefined) {
            return { status: false, err: "O usuário não existe" }
        }

        try {
            await knex.delete().where({ id: id }).table("users")
            return { status: true }
        } catch (err) {
            return { status: false, err: err }
        }
    }

    async changePassword(newPassword, id, token) {

        var hash = await bcrypt.hash(newPassword, 10)

        try {
            await knex.update({ password: hash }).where({ id: id }).table("users")
            await PasswordToken.setUsed(token)
        } catch (err) {
            return { status: false, err }
        }
    }

}

module.exports = new User()