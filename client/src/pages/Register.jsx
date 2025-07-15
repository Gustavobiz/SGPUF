// src/pages/Register.jsx
import { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import axios from "axios";

export default function Register({ onTrocar }) {
  const [dados, setDados] = useState({
    nome: "",
    endereco: "",
    email: "",
    telefone: "",
    senha: "",
    tipo: "",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/register`, dados);
      setSucesso("Cadastro realizado com sucesso! Faça login.");
      setErro("");
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao cadastrar");
      setSucesso("");
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {erro && <Alert severity="error">{erro}</Alert>}
      {sucesso && <Alert severity="success">{sucesso}</Alert>}
      <TextField name="nome" label="Nome" fullWidth onChange={handleChange} />
      <TextField
        name="endereco"
        label="Endereço"
        fullWidth
        onChange={handleChange}
      />
      <TextField name="email" label="Email" fullWidth onChange={handleChange} />
      <TextField
        name="telefone"
        label="Telefone"
        fullWidth
        onChange={handleChange}
      />
      <TextField
        name="senha"
        label="Senha"
        type="password"
        fullWidth
        onChange={handleChange}
      />
      <TextField
        name="tipo"
        label="Tipo"
        select
        fullWidth
        onChange={handleChange}
      >
        <MenuItem value="gerente">Gerente</MenuItem>
        <MenuItem value="engenheiro">Engenheiro</MenuItem>
        <MenuItem value="estagiario">Estagiário</MenuItem>
      </TextField>
      <Button variant="contained" onClick={handleRegister}>
        Cadastrar
      </Button>
      <Typography variant="body2" align="center" color="text.secondary">
        Já tem uma conta?{" "}
        <span
          onClick={onTrocar}
          style={{ color: "#6b9d30", cursor: "pointer", fontWeight: "bold" }}
        >
          Entrar
        </span>
      </Typography>
    </Box>
  );
}
