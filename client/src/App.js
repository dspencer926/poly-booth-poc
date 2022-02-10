import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FrontPage from './pages/FrontPage'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { yellow } from '@mui/material/colors'
import Layout from './layout/Layout'
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#333'
    },
    secondary: yellow
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route exact path="/" element={<FrontPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;