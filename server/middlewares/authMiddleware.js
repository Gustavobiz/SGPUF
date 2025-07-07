const jwt = require("jsonwebtoken");

// midleware basico: apenas verifica o token
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Token não fornecido" });

  const [, token] = authHeader.split(" ");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, tipo }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// midleware tipo: verifica o tipo de funcionário
function autorizar(...tiposPermitidos) {
  return (req, res, next) => {
    if (!req.user || !tiposPermitidos.includes(req.user.tipo)) {
      return res.status(403).json({ error: "Acesso negado" });
    }
    next();
  };
}

module.exports = { autenticar, autorizar };
