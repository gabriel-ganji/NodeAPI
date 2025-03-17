let express = require("express");
let HomeController = require("../controllers/HomeController");
let UserController = require("../controllers/UserController");

// let app = express();
let router = express.Router();
let AdminAuth = require("../middleware/AdminAuth");
router.get('/', HomeController.index);
router.post('/user', UserController.create);
router.get('/user', AdminAuth, UserController.index);
router.get('/user/:id', AdminAuth, UserController.findUser);
router.put('/user', AdminAuth, UserController.edit);
router.delete('/user/:id', AdminAuth, UserController.remove);
router.post('/recoverpassword', UserController.recoverPassword);
router.post('/changepassword', UserController.changePassword);
router.post('/login', UserController.login);

module.exports = router;