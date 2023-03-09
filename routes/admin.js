const router = require("express").Router();
const adminControllers = require("../controllers/admin");
const isAuth = require("../middlewares/is-auth");
const isAdmin = require("../middlewares/is-admin");
router.get("/users", isAuth, isAdmin, adminControllers.listUsers);

module.exports = router;
