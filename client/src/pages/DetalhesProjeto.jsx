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
  const [exibirFormularioExecucao, setExibirFormularioExecucao] =
    useState(false);
  const [execucaoData, setExecucaoData] = useState({
    execucao_inicio: "",
    execucao_fim: "",
  });
  const [vistoriaData, setVistoriaData] = useState({ Lmax: "", Vmax: "" });
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

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const dadosParaEnviar = {
      Previsão_inicio: previsaoData.previsao_inicio,
      Previsão_fim: previsaoData.previsao_fim,
      Projeto_idProjeto: id,
    };

    console.log("DADOS SENDO ENVIADOS PARA O BACKEND:", dadosParaEnviar);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/instalacoes`,
        dadosParaEnviar,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Instalação agendada com sucesso!");
      setExibirFormularioAgendamento(false); // Esconde o formulário
      fetchProjectData(); // Atualiza os dados na tela
    } catch (err) {
      console.error("ERRO DETALHADO DO AXIOS:", err.response);
      setError(err.response?.data?.message || "Erro ao agendar instalação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funções para controlar o formulário de EXECUÇÃO
  const handleExibirFormularioExecucao = () =>
    setExibirFormularioExecucao(true);
  const handleEsconderFormularioExecucao = () =>
    setExibirFormularioExecucao(false);

  const handleExecucaoChange = (e) => {
    setExecucaoData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExecucaoSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/instalacoes/${id}`,
        {
          Execucao_inicio: execucaoData.execucao_inicio,
          Execucao_fim: execucaoData.execucao_fim,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Execução da instalação registrada com sucesso!");
      setExibirFormularioExecucao(false); // Esconde o formulário
      fetchProjectData(); // Atualiza a tela
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao registrar execução.");
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
            {projeto?.PrevisaoInicio &&
              !projeto.ExecucaoInicio &&
              !exibirFormularioExecucao && (
                <Box display="flex" justifyContent="flex-end" mb={2}>
                  <Button
                    variant="contained"
                    onClick={handleExibirFormularioExecucao}
                  >
                    Registrar Execução
                  </Button>
                </Box>
              )}

            {/* Formulário de registro de execução */}
            {exibirFormularioExecucao && (
              <Card sx={{ borderRadius: "12px", boxShadow: 3, my: 4 }}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Registrar Datas de Execução
                  </Typography>
                  <form onSubmit={handleExecucaoSubmit}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <TextField
                        name="execucao_inicio"
                        label="Início da Execução"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        onChange={handleExecucaoChange}
                        required
                        fullWidth
                      />
                      <TextField
                        name="execucao_fim"
                        label="Fim da Execução"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        onChange={handleExecucaoChange}
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
                          onClick={handleEsconderFormularioExecucao}
                          color="secondary"
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Salvando..." : "Salvar Execução"}
                        </Button>
                      </Box>
                    </Box>
                  </form>
                </CardContent>
              </Card>
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
              {projeto?.PrevisaoInicio ? (
                projeto.Status !== "vistoriado" &&
                projeto.Status !== "aprovado" ? (
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
