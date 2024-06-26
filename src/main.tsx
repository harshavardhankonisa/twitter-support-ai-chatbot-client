import {
  Box,
  CssBaseline,
  FormControlLabel,
  Switch,
  ThemeProvider,
  Typography,
} from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";
import { useState } from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box position='fixed' top={0} bottom={0} left={0} right={0} height='100vh' width='100vw'>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            height: '10%',
            [theme.breakpoints.up('sm')]:{
              height: '10%',
            },
            [theme.breakpoints.up('md')]:{
              height: '10%',
            },
            [theme.breakpoints.up('lg')]:{
              height: '10%',
            }
          }}
        >
          <Box></Box>
          <Box></Box>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  onChange={handleThemeChange}
                />
              }
              label=""
            />
          </Box>
        </Box>
        <Box>
          <Typography>Harsha</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
