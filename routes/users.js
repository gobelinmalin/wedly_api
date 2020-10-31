const express = require("express");
const router = express.Router();
const connection = require("../config");
const bcrypt = require("bcrypt");

// ajout d"une donnée
// Create user
router.post("/", (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);
  const formData = {
    email: req.body.email,
    password: hash,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };
  connection.query("INSERT INTO user SET ?", [formData], (err, result) => {
    if (err) {
      res.status(500).send("Erreur lors de l'insertion d'un utilisateur");
    } else {
      res.sendStatus(200);
    }
  });
});

// récupération de liste
router.get("/", (req, res) => {
  connection.query("SELECT * FROM user", (err, results) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(results);
    }
  });
});

// récupération d"une donnée
router.get("/:id", (req, res) => {
  const idParams = req.params.id;
  connection.query(
    "SELECT * FROM user WHERE id = ?",
    idParams,
    (err, results) => {
      if (err) {
        res.sendStatus(err);
      } else {
        res.json(results);
      }
    }
  );
});

// modification d"une donnée
router.put("/:id", (req, res) => {
  const idParams = req.params.id;
  const data = req.body;

  connection.query(
    "UPDATE user SET ? WHERE id = ?",
    [data, idParams],
    (err, results) => {
      if (err) {
        res.sendStatus(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// suppression d"une donnée
router.delete("/:id", (req, res) => {
  const idParams = req.params.id;

  connection.query(
    "DELETE FROM user WHERE id = ?",
    idParams,
    (err, results) => {
      if (err) {
        res.sendStatus(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// recupération liste des équipes par rapport à un user
router.get("/:idUser/equipes", (req, res) => {
  const idUser = req.params.idUser;

  connection.query(
    "SELECT e.lastname, e.firstname FROM equipe as e JOIN user as u ON u.id = e.id_user WHERE u.id = ? ",
    idUser,
    (err, results) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    }
  );
});

module.exports = router;
