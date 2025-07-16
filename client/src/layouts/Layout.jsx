// src/layouts/Layout.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
} from "@mui/material";
import { Instagram, Facebook, Twitter, Logout } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import PageHeader from "../components/PageHeader";

export default function Layout({ children, pageTitle }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tipo");
    navigate("/");
  };

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
      <AppBar position="static" sx={{ bgcolor: "#FFFFFF" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo e título */}
          <Box display="flex" alignItems="center">
            <WbSunnyIcon sx={{ color: "#202027", mr: 1 }} />
            <Typography
              variant="h6"
              sx={{ color: "#202027", fontWeight: "bold" }}
            >
              SGPUF
            </Typography>
          </Box>

          {/* Menu de navegação + botão sair */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              component={RouterLink}
              to="/projetos"
              sx={{
                color: "#202027",
                "&:hover": {
                  color: "#6b9d30",
                  backgroundColor: "transparent",
                },
              }}
            >
              Projetos
            </Button>
            <Button
              component={RouterLink}
              to="/unidades"
              sx={{
                color: "#202027",
                "&:hover": {
                  color: "#6b9d30",
                  backgroundColor: "transparent",
                },
              }}
            >
              Unidades Consumidoras
            </Button>
            <Button
              component={RouterLink}
              to="/cliente"
              sx={{
                color: "#202027",
                "&:hover": {
                  color: "#6b9d30",
                  backgroundColor: "transparent",
                },
              }}
            >
              Cliente
            </Button>
            <Button
              component={RouterLink}
              to="/concessionaria"
              sx={{
                color: "#202027",
                "&:hover": {
                  color: "#6b9d30",
                  backgroundColor: "transparent",
                },
              }}
            >
              Concessionária
            </Button>

            {/* Botão de sair */}
            <Button
              onClick={handleLogout}
              startIcon={<Logout />}
              sx={{
                color: "#6b9d30",
                borderColor: "#6b9d30",
                fontWeight: "bold",
              }}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Título da Página */}
      {pageTitle && <PageHeader title={pageTitle} />}

      {/* Conteúdo */}
      <Container sx={{ flex: 1, mt: 4 }}>{children}</Container>

      {/* Rodapé */}
      <Box
        sx={{
          bgcolor: "#202027",
          color: "#fff",
          py: 2,
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
          <Box sx={{ display: "flex", gap: 3, fontSize: 14 }}>
            <Typography variant="body2">Sobre nós</Typography>
            <Typography variant="body2">Serviços</Typography>
            <Typography variant="body2">Preços</Typography>
            <Typography variant="body2">Blog</Typography>
          </Box>
          <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
            <Instagram fontSize="small" />
            <Facebook fontSize="small" />
            <Twitter fontSize="small" />
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
