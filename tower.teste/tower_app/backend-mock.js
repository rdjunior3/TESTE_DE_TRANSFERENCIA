import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5001;

// Middlewares - CORS configurado para aceitar requisições do frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Banco de dados em memória
const users = [
  {
    id: 1,
    email: 'admin@tower.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin',
    active: true
  }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Mock rodando!' });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }
  
  if (!user.active) {
    return res.status(403).json({ error: 'Usuário inativo' });
  }
  
  const token = Buffer.from(`${user.id}-${Date.now()}`).toString('base64');
  
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// Registro
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email já cadastrado' });
  }
  
  const newUser = {
    id: users.length + 1,
    email,
    password,
    name,
    role: 'user',
    active: true
  };
  
  users.push(newUser);
  
  const token = Buffer.from(`${newUser.id}-${Date.now()}`).toString('base64');
  
  res.json({
    success: true,
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }
  });
});

// Validar token
app.post('/api/auth/validate-token', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const userId = parseInt(decoded.split('-')[0]);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Alterar senha
app.post('/api/auth/change-password', (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== currentPassword) {
    return res.status(401).json({ error: 'Senha atual incorreta' });
  }
  
  user.password = newPassword;
  
  res.json({
    success: true,
    message: 'Senha alterada com sucesso'
  });
});

// Solicitar reset de senha
app.post('/api/auth/request-password-reset', (req, res) => {
  const { email } = req.body;
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return res.status(404).json({ error: 'Email não encontrado' });
  }
  
  // Simular envio de email
  const resetToken = Buffer.from(`${user.id}-reset-${Date.now()}`).toString('base64');
  
  res.json({
    success: true,
    message: 'Email de recuperação enviado',
    resetToken // Em produção, isso seria enviado por email
  });
});

// Reset de senha
app.post('/api/auth/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const userId = parseInt(decoded.split('-')[0]);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    user.password = newPassword;
    
    res.json({
      success: true,
      message: 'Senha redefinida com sucesso'
    });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 TOWER APP - BACKEND API');
  console.log('========================================');
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log('📡 Endpoints disponíveis:');
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/validate-token`);
  console.log(`   - POST /api/auth/change-password`);
  console.log(`   - POST /api/auth/request-password-reset`);
  console.log(`   - POST /api/auth/reset-password`);
  console.log('\n🔐 Credenciais de teste:');
  console.log('   Email: admin@tower.com');
  console.log('   Senha: admin123');
  console.log('========================================\n');
});


