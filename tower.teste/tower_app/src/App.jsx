import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import AguardandoPagamento from './pages/AguardandoPagamento';
import Dashboard from './pages/Dashboard';
import Cadastramento from './pages/Cadastramento';
import Sintese from './pages/Sintese';
import FichaTecnica from './pages/FichaTecnica';
import Configuracoes from './pages/Configuracoes';
import Suporte from './pages/Suporte';
import ResetPassword from './pages/ResetPassword';
import MinhasFichas from './pages/MinhasFichas';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Admin tem acesso completo sem verificação de pagamento
  if (user.role === 'admin') {
    return children;
  }
  
  // Usuários normais precisam ter plano premium
  if (user.plan !== 'premium') {
    return <Navigate to="/aguardando-pagamento" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/aguardando-pagamento" element={<AguardandoPagamento />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cadastramento"
          element={
            <ProtectedRoute>
              <Cadastramento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sintese"
          element={
            <ProtectedRoute>
              <Sintese />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ficha-tecnica"
          element={
            <ProtectedRoute>
              <FichaTecnica />
            </ProtectedRoute>
          }
        />
        
        {/* Placeholder Routes */}
        <Route
          path="/integracoes"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aprendizado"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suporte"
          element={
            <ProtectedRoute>
              <Suporte />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracoes"
          element={
            <ProtectedRoute>
              <Configuracoes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/minhas-fichas"
          element={
            <ProtectedRoute>
              <MinhasFichas />
            </ProtectedRoute>
          }
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
