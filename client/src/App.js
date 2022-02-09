import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FrontPage from './pages/FrontPage'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors'
import Layout from './layout/Layout'
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fefefe'
    },
    secondary: purple
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