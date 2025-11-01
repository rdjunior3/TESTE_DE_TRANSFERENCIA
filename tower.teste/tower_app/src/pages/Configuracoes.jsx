import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { Settings, Building2, Users, Plus, Trash2, Edit2, Save, X, Camera, Lock, Mail, Key, Eye, EyeOff } from 'lucide-react';
import { api, fetchAPI } from '../config/api';

export default function Configuracoes() {
  const [user, setUser] = useState({});
  const [profiles, setProfiles] = useState([]);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [newProfile, setNewProfile] = useState({
    email: '',
    senha: '',
    funcao: 'usuario'
  });

  // Estados para novas funcionalidades
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showRecoverEmail, setShowRecoverEmail] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [recoverEmail, setRecoverEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const maxProfiles = {
    'free': 1,
    'basic': 3,
    'premium': 10,
    'enterprise': 999
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    const savedProfiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    setProfiles(savedProfiles);

    // Carregar imagem de perfil salva
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleAddProfile = () => {
    if (!newProfile.email || !newProfile.senha) {
      alert('Preencha email e senha!');
      return;
    }

    const userPlan = user.plan || 'free';
    const limit = maxProfiles[userPlan] || 1;

    if (profiles.length >= limit) {
      alert(`Seu plano ${userPlan.toUpperCase()} permite apenas ${limit} perfil(is). Faça upgrade!`);
      return;
    }

    const profile = {
      id: Date.now(),
      ...newProfile,
      createdAt: new Date().toISOString()
    };

    const updatedProfiles = [...profiles, profile];
    setProfiles(updatedProfiles);
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));

    setNewProfile({ email: '', senha: '', funcao: 'usuario' });
    setShowAddProfile(false);
  };

  const handleDeleteProfile = (id) => {
    if (confirm('Deseja realmente excluir este perfil?')) {
      const updatedProfiles = profiles.filter(p => p.id !== id);
      setProfiles(updatedProfiles);
      localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    }
  };

  const handleEditProfile = (profile) => {
    setEditingProfile(profile);
  };

  const handleSaveEdit = () => {
    const updatedProfiles = profiles.map(p => 
      p.id === editingProfile.id ? editingProfile : p
    );
    setProfiles(updatedProfiles);
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    setEditingProfile(null);
  };

  // Função para upload de imagem
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        localStorage.setItem('profileImage', imageData);
        
        // Atualizar também no objeto user
        const updatedUser = { ...user, profileImage: imageData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        alert('Imagem de perfil atualizada com sucesso!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para remover imagem
  const handleRemoveImage = () => {
    if (confirm('Deseja remover a imagem de perfil?')) {
      setProfileImage(null);
      localStorage.removeItem('profileImage');
      
      const updatedUser = { ...user };
      delete updatedUser.profileImage;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('Imagem de perfil removida!');
    }
  };

  // Função para alterar senha
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Preencha todos os campos!');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres!');
      return;
    }

    try {
      // Alterar senha via API
      const response = await fetchAPI(api.auth.changePassword, {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      });

      if (response.success) {
        // Atualizar senha localmente
        const updatedUser = { ...user, password: passwordData.newPassword };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        alert('Senha alterada com sucesso!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowChangePassword(false);
      }
    } catch (error) {
      alert(error.message || 'Erro ao alterar senha');
    }
  };

  // Função para recuperar e-mail
  const handleRecoverEmail = async () => {
    if (!recoverEmail) {
      alert('Digite seu e-mail!');
      return;
    }

    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recoverEmail)) {
      alert('Digite um e-mail válido!');
      return;
    }

    try {
      // Solicitar recuperação via API
      const response = await fetchAPI(api.auth.requestPasswordReset, {
        method: 'POST',
        body: JSON.stringify({
          email: recoverEmail,
        }),
      });

      if (response.success) {
        alert(`Um link de recuperação foi enviado para ${recoverEmail}. Verifique sua caixa de entrada!`);
        setRecoverEmail('');
        setShowRecoverEmail(false);
      }
    } catch (error) {
      alert(error.message || 'Erro ao solicitar recuperação');
    }
  };

  const userPlan = user.plan || 'free';
  const limit = maxProfiles[userPlan] || 1;
  const remaining = limit - profiles.length;

  return (
    <div className="flex h-screen bg-background" style={{padding: "10px", paddingLeft: "0"}}>
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold text-white">Configurações</h1>
            </div>
            <p className="text-gray-400">Gerencie suas configurações e perfis de acesso</p>
          </div>

          {/* Seção de Perfil do Usuário */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Camera className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-white">Perfil do Usuário</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Upload de Imagem */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-12 h-12 text-gray-600" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors"
                    title="Alterar foto"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors text-white"
                  >
                    Alterar Foto
                  </button>
                  {profileImage && (
                    <button
                      onClick={handleRemoveImage}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors text-white"
                    >
                      Remover
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 text-center">
                  JPG, PNG ou GIF<br />Máximo 2MB
                </p>
              </div>

              {/* Ações de Segurança */}
              <div className="flex-1 space-y-4">
                {/* Botão Alterar Senha */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-blue-500" />
                      <div>
                        <h3 className="font-semibold text-white">Alterar Senha</h3>
                        <p className="text-sm text-gray-400">Atualize sua senha de acesso</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowChangePassword(!showChangePassword)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors text-white"
                    >
                      {showChangePassword ? 'Cancelar' : 'Alterar'}
                    </button>
                  </div>

                  {/* Formulário de Alterar Senha */}
                  {showChangePassword && (
                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Senha Atual *</label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Digite sua senha atual"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Nova Senha *</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Digite a nova senha (mín. 6 caracteres)"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Confirmar Nova Senha *</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Confirme a nova senha"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleChangePassword}
                        className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-white flex items-center justify-center gap-2"
                      >
                        <Key className="w-4 h-4" />
                        Confirmar Alteração
                      </button>
                    </div>
                  )}
                </div>

                {/* Botão Recuperar Senha por E-mail */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <div>
                        <h3 className="font-semibold text-white">Recuperação de Senha</h3>
                        <p className="text-sm text-gray-400">Receba um link de recuperação por e-mail</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowRecoverEmail(!showRecoverEmail)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors text-white"
                    >
                      {showRecoverEmail ? 'Cancelar' : 'Recuperar'}
                    </button>
                  </div>

                  {/* Formulário de Recuperação */}
                  {showRecoverEmail && (
                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">E-mail para Recuperação *</label>
                        <input
                          type="email"
                          value={recoverEmail}
                          onChange={(e) => setRecoverEmail(e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                          placeholder="seu@email.com"
                        />
                      </div>

                      <button
                        onClick={handleRecoverEmail}
                        className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-white flex items-center justify-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Enviar Link de Recuperação
                      </button>

                      <p className="text-xs text-gray-500">
                        Um link de recuperação será enviado para o e-mail informado. Verifique também a pasta de spam.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informações da Empresa */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-white">Informações da Empresa</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Nome da Empresa</label>
                <p className="text-lg font-medium text-white">{user.company_name || 'Não informado'}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400">CNPJ</label>
                <p className="text-lg font-medium text-white">{user.cnpj || 'Não informado'}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400">E-mail</label>
                <p className="text-lg font-medium text-white">{user.email || 'Não informado'}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400">Plano Atual</label>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    userPlan === 'premium' ? 'bg-yellow-600' :
                    userPlan === 'enterprise' ? 'bg-purple-600' :
                    userPlan === 'basic' ? 'bg-blue-600' :
                    'bg-gray-600'
                  }`}>
                    {userPlan.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Gestão de Perfis */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-500" />
                <div>
                  <h2 className="text-xl font-semibold text-white">Gestão de Perfis de Acesso</h2>
                  <p className="text-sm text-gray-400">
                    {profiles.length} de {limit} perfis utilizados
                    {remaining > 0 && ` • ${remaining} disponível(is)`}
                  </p>
                </div>
              </div>

              {remaining > 0 && (
                <button
                  onClick={() => setShowAddProfile(!showAddProfile)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar Perfil
                </button>
              )}
            </div>

            {/* Formulário de Adicionar Perfil */}
            {showAddProfile && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Novo Perfil de Acesso</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">E-mail *</label>
                    <input
                      type="email"
                      value={newProfile.email}
                      onChange={(e) => setNewProfile({...newProfile, email: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      placeholder="usuario@empresa.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Senha *</label>
                    <input
                      type="password"
                      value={newProfile.senha}
                      onChange={(e) => setNewProfile({...newProfile, senha: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Função</label>
                    <select
                      value={newProfile.funcao}
                      onChange={(e) => setNewProfile({...newProfile, funcao: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="usuario">Usuário</option>
                      <option value="gerente">Gerente</option>
                      <option value="admin">Administrador</option>
                      <option value="financeiro">Financeiro</option>
                      <option value="operacional">Operacional</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAddProfile}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-white"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Perfil
                  </button>
                  <button
                    onClick={() => setShowAddProfile(false)}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-white"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Lista de Perfis */}
            {profiles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nenhum perfil cadastrado ainda</p>
                <p className="text-sm">Clique em "Adicionar Perfil" para começar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {profiles.map((profile) => (
                  <div key={profile.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    {editingProfile?.id === profile.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                          type="email"
                          value={editingProfile.email}
                          onChange={(e) => setEditingProfile({...editingProfile, email: e.target.value})}
                          className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="password"
                          value={editingProfile.senha}
                          onChange={(e) => setEditingProfile({...editingProfile, senha: e.target.value})}
                          className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                          placeholder="Nova senha"
                        />
                        <select
                          value={editingProfile.funcao}
                          onChange={(e) => setEditingProfile({...editingProfile, funcao: e.target.value})}
                          className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="usuario">Usuário</option>
                          <option value="gerente">Gerente</option>
                          <option value="admin">Administrador</option>
                          <option value="financeiro">Financeiro</option>
                          <option value="operacional">Operacional</option>
                        </select>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded transition-colors"
                          >
                            <Save className="w-4 h-4 mx-auto text-white" />
                          </button>
                          <button
                            onClick={() => setEditingProfile(null)}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded transition-colors"
                          >
                            <X className="w-4 h-4 mx-auto text-white" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">E-mail</p>
                            <p className="text-white font-medium">{profile.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Função</p>
                            <p className="text-white font-medium capitalize">{profile.funcao}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Criado em</p>
                            <p className="text-white font-medium">
                              {new Date(profile.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditProfile(profile)}
                            className="bg-blue-600 hover:bg-blue-700 p-2 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => handleDeleteProfile(profile.id)}
                            className="bg-red-600 hover:bg-red-700 p-2 rounded transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

