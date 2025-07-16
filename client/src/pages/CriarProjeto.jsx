// src/pages/CriarProjeto.jsx
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useEffect, useState } from "react";
import Layout from "../layouts/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CriarProjeto() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    Nome: "",
    UniConsID: "",
    Cliente_CPF: "",
    ConcessionáriaID: "",
    PreçoFinal: "",
    VOC: "",
    Isc: "",
  });

  const [clientes, setClientes] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [concessionarias, setConcessionarias] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/clientes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("Erro ao buscar clientes", err));

    axios
      .get(`${import.meta.env.VITE_API_URL}/unidades`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUnidades(res.data))
      .catch((err) => console.error("Erro ao buscar unidades", err));

    axios
      .get(`${import.meta.env.VITE_API_URL}/concessionarias`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setConcessionarias(res.data))
      .catch((err) => console.error("Erro ao buscar concessionárias", err));
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/projetos`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Projeto criado com sucesso!");
      setTimeout(() => navigate("/projetos"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erro ao criar projeto. Verifique os dados."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout pageTitle="Criar Novo Projeto">
      <Box display="flex" justifyContent="center" my={4}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 600,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Novo Projeto
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Nome do Projeto"
                  name="Nome"
                  value={formData.Nome}
                  onChange={handleChange}
                  required
                />

                <FormControl fullWidth required>
                  <InputLabel>Unidade Consumidora</InputLabel>
                  <Select
                    name="UniConsID"
                    value={formData.UniConsID}
                    onChange={handleChange}
                    label="Unidade Consumidora"
                  >
                    {unidades.map((uni) => (
                      <MenuItem key={uni.NumeroID} value={uni.NumeroID}>
                        {uni.Nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth required>
                  <InputLabel>Cliente</InputLabel>
                  <Select
                    name="Cliente_CPF"
                    value={formData.Cliente_CPF}
                    onChange={handleChange}
                    label="Cliente"
                  >
                    {clientes.map((cli) => (
                      <MenuItem key={cli.CPF} value={cli.CPF}>
                        {cli.Nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Select com as concessionárias */}
                <FormControl fullWidth required>
                  <InputLabel>Concessionária</InputLabel>
                  <Select
                    name="ConcessionáriaID"
                    value={formData.ConcessionáriaID}
                    onChange={handleChange}
                    label="Concessionária"
                  >
                    {concessionarias.map((c) => (
                      <MenuItem key={c.CNPJ} value={c.CNPJ}>
                        {c.razaosocial}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Preço Final"
                  name="PreçoFinal"
                  type="number"
                  value={formData.PreçoFinal}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="VOC"
                  name="VOC"
                  value={formData.VOC}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Isc"
                  name="Isc"
                  value={formData.Isc}
                  onChange={handleChange}
                  required
                />

                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Criando..." : "Criar Projeto"}
                  </Button>
                </Box>
              </Box>
            </form>

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
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
