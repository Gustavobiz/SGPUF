const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const connection = require("../database/connection");

router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  const query = `SELECT * FROM Funcionário WHERE Email = ?`;

  connection.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor" });
    if (results.length === 0)
      return res.status(401).json({ error: "Usuário não encontrado" });

    const user = results[0];

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) return res.status(401).json({ error: "Senha inválida" });

    // Determina o tipo de funcionário
    let tipo = "funcionario";
    const checkTipos = [
      { tabela: "Gerente", tipo: "gerente" },
      { tabela: "Engenheiro", tipo: "engenheiro" },
      { tabela: "Estagiário", tipo: "estagiario" },
    ];

    for (const check of checkTipos) {
      const [rows] = await connection
        .promise()
        .query(
          `SELECT * FROM ${check.tabela} WHERE Funcionário_idFuncionário = ?`,
          [user.idFuncionário]
        );
      if (rows.length > 0) {
        tipo = check.tipo;
        break;
      }
    }

    const token = jwt.sign(
      { id: user.idFuncionário, email: user.Email, tipo },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, tipo });
  });
});

module.exports = router;
