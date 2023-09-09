"use client";
import {createTheme, Shadows} from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffc868"
    },
  },
  typography: {
    allVariants: {
      color: "#ffd8b9"
    },
  },
  // shadows: Array(25).fill("none") as Shadows,
  components: {
    MuiTypography: {
      styleOverrides: {
        noWrap, // Support multiple line ellipsis
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "rgba(20,20,20,0.8)"
        }
      }
    }
  },
})

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
        noWrap, // Support multiple line ellipsis
      },
    },
  },
});


// Support multiple line ellipsis
function noWrap(styles: any): any {
  return {
    whiteSpace: "initial",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: String(styles.ownerState['data-lines'] || '1'),
    WebkitBoxOrient: "vertical",
  }
}
