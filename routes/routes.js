let express = require("express");
let HomeController = require("../controllers/HomeController");
let UserController = require("../controllers/UserController");

// let app = express();
let router = express.Router();

router.get('/', HomeController.index);
router.post('/user', UserController.create);
router.get('/user', UserController.index);
router.get('/user/:id', UserController.findUser);
router.put('/user', UserController.edit);
router.delete('/user/:id', UserController.remove);
router.post('/recoverpassword', UserController.recoverPassword);
router.post('/changepassword', UserController.changePassword);

module.exports = router;