let User = require("../models/User");
let PasswordToken = require("../models/PasswordToken");
const bcrypt = require("bcrypt");

let jwt = require("jsonwebtoken");
let secret = "gabrieru03282002";

class UserController {

    async index(req, res) {
        let users = await User.findAll();
        res.json(users);
    }

    async findUser(req, res) {
        let id = req.params.id;
        let user = await User.findById(id);
        if (user === undefined) {
            res.status(404);
            res.json({});
        } else {
            res.status(200);
            res.json(user);
        }
    }

    async create(req, res) {

        let { email, password, name } = req.body;

        if (email === undefined) {
            res.status(400);
            res.json({ error: "O e-mail é inválido!" })
        }

        if (name === undefined) {
            res.status(400);
            res.json({ error: "O nome é inválido!" })
        }

        if (password === undefined) {
            res.status(400);
            res.json({ error: "A senha é inválida!" })
        }

        await User.findEmail(email);

        let emailExists = await User.findEmail(email);

        if (emailExists) {
            res.status(406);
            res.json({ error: "O e-mail já está cadastrado!" });
            return;
        }

        await User.new(email, name, password);

        res.status(200);
        res.send("Pegando o corpo da requisição");

    }

    async edit(req, res) {
        let { id, name, role, email } = req.body;
        let result = await User.update(id, email, name, role);
        if (result != undefined) {
            if (result.status) {
                res.status(200);
                res.send("Tudo ok!");
            } else {
                res.status(406);
                res.send(result.error);
            }
        } else {
            res.status(406);
            res.send(result.error);
        }

    }

    async remove(req, res) {

        let id = req.params.id;

        let result = await User.delete(id);

        if (result.status) {
            res.status(200);
            res.send("Usuário deletado com sucesso!");
        } else {
            res.status(406);
            res.send(result.error);
        }

    }

    async recoverPassword(req, res) {

        let email = req.body.email;
        let result = await PasswordToken.create(email);

        if (result.status) {
            console.log(result.token);
            res.status(200);
            res.send(String(result.token));
        } else {
            res.status(406);
            res.send(result.error);
        }

    }

    async changePassword(req, res) {

        let token = req.body.token;
        let password = req.body.password;

        let isTokenValid = await PasswordToken.validate(token);

        if (isTokenValid.status) {
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
            res.status(200);
            res.send("Senha alterada!");
        } else {
            res.status(406);
            res.send("Token inválido!");
        }

    }

    async login(req, res) {

        let { email, password } = req.body;
        let user = await User.findByEmail(email);

        if (user != undefined) {

            let result = await bcrypt.compare(password, user.password);

            if (result) {

                let token = jwt.sign({ email: user.email, role: user.role }, secret);
                res.status(200);
                res.json({ token: token });

            } else {

                res.status(406);
                res.send("Senha incorreta!");

            }

        } else {

            res.json({ status: false });

        }

    }

}

module.exports = new UserController();