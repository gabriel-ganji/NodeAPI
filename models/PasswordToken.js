const knex = require("../database/connection");
let User = require("../models/User");

class PasswordToken {
    async create(email) {

        let user = await User.findByEmail(email);

        if (user != undefined) {

            try {

                let token = Date.now();

                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token //aternatina simples para UUID
                }).table("passwordTokens");

                return { status: true, token: token }

            } catch (error) {

                console.log(error);
                return { status: false, error: error };

            }

        } else {

            return { status: false, error: "O e-mail inserido não existe no banco de dados!" };

        }

    }


}

module.exports = new PasswordToken();