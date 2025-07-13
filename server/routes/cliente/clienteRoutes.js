const express = require("express");
const router = express.Router();
const connection = require("../../config/db");
const { autenticar } = require("../../middlewares/authMiddleware");

router.post("/", autenticar, async (req, res) => {
  const { CPF, endereco, Nome } = req.body;

  try {
    await connection
      .promise()
      .query("INSERT INTO Cliente (CPF, endereco, Nome) VALUES (?, ?, ?)", [
        CPF,
        endereco,
        Nome,
      ]);
    res.status(201).json({ message: "Cliente cadastrado com sucesso" });
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    res.status(500).json({ error: "Erro ao cadastrar cliente" });
  }
});

module.exports = router;
