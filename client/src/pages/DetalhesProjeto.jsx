// Salve como: src/pages/DetalhesProjeto.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import Layout from "../layouts/Layout";
import axios from "axios";

export default function DetalhesProjeto() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const tipo = localStorage.getItem("tipo");

  const [projeto, setProjeto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [vistoriaData, setVistoriaData] = useState({ Lmax: "", Vmax: "" });

  // Estado para controlar a visibilidade do formulário de agendamento
  const [exibirFormularioAgendamento, setExibirFormularioAgendamento] =
    useState(false);
  const [previsaoData, setPrevisaoData] = useState({
    previsao_inicio: "",
    previsao_fim: "",
  });

  const fetchProjectData = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/projetos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProjeto(res.data);
      })
      .catch(() => {
        setError("Não foi possível carregar os dados do projeto.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjectData();
  }, [id, token]);

  const handleMudarStatus = async (novoStatus) => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/projetos/${id}/status`,
        { status: novoStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Projeto atualizado para "${novoStatus}" com sucesso!`);
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.message || `Erro ao atualizar status.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVistoriaInputChange = (e) => {
    const { name, value } = e.target;
    setVistoriaData((prev) => ({ ...prev, [name]: value }));
  };
  // Funções para controlar o formulário de agendamento
  const handleExibirFormulario = () => setExibirFormularioAgendamento(true);
  const handleEsconderFormulario = () => setExibirFormularioAgendamento(false);

  const handlePrevisaoChange = (e) => {
    setPrevisaoData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAgendarSubmit = async (e) => {
    e.preventDefault();

    // 1. PREPARAMOS O ESTADO PARA O ENVIO (APENAS UMA VEZ)
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    // 2. CRIAMOS A VARIÁVEL COM OS DADOS CORRETOS
    const dadosParaEnviar = {
      Previsão_inicio: previsaoData.previsao_inicio,
      Previsão_fim: previsaoData.previsao_fim,
      Projeto_idProjeto: id,
    };

    // DEBUG: Mostra no console exatamente o que será enviado
    console.log("DADOS SENDO ENVIADOS PARA O BACKEND:", dadosParaEnviar);

    try {
      // 3. ENVIAMOS A VARIÁVEL QUE ACABAMOS DE CRIAR
      await axios.post(
        `${import.meta.env.VITE_API_URL}/instalacoes`,
        dadosParaEnviar,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Instalação agendada com sucesso!");
      setExibirFormularioAgendamento(false); // Esconde o formulário
      fetchProjectData(); // Atualiza os dados na tela
    } catch (err) {
      // Log de erro mais detalhado para o caso de ainda falhar
      console.error("ERRO DETALHADO DO AXIOS:", err.response);
      setError(err.response?.data?.message || "Erro ao agendar instalação.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSubmitVistoria = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/vistorias`,
        { projetoId: id, ...vistoriaData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(
        "Vistoria cadastrada com sucesso! O projeto foi atualizado para 'Vistoriado'."
      );
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar vistoria.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout
      pageTitle={projeto ? `Projeto: ${projeto.Nome}` : "Detalhes do Projeto"}
    >
      <Box display="flex" justifyContent="center" my={4}>
        <Box maxWidth="700px" width="100%">
          {/* Card com Detalhes do Projeto */}
          {projeto && (
            <Card
              sx={{
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: 3,
                mb: 4,
              }}
            >
              <CardContent>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {projeto.Nome}
                </Typography>
                <Typography>Status: {projeto.Status}</Typography>
                <Typography>Cliente: {projeto.ClienteNome}</Typography>
                <Typography>
                  Concessionária: {projeto.ConcessionariaNome}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Agendamento e Execução
                </Typography>
                <Typography>
                  <b>Previsão de Início:</b>{" "}
                  {projeto.PrevisaoInicio
                    ? new Date(projeto.PrevisaoInicio).toLocaleDateString(
                        "pt-BR"
                      )
                    : "Pendente"}
                </Typography>
                <Typography>
                  <b>Previsão de Fim:</b>{" "}
                  {projeto.PrevisaoFim
                    ? new Date(projeto.PrevisaoFim).toLocaleDateString("pt-BR")
                    : "Pendente"}
                </Typography>
                <Typography>
                  <b>Início da Execução:</b>{" "}
                  {projeto.ExecucaoInicio
                    ? new Date(projeto.ExecucaoInicio).toLocaleDateString(
                        "pt-BR"
                      )
                    : "Pendente"}
                </Typography>
                <Typography>
                  <b>Fim da Execução:</b>{" "}
                  {projeto.ExecucaoFim
                    ? new Date(projeto.ExecucaoFim).toLocaleDateString("pt-BR")
                    : "Pendente"}
                </Typography>
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
              </CardContent>
            </Card>
          )}

          <Box display="flex" gap={2} flexWrap="wrap" justifyContent="flex-end">
            {/* Botão "Marcar Instalação" ou o formulário, aparecem condicionalmente */}
            {!projeto?.PrevisaoInicio && !exibirFormularioAgendamento && (
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={handleExibirFormulario}
                >
                  Marcar Instalação
                </Button>
              </Box>
            )}

            {exibirFormularioAgendamento && (
              <Card sx={{ borderRadius: "12px", boxShadow: 3, my: 4 }}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Agendar Previsão da Instalação
                  </Typography>
                  <form onSubmit={handleAgendarSubmit}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <TextField
                        name="previsao_inicio"
                        label="Previsão de Início"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        onChange={handlePrevisaoChange}
                        required
                        fullWidth
                      />
                      <TextField
                        name="previsao_fim"
                        label="Previsão de Fim"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        onChange={handlePrevisaoChange}
                        required
                        fullWidth
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 2,
                          mt: 1,
                        }}
                      >
                        <Button
                          onClick={handleEsconderFormulario}
                          color="secondary"
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Agendando..." : "Agendar"}
                        </Button>
                      </Box>
                    </Box>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Botões para INICIAR e FINALIZAR a instalação (aparecem após agendamento) */}
            {projeto?.PrevisaoInicio && (
              <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
                {!projeto.ExecucaoInicio && (
                  <Button variant="contained">Iniciar Execução</Button>
                )}
                {projeto.ExecucaoInicio && !projeto.ExecucaoFim && (
                  <Button variant="contained" color="warning">
                    Finalizar Execução
                  </Button>
                )}
              </Box>
            )}

            {/* Ações específicas do GERENTE */}
            {tipo === "gerente" && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleMudarStatus("finalizado")}
                disabled={isSubmitting || projeto?.Status === "finalizado"}
              >
                {isSubmitting ? "Finalizando..." : "Finalizar Projeto"}
              </Button>
            )}

            {/* Ações específicas do ESTAGIÁRIO */}
            {tipo === "estagiario" && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleMudarStatus("homologado")}
                disabled={isSubmitting || projeto?.Status === "homologado"}
              >
                {isSubmitting ? "Homologando..." : "Homologar"}
              </Button>
            )}
          </Box>

          {/* Visão do ENGENHEIRO*/}
          {tipo === "engenheiro" && (
            <Box mt={2}>
              {" "}
              {/* Adicionado um espaçamento para não colar nos botões de cima */}
              {projeto && projeto.ExecucaoFim ? (
                projeto.Status !== "Vistoriado" &&
                projeto.Status !== "Aprovado" ? (
                  <Card sx={{ borderRadius: "12px", boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Realizar Vistoria Técnica
                      </Typography>
                      <form onSubmit={handleSubmitVistoria}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap={2}
                          mt={2}
                        >
                          <TextField
                            label="Lmax"
                            name="Lmax"
                            value={vistoriaData.Lmax}
                            onChange={handleVistoriaInputChange}
                            required
                            fullWidth
                          />
                          <TextField
                            label="Vmax"
                            name="Vmax"
                            value={vistoriaData.Vmax}
                            onChange={handleVistoriaInputChange}
                            required
                            fullWidth
                          />
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Salvando..." : "Salvar Vistoria"}
                          </Button>
                        </Box>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <Alert severity="success">
                    Este projeto já foi vistoriado.
                  </Alert>
                )
              ) : (
                <Alert severity="warning">
                  Aguardando conclusão da instalação para poder realizar a
                  vistoria.
                </Alert>
              )}
            </Box>
          )}

          {/* Mensagens de feedback */}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Box>
    </Layout>
  );
}
