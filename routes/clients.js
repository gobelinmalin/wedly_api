const express = require("express");
const router = express.Router();
const connection = require("../config");

// ajout d"une donnée
router.post("/", (req, res) => {
  const data = req.body;

  connection.query("INSERT INTO client SET ?", data, (err, results) => {
    if (err) {
      res.sendStatus(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// récupération de liste
router.get("/", (req, res) => {
  connection.query("SELECT * FROM client", (err, results) => {
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
    "SELECT * FROM client WHERE id = ?",
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
    "UPDATE client SET ? WHERE id = ?",
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
    "DELETE FROM client WHERE id = ?",
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
router.get("/:id/appointments", (req, res) => {
  const idUser = req.params.id;

  connection.query(
    "SELECT * FROM appointment as a JOIN user as u ON u.id = a.id_user JOIN client as c ON c.id = a.id_client WHERE c.id = ? ",
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
