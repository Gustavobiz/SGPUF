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

export default function Clientes() {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    CPF: "",
    endereco: "",
    Nome: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/clientes`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Cliente cadastrado com sucesso!");
      setFormData({ CPF: "", endereco: "", Nome: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao cadastrar cliente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout pageTitle="Cadastrar Cliente">
      <Box display="flex" justifyContent="center">
        <Card sx={{ width: "100%", maxWidth: 600, backgroundColor: "#fff" }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Novo Cliente
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  name="CPF"
                  label="CPF"
                  value={formData.CPF}
                  onChange={handleChange}
                  required
                />
                <TextField
                  name="Nome"
                  label="Nome"
                  value={formData.Nome}
                  onChange={handleChange}
                  required
                />
                <TextField
                  name="endereco"
                  label="Endereço"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Cadastrar Cliente"}
                </Button>

                {success && <Alert severity="success">{success}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
