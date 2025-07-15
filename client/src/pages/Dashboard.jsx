// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

export default function Dashboard() {
  const tipo = localStorage.getItem("tipo");
  const navigate = useNavigate();

  useEffect(() => {
    if (!tipo) navigate("/");
  }, [tipo]);

  return (
    <Box p={4}>
      <Typography variant="h4">Bem-vindo ao SGPUF!</Typography>
      <Typography variant="h6" gutterBottom>
        Tipo de usuário: {tipo}
      </Typography>

      {tipo === "gerente" && (
        <Button variant="contained" onClick={() => navigate("/projetos")}>
          Ver Projetos
        </Button>
      )}

      {tipo === "engenheiro" && (
        <Button variant="contained">Registrar Vistoria</Button>
      )}

      {tipo === "estagiario" && (
        <Button variant="contained">Homologar Projeto</Button>
      )}

      {tipo === "funcionario" && (
        <Button variant="contained" onClick={() => navigate("/clientes")}>
          Cadastrar Cliente
        </Button>
      )}
    </Box>
  );
}
