const knex = require("../database/connection");
const bcrypt = require("bcrypt");

class User {

    async new(email, name, password){
        try {

            let hash = await bcrypt.hash(password, 12);
            await knex.insert({ email, name, password: hash, role: 0 }).table("users");

        } catch(error) {
            console.log(error);
        }
    }

    async findEmail(email) {

        try {
            let result = await knex.select("*").from("users").where({email: email});
            if(result.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch(error) {
            console.log(error);
            return false;
        }
        
    }

}

module.exports = new User();