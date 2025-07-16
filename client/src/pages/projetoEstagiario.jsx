import { Box, Button, Typography, Divider } from "@mui/material";
import Layout from "../layouts/Layout";

export default function ProjetoGerente() {
  const projeto = {
    idProjeto: 1,
    Status: "vistoriado",
    PreçoFinal: 15000.8,
    ClienteNome: "João Silva",
    ConcessionariaNome: "Neoenergia",
    UnidadeNome: "UC João",
    Latitude: "-5.79",
    Longitude: "-35.20",
    Potência: "550 kWp",
    TipoCabo: "Cobre",
    Bitola: "10mm",
  };

  return (
    <Layout pageTitle="Detalhes do Projeto">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Box
          p={4}
          maxWidth="600px"
          width="100%"
          bgcolor="#fff"
          borderRadius="12px"
          boxShadow={2}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Projeto Estagio: {projeto.Nome}
          </Typography>
          <Typography>Status: {projeto.Status}</Typography>
          <Typography>Preço Final: R$ {projeto.PreçoFinal}</Typography>
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
              onClick={finalizarProjeto}
              disabled={projeto.Status === "finalizado"}
            >
              Homologar
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
