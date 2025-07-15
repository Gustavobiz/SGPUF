// src/pages/ProjetoGerente.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, Card } from "@mui/material";
import axios from "axios";

export default function ProjetoGerente() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [projeto, setProjeto] = useState(null);
  const [unidade, setUnidade] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/projetos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProjeto(res.data.projeto);
        setUnidade(res.data.unidade);
      })
      .catch((err) => console.error("Erro ao buscar projeto", err));
  }, [id]);

  const finalizarProjeto = () => {
    axios
      .patch(
        `${import.meta.env.VITE_API_URL}/projetos/${id}/finalizar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Projeto finalizado com sucesso");
        setProjeto({ ...projeto, Status: "finalizado" });
      })
      .catch(() => alert("Erro ao finalizar projeto"));
  };

  if (!projeto || !unidade) return <Typography>Carregando...</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Projeto: {projeto.Nome}
      </Typography>
      <Typography>Status: {projeto.Status}</Typography>

      <Box mt={3}>
        <Typography variant="h6">Unidade Consumidora</Typography>
        <Typography>Endereço: {unidade.endereco}</Typography>
        <Typography>Latitude: {unidade.Latitude}</Typography>
        <Typography>Longitude: {unidade.Longitude}</Typography>
      </Box>

      <Box mt={3} display="flex" gap={2}>
        <Button
          variant="contained"
          sx={{ background: "#b6f566", color: "#000" }}
        >
          Gerar Documentos
        </Button>
        <Button
          variant="outlined"
          sx={{ borderColor: "#6b9d30", color: "#6b9d30" }}
        >
          Marcar Instalação
        </Button>
        <Button variant="outlined" color="primary">
          Editar Informações
        </Button>
        <Button
          variant="contained"
          sx={{ background: "#202027", color: "#fff" }}
          onClick={finalizarProjeto}
          disabled={projeto.Status === "finalizado"}
        >
          Finalizar Projeto
        </Button>
      </Box>
    </Box>
  );
}
