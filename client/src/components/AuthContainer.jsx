// src/components/AuthContainer.jsx
import { useState } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Box, Typography, Paper } from "@mui/material";

export default function AuthContainer() {
  const [modoCadastro, setModoCadastro] = useState(false);

  return (
    <Box
      sx={{
        bgcolor: "#202027",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 400, bgcolor: "#eeefed" }}>
        <Typography variant="h5" align="center" gutterBottom>
          {modoCadastro ? "Criar Conta" : "Entrar no SGPUF"}
        </Typography>

        {modoCadastro ? (
          <Register onTrocar={() => setModoCadastro(false)} />
        ) : (
          <Login onTrocar={() => setModoCadastro(true)} />
        )}
      </Paper>
    </Box>
  );
}
