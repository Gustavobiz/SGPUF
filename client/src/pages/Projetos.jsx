// src/pages/Projetos.jsx
import { Box, Button, Card, Typography } from "@mui/material";
import Layout from "../layouts/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import DescriptionIcon from "@mui/icons-material/Description";

export default function Projetos() {
  const tipo = localStorage.getItem("tipo");
  const token = localStorage.getItem("token");
  const [projetos, setProjetos] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/projetos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setProjetos(res.data))
      .catch((err) => console.error("Erro ao buscar projetos", err));
  }, []);

  const podeVistoriar = (status) =>
    status === "vistoriado" || status === "finalizado";

  const handleVerProjeto = (id) => {
    if (tipo === "gerente") {
      window.location.href = `/projetos/${id}/gerente`;
    } else if (tipo === "engenheiro") {
      window.location.href = `/projetos/${id}/engenheiro`;
    } else {
      window.location.href = `/projetos/${id}/estagiario`;
    }
  };

  const gerarPDFVistoria = (idVistoria) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/vistorias/pdf/${idVistoria}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `vistoria_${idVistoria}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("Erro ao gerar PDF de vistoria:", err);
        alert("Erro ao gerar o PDF de vistoria.");
      });
  };

  const gerarPDFHomologacao = (idProjeto) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/pdf/homologacao/pdf/${idProjeto}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `homologacao_${idProjeto}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("Erro ao gerar homologação:", err);
        alert("Erro ao gerar documento.");
      });
  };

  return (
    <Layout pageTitle="Lista de Projetos">
      <Box display="flex" flexDirection="column" gap={2}>
        {projetos.map((projeto) => (
          <Card
            key={projeto.idProjeto}
            sx={{
              p: 2,
              borderRadius: "10px",
              backgroundColor: "#fff",
              boxShadow: 1,
            }}
          >
            {/* Área do ícone + conteúdo alinhado */}
            <Box sx={{ display: "flex" }}>
              {/* Ícone */}
              <Box sx={{ pt: 0.5 }}>
                <DescriptionIcon sx={{ color: "#202027", fontSize: 28 }} />
              </Box>

              {/* Conteúdo à direita */}
              <Box sx={{ ml: 2, flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {projeto.Nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {projeto.Status}
                  <br />
                  Cliente: {projeto.ClienteNome}
                </Typography>

                {/* Botões alinhados */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#b6f566",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                    onClick={() => gerarPDFHomologacao(projeto.idProjeto)}
                  >
                    GERAR HOMOLOGAÇÃO
                  </Button>
                  {podeVistoriar(projeto.Status) && projeto.idVistoria && (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#202027",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                      onClick={() => gerarPDFVistoria(projeto.idVistoria)}
                    >
                      GERAR VISTORIA
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    sx={{
                      color: "#6b9d30",
                      borderColor: "#6b9d30",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleVerProjeto(projeto.idProjeto)}
                  >
                    VER PROJETO
                  </Button>
                </Box>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </Layout>
  );
}
