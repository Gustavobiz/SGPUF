// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6b9d30", // verde escuro (botões)
    },
    secondary: {
      main: "#b6f566", // destaque
    },
    background: {
      default: "#202027", // fundo geral
      paper: "#eeefed", // cartão do login
    },
    text: {
      primary: "#202027",
      secondary: "#7c7c81",
    },
  },
});

export default theme;
