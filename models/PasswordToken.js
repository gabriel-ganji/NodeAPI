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
                    token: token //aternativa simples para UUID
                }).table("passwordTokens");

                return { status: true, token: token };

            } catch (error) {

                console.log(error);
                return { status: false, error: error };

            }

        } else {

            return { status: false, error: "O e-mail inserido não existe no banco de dados!" };

        }

    }

    async validate(token) {

        try {

            let result = await knex.select().where({ token: token }).table("passwordTokens");

            if (result.length > 0) {

                let token = result[0];

                if (token.used) {
                    return { status: false };
                } else {
                    return { status: true, token: token };
                }

            } else {
                return { status: false };
            }

        } catch (error) {
            console.log(error);
            return { status: false };
        }

    }

    async setUsed(token) {
        await knex.update({ used: 1 }).where({ token: token }).table("passwordTokens");
    }

}

module.exports = new PasswordToken();