const express = require("express");
const router = express.Router();
const connection = require("../config/db");
const autenticar = require("../middleware/autenticar");

router.post("/", autenticar, async (req, res) => {
  const { NumeroID, Longitude, Latitude, TipoCabo, Nome, Potência, Bitola } =
    req.body;

  try {
    await connection.promise().query(
      `INSERT INTO \`Unidade Consumidora\` 
      (NumeroID, Longitude, Latitude, TipoCabo, Nome, Potência, Bitola)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [NumeroID, Longitude, Latitude, TipoCabo, Nome, Potência, Bitola]
    );
    res
      .status(201)
      .json({ message: "Unidade consumidora cadastrada com sucesso" });
  } catch (error) {
    console.error("Erro ao cadastrar unidade:", error);
    res.status(500).json({ error: "Erro ao cadastrar unidade" });
  }
});

module.exports = router;
