const express = require("express");
const router = express.Router();
const connection = require("../../config/db");
const { autenticar } = require("../../middlewares/authMiddleware");

router.post("/", autenticar, async (req, res) => {
  const { CNPJ, telefone, endereco, razaosocial, email } = req.body;
  //teste  ff  ddd
  try {
    await connection.promise().query(
      `INSERT INTO Concessionária (CNPJ, telefone, endereço, razaosocial, email)
       VALUES (?, ?, ?, ?, ?)`,
      [CNPJ, telefone, endereco, razaosocial, email]
    );
    res.status(201).json({ message: "Concessionária cadastrada com sucesso" });
  } catch (error) {
    console.error("Erro ao cadastrar concessionária:", error);
    res.status(500).json({ error: "Erro ao cadastrar concessionária" });
  }
});

module.exports = router;
