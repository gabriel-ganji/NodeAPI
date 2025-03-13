let User = require("../models/User");

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

}

module.exports = new UserController();