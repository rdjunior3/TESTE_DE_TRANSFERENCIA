// Configuração da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const api = {
  baseURL: API_URL,
  
  // Endpoints de autenticação
  auth: {
    login: `${API_URL}/api/auth/login`,
    register: `${API_URL}/api/auth/register`,
    changePassword: `${API_URL}/api/auth/change-password`,
    requestPasswordReset: `${API_URL}/api/auth/request-password-reset`,
    resetPassword: `${API_URL}/api/auth/reset-password`,
    validateToken: `${API_URL}/api/auth/validate-token`,
  },
  
  // Health check
  health: `${API_URL}/api/health`,
};

// Função auxiliar para fazer requisições
export async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export default api;

