import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { api, fetchAPI } from '../config/api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Fazer login via API
      const response = await fetchAPI(api.auth.login, {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.success) {
        // Salvar dados do usuário
        const userSession = {
          ...response.user,
          password: formData.password, // Salvar senha para alteração posterior
        };
        
        localStorage.setItem('token', 'user-token-' + response.user.id);
        localStorage.setItem('user', JSON.stringify(userSession));
        localStorage.setItem('userData', JSON.stringify(response.user));
        
        // Redirecionar para dashboard
        navigate('/dashboard');
      } else {
        setError('E-mail ou senha incorretos');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Erro ao conectar com o servidor');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="w-12 h-12 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 21V11L12 3L21 11V21H14V14H10V21H3Z"/>
            </svg>
            <h1 className="text-4xl font-bold text-white">TOWER</h1>
          </div>
          <p className="text-gray-300 text-sm">Sistema de Gestão de Precificação</p>
        </div>

        {/* Card de Login */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white text-center mb-2">
            Bem-vindo de volta
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Entre na sua conta para continuar
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* E-mail */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Link de Cadastro */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Não tem uma conta?{' '}
              <a
                href="/cadastro"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Cadastre-se
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-center text-sm mt-6">
          © 2025 Tower. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}

export default Login;

