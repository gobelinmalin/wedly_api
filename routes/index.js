const express = require("express");
const router = express.Router();

const users = require("./users");
const auth = require("./auth");
const teams = require("./teams");
const clients = require("./clients");

router.use("/users", users);
router.use("/auth", auth);
router.use("/teams", teams);
router.use("/clients", clients);

module.exports = router;
