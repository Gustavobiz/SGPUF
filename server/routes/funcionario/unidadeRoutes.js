const express = require("express");
const router = express.Router();
const connection = require("../../config/db");
const { autenticar } = require("../../middlewares/authMiddleware");

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
router.get("/", autenticar, async (req, res) => {
  try {
    const [rows] = await connection
      .promise()
      .query("SELECT NumeroID, Nome FROM `Unidade Consumidora`");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar unidades:", error);
    res.status(500).json({ error: "Erro ao buscar unidades" });
  }
});

module.exports = router;
