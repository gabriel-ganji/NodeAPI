class UserController {
    async index(req, res){

    }

    async create(req, res){
        
        let { email, name, password } = req.body;

        if( email === undefined ) {
            res.status(400);
            res.json({ error: "O e-mail é inválido!" })
        }

        if( name === undefined ) {
            res.status(400);
            res.json({ error: "O nome é inválido!" })
        }

        if( password === undefined ) {
            res.status(400);
            res.json({ error: "A senha é inválida!" })
        }

        res.status(200);
        res.send("Pegando o corpo da requisição");

    }
}

module.exports = new UserController();