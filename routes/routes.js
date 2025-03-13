let express = require("express");
let HomeController = require("../controllers/HomeController");
let UserController = require("../controllers/UserController");

let app = express();
let router = express.Router();

router.get('/', HomeController.index);
router.post('/user', UserController.create);

module.exports = router;