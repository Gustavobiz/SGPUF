import { Box, Typography } from "@mui/material";

export default function PageHeader({ title }) {
  return (
    <Box
      sx={{
        backgroundColor: "#202027",
        color: "#eeefed",
        padding: "8px 16px",
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        {title}
      </Typography>
    </Box>
  );
}
