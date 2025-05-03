import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import RenderRoute from './Routes/renderRoutes';

function App() {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#f48fb1',
      },
      background: {
        default: themeMode === 'dark' ? '#121212' : '#f5f5f5',
        paper: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RenderRoute />
    </ThemeProvider>
  );
}

export default App;