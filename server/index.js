const express = require("express");
const app = express();
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const registerRoutes = require("./routes/registerRoutes");

app.use(express.json());
app.use("/login", authRoutes);
app.use("/register", registerRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
