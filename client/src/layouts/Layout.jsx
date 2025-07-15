// src/layouts/Layout.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: "#eeefed",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* AppBar superior */}
      <AppBar position="static" sx={{ bgcolor: "#202027" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img src="/logo.svg" alt="Logo SGPUF" width={24} height={24} />
            <Typography variant="h6" color="#fff" fontWeight="bold">
              SGPUF
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" component={RouterLink} to="/projetos">
              Projetos
            </Button>
            <Button color="inherit" component={RouterLink} to="/unidades">
              Unidades Consumidoras
            </Button>
            <Button color="inherit" component={RouterLink} to="/vistorias">
              Vistorias
            </Button>
            <Button color="inherit" component={RouterLink} to="/usuarios">
              Usuários
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Conteúdo */}
      <Container sx={{ flex: 1, mt: 4 }}>{children}</Container>

      {/* Rodapé */}
      <Box
        sx={{
          bgcolor: "#202027",
          color: "#fff",
          p: 3,
          mt: 6,
          borderTopLeftRadius: "30px",
          borderTopRightRadius: "30px",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="h6">SGPUF</Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Typography variant="body2">Sobre nós</Typography>
            <Typography variant="body2">Serviços</Typography>
            <Typography variant="body2">Preços</Typography>
            <Typography variant="body2">Blog</Typography>
          </Box>
          <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
            <img src="/icons/linkedin.svg" width={20} />
            <img src="/icons/facebook.svg" width={20} />
            <img src="/icons/twitter.svg" width={20} />
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
