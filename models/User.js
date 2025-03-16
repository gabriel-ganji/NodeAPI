const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User {

    async findAll() {

        try {
            let result = await knex.select(["id", "email", "role", "name"]).table("users");
            return result;
        } catch (error) {
            console.log(error);
            return []
        }

    }

    async findById(id) {
        try {

            let result = await knex.select(["id", "email", "role", "name"]).where({ id: id }).table("users");

            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }

        } catch (error) {
            console.log(error);
            return undefined;
        }

    }

    async findByEmail(email) {
        try {

            let result = await knex.select(["id", "email", "role", "name"]).where({ email: email }).table("users");

            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }

        } catch (error) {
            console.log(error);
            return undefined;
        }

    }

    async new(email, name, password) {
        try {

            let hash = await bcrypt.hash(password, 12);
            await knex.insert({ email, name, password: hash, role: 0 }).table("users");

        } catch (error) {
            console.log(error);
        }
    }

    async findEmail(email) {

        try {
            let result = await knex.select("*").from("users").where({ email: email });
            if (result.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }

    }

    async update(id, email, name, role) {

        let user = await this.findById(id);

        if (user != undefined) {

            let editUser = {};

            if (email != undefined) {
                if (email != user.email) {
                    let result = await this.findEmail(email);

                    if (!result) {
                        editUser.email = email;
                    } else {
                        return { status: false, error: "O e-mail já está cadastrado!" };
                    }
                }
            }

            if (name != undefined) {
                editUser.name = name;
            }

            if (role != undefined) {
                editUser.role = role;
            }

            try {
                await knex.update(editUser).where({ id: id }).table("users");
                return { status: true };
            } catch (error) {
                return { status: false, error: error };
            }


        } else {
            return { status: false, error: "O usuário não existe!" };
        }

    }

    async delete(id) {
        
        let user = await this.findById(id);
        
        if(user != undefined) {

            try{
                await knex.delete().where({id: id}).table("users");
                return {status: true};
            } catch(error) {
                return { status: false, error: error};
            }
           
        } else {
            return { status: false, error: "O usuário não existe!"};
        }

    }

    async changePassword(newPassword, id, token) {
        let hash = await bcrypt.hash(newPassword, 12);
        await knex.update({ password: hash }).where({ id: id }).table("users");
        await PasswordToken.setUsed(token);
    }

}

module.exports = new User();