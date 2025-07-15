// src/pages/Login.jsx
import { useState } from "react";
import { TextField, Button, Typography, Alert, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ onTrocar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email,
        senha,
      });
      const { token, tipo } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("tipo", tipo);
      console.log("Login bem-sucedido. Redirecionando para /projetos");
      navigate("/projetos");
    } catch (err) {
      setErro("Credenciais inválidas");
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {erro && <Alert severity="error">{erro}</Alert>}
      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Senha"
        fullWidth
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <Button variant="contained" onClick={handleLogin}>
        Entrar
      </Button>
      <Typography variant="body2" align="center" color="text.secondary">
        Ainda não tem conta?{" "}
        <span
          onClick={onTrocar}
          style={{ color: "#6b9d30", cursor: "pointer", fontWeight: "bold" }}
        >
          Criar conta
        </span>
      </Typography>
    </Box>
  );
}
