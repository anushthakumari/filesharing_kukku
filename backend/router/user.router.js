const express = require("express");

const { register, login } = require("../controllers/user.controllers");

const router = express.Router();

router.route("/").post(register);
router.route("/login").post(login);

module.exports = router;
