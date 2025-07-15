// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Container,
} from "@mui/material";
import axios from "axios";

export default function Login() {
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
      if (tipo === "gerente") navigate("/dashboard");
      else if (tipo === "engenheiro") navigate("/dashboard");
      else if (tipo === "estagiario") navigate("/dashboard");
      else navigate("/clientes"); // funcionário comum
    } catch (err) {
      setErro("Credenciais inválidas");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10} display="flex" flexDirection="column" gap={2}>
        <Typography variant="h5">Login - SGPUF</Typography>
        {erro && <Alert severity="error">{erro}</Alert>}
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <Button variant="contained" onClick={handleLogin}>
          Entrar
        </Button>
      </Box>
    </Container>
  );
}
