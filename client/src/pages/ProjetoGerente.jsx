import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import Layout from "../layouts/Layout";
import axios from "axios";

export default function ProjetoGerente() {
  // Hook para pegar os parâmetros da URL. Se a URL for /projetos/1, 'id' será "1".
  const { id } = useParams();
  const token = localStorage.getItem("token");

  // Estados para controlar os dados, o carregamento e os erros
  const [projeto, setProjeto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Este 'useEffect' roda sempre que o componente é montado ou o 'id' na URL muda.
  useEffect(() => {
    // Reseta o estado para uma nova busca
    setProjeto(null);
    setLoading(true);
    setError("");

    // A chamada à sua API, usando o 'id' da URL
    axios
      .get(`${import.meta.env.VITE_API_URL}/projetos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Se a chamada for bem-sucedida, armazena os dados do projeto no estado
        setProjeto(res.data);
      })
      .catch((err) => {
        // Se der erro, armazena a mensagem de erro
        console.error("Erro ao buscar detalhes do projeto:", err);
        setError("Não foi possível carregar os dados do projeto.");
      })
      .finally(() => {
        // Independentemente de sucesso ou erro, para de carregar
        setLoading(false);
      });
  }, [id, token]); // O array de dependências garante que isso rode de novo se o ID mudar

  // Renderização condicional enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  // Renderização se ocorrer um erro na busca
  if (error) {
    return (
      <Layout pageTitle="Erro">
        <Alert severity="error">{error}</Alert>
      </Layout>
    );
  }

  // Renderização principal com os dados reais do projeto
  return (
    <Layout pageTitle={`Detalhes do Projeto: ${projeto.Nome}`}>
      <Box display="flex" justifyContent="center" alignItems="center" my={4}>
        <Box
          p={4}
          maxWidth="600px"
          width="100%"
          bgcolor="#fff"
          borderRadius="12px"
          boxShadow={2}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {projeto.Nome}
          </Typography>
          <Typography>Status: {projeto.Status}</Typography>
          <Typography>Cliente: {projeto.ClienteNome}</Typography>
          <Typography>Concessionária: {projeto.ConcessionariaNome}</Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Unidade Consumidora
          </Typography>
          <Typography>Nome: {projeto.UnidadeNome}</Typography>
          <Typography>Latitude: {projeto.Latitude}</Typography>
          <Typography>Longitude: {projeto.Longitude}</Typography>
          <Typography>Potência: {projeto.Potência}</Typography>
          <Typography>Tipo de Cabo: {projeto.TipoCabo}</Typography>
          <Typography>Bitola: {projeto.Bitola}</Typography>

          <Box mt={4} display="flex" gap={2} flexWrap="wrap">
            <Button variant="outlined" color="success">
              Marcar Instalação
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => alert("Finalizar Projeto")}
              disabled={projeto.Status === "finalizado"}
            >
              Finalizar Projeto
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
