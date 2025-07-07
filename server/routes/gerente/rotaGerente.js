// server/routes/rotaGerente.js
const express = require("express");
const router = express.Router();
const { autenticar, autorizar } = require("../../middlewares/authMiddleware");

router.get("/", autenticar, autorizar("gerente"), (req, res) => {
  res.json({
    message: "Bem-vindo, gerente!",
    usuario: req.user,
  });
});

module.exports = router;
