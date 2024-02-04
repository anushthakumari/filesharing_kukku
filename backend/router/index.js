const express = require("express");

const userRouter = require("./user.router");
const filesRouter = require("./files.router");

const router = express.Router();

router.use("/users", userRouter);
router.use("/files", filesRouter);

module.exports = router;
