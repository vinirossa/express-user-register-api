const express = require("express")
const app = express()
const router = express.Router()
const HomeController = require("../controllers/HomeController")
const UserController = require('../controllers/UserController')
const AdminAuth = require('../middlewares/AdminAuth');

router.get("/", HomeController.index)

router.post("/user", AdminAuth, UserController.create)
router.get("/users", AdminAuth, UserController.findAll)
router.get("/user/:id", AdminAuth, UserController.findById)
router.put("/user/:id", AdminAuth, UserController.update)
router.delete("/user/:id", AdminAuth, UserController.delete)
router.post("/recoverpassword", UserController.recoverPassword)
router.put("/changepassword", UserController.changePassword)
router.post("/login", UserController.login)


module.exports = router