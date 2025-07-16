// src/pages/CriarProjeto.jsx
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useState } from "react";
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

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        <Card sx={{ width: "100%", maxWidth: 600, boxShadow: 3 }}>
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
                <TextField
                  label="ID Unidade Consumidora"
                  name="UniConsID"
                  value={formData.UniConsID}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="CPF do Cliente"
                  name="Cliente_CPF"
                  value={formData.Cliente_CPF}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="CNPJ da Concessionária"
                  name="ConcessionáriaID"
                  value={formData.ConcessionáriaID}
                  onChange={handleChange}
                  required
                />
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
