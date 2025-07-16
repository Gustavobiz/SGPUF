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

export default function Unidades() {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    Longitude: "",
    Latitude: "",
    TipoCabo: "",
    Nome: "",
    Potência: "",
    Bitola: "",
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
      await axios.post(`${import.meta.env.VITE_API_URL}/unidades`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Unidade Consumidora cadastrada com sucesso!");
      setFormData({
        Longitude: "",
        Latitude: "",
        TipoCabo: "",
        Nome: "",
        Potência: "",
        Bitola: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao cadastrar unidade.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout pageTitle="Cadastrar Unidade Consumidora">
      <Box display="flex" justifyContent="center">
        <Card sx={{ width: "100%", maxWidth: 600, backgroundColor: "#fff" }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Nova Unidade Consumidora
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  name="Nome"
                  label="Nome"
                  value={formData.Nome}
                  onChange={handleChange}
                  required
                />
                <TextField
                  name="Latitude"
                  label="Latitude"
                  value={formData.Latitude}
                  onChange={handleChange}
                  required
                />
                <TextField
                  name="Longitude"
                  label="Longitude"
                  value={formData.Longitude}
                  onChange={handleChange}
                  required
                />
                <TextField
                  name="TipoCabo"
                  label="Tipo de Cabo"
                  value={formData.TipoCabo}
                  onChange={handleChange}
                />
                <TextField
                  name="Potência"
                  label="Potência"
                  value={formData.Potência}
                  onChange={handleChange}
                />
                <TextField
                  name="Bitola"
                  label="Bitola"
                  value={formData.Bitola}
                  onChange={handleChange}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Cadastrar Unidade"}
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
