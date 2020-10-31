const express = require("express");
const router = express.Router();
const connection = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const formData = {
    email: req.body.email,
    password: req.body.password,
  };
  connection.query(
    "SELECT * FROM user WHERE email = ?",
    [formData.email],
    (err, user) => {
      if (err) {
        res.status(500).send("Erreur mauvais utilisateur"); // no user found with this email
      } else {
        const isSamePass = bcrypt.compareSync(
          formData.password,
          user[0].password
        );
        if (!isSamePass) {
          res.status(500).send("Mot de passe incorrect");
        } else {
          // 'secretKey' will be in .env file => here, process.env.TOKEN_SECRET_KEY
          jwt.sign({user}, process.env.JWT, (err, token) => {
            if (err) {
              res.status(500).send("Token non crée");
            } else {
              res.json({
                token,
                email: user[0].email,
                lastname: user[0].lastname,
                firstname: user[0].firstname,
              });
            }
          });
        }
      }
    }
  );
});

router.post("/", verifyToken, (req, res) => {
  //jwt.verify etc ...
  jwt.verify(req.token, process.env.JWT, (err, authData) => {
    if (err) {
      res.status(500).send("Access denied");
    } else {
      res.json({
        id: authData.user[0].id,
        firstname: authData.user[0].firstname,
        lastname: authData.user[0].lastname,
        createAt: authData.user[0].createAt,
        iat: authData.iat,
      });
    }
  });
});

function verifyToken(req, res, next) {
  // recupérer le token dans POSTMAN Authorisation array with text, token
  const bearerToken = req.headers["authorization"];
  if (typeof bearerToken !== "undefined") {
    const bearer = bearerToken.split(" ");
    req.token = bearer[1];
    // next middleware
    next();
  } else {
    res.status(500).send("Pas de token");
  }
}
module.exports = router;
