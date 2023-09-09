"use client";
import {createTheme, Shadows} from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#62004a"
    },
  },
  // shadows: Array(25).fill("none") as Shadows,
  components: {
    MuiTypography: {
      styleOverrides: {
        // Support multiple line ellipsis
        noWrap(styles) {
          return {
            whiteSpace: "initial",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: String(styles.ownerState['data-lines'] || '1'),
            WebkitBoxOrient: "vertical",
          }
        },
      },
    },
  },
});
