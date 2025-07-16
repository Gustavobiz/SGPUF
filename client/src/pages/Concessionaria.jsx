import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import Layout from "../layouts/Layout";
import { useState } from "react";
import axios from "axios";

export default function Concessionaria() {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    CNPJ: "",
    telefone: "",
    endereco: "",
    razaosocial: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/concessionarias`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Concessionária cadastrada com sucesso!");
      setFormData({
        CNPJ: "",
        telefone: "",
        endereco: "",
        razaosocial: "",
        email: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao cadastrar concessionária");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout pageTitle="Cadastrar Concessionária">
      <Box display="flex" justifyContent="center" my={4}>
        <Card
          sx={{ p: 3, width: "100%", maxWidth: 600, backgroundColor: "#fff" }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Cadastro de Concessionária
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  name="CNPJ"
                  label="CNPJ"
                  value={formData.CNPJ}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  name="razaosocial"
                  label="Razão Social"
                  value={formData.razaosocial}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  name="telefone"
                  label="Telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  name="endereco"
                  label="Endereço"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Cadastrar"}
                </Button>
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
