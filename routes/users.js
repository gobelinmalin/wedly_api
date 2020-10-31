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
  connection.query(
    "SELECT id, firstname, lastname, email, createAt, portable FROM user",
    (err, results) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    }
  );
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
router.get("/:idUser/teams", (req, res) => {
  const idUser = req.params.idUser;

  connection.query(
    "SELECT t.id_suppleant FROM team as t JOIN user as u ON u.id = t.id_chef WHERE u.id = ? ",
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

// recupération liste des équipes par rapport à un user
router.get("/:idUser/clients", (req, res) => {
  const idUser = req.params.idUser;

  connection.query(
    "SELECT c.id, c.firstname, c.lastname, c.createAt, c.age, c.profession, c.profession2, c.family_situation, c.isRecommendation, c.dateR1, c.client_recommendation, c.stop_stadeR1, c.objectif, c.id_user, c.email, c.portable FROM client as c JOIN user as u ON u.id = c.id_user WHERE u.id = ? ",
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
