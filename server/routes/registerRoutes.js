const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const connection = require("../database/connection");

// Rota de cadastro
router.post("/", async (req, res) => {
  const { nome, endereco, email, telefone, senha, tipo } = req.body;

  if (!nome || !endereco || !email || !senha || !tipo) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  // Verifica se tipo é válido
  const tiposValidos = ["gerente", "engenheiro", "estagiario"];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({ error: "Tipo inválido" });
  }

  try {
    const [existe] = await connection
      .promise()
      .query("SELECT * FROM Funcionário WHERE Email = ?", [email]);
    if (existe.length > 0) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Insere funcionário
    const [resultado] = await connection.promise().query(
      `INSERT INTO Funcionário (nome, endereco, Email, Telefone, senha)
         VALUES (?, ?, ?, ?, ?)`,
      [nome, endereco, email, telefone || null, senhaCriptografada]
    );

    const id = resultado.insertId;

    // Insere na tabela do tipo
    const tipoTabela = {
      gerente: "Gerente",
      engenheiro: "Engenheiro",
      estagiario: "Estagiário",
    };

    await connection.promise().query(
      `INSERT INTO ${tipoTabela[tipo]} (Funcionário_idFuncionário)
         VALUES (?)`,
      [id]
    );

    res.status(201).json({ message: "Cadastro realizado com sucesso", id });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;
