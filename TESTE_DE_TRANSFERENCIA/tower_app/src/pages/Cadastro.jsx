import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Mail, Lock } from 'lucide-react';

function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    cnpj: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomeEmpresa.trim()) {
      newErrors.nomeEmpresa = 'Nome da empresa é obrigatório';
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    } else if (formData.cnpj.replace(/\D/g, '').length !== 14) {
      newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirme sua senha';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Criar objeto do usuário
    const novoUsuario = {
      id: Date.now(),
      nomeEmpresa: formData.nomeEmpresa,
      cnpj: formData.cnpj,
      email: formData.email,
      senha: formData.senha,
      status: 'aguardando_pagamento', // Status inicial
      dataCadastro: new Date().toISOString()
    };

    // Salvar no localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Salvar usuário atual (para manter contexto)
    localStorage.setItem('usuarioAtual', JSON.stringify(novoUsuario));

    // Redirecionar para escolher plano
    navigate('/aguardando-pagamento');
  };

  const handleVoltar = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="w-12 h-12 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 21V11L12 3L21 11V21H14V14H10V21H3Z"/>
            </svg>
            <h1 className="text-4xl font-bold text-blue-500">TOWER</h1>
          </div>
        </div>

        {/* Card de Cadastro */}
        <div className="bg-gradient-to-b from-gray-900 to-black border-2 border-blue-500 rounded-lg p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Criar nova conta</h2>
          <p className="text-gray-400 text-center mb-6 text-sm">Comece sua jornada conosco</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome Empresa */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Nome Empresa
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="nomeEmpresa"
                  value={formData.nomeEmpresa}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className={`w-full bg-gray-800 border ${errors.nomeEmpresa ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors`}
                />
              </div>
              {errors.nomeEmpresa && (
                <p className="text-red-500 text-xs mt-1">{errors.nomeEmpresa}</p>
              )}
            </div>

            {/* CNPJ */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Empresa
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  placeholder="CNPJ da empresa"
                  maxLength="18"
                  className={`w-full bg-gray-800 border ${errors.cnpj ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors`}
                />
              </div>
              {errors.cnpj && (
                <p className="text-red-500 text-xs mt-1">{errors.cnpj}</p>
              )}
            </div>

            {/* E-mail */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className={`w-full bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="Crie uma senha"
                  className={`w-full bg-gray-800 border ${errors.senha ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors`}
                />
              </div>
              {errors.senha && (
                <p className="text-red-500 text-xs mt-1">{errors.senha}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  placeholder="Confirme sua senha"
                  className={`w-full bg-gray-800 border ${errors.confirmarSenha ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors`}
                />
              </div>
              {errors.confirmarSenha && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmarSenha}</p>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleVoltar}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-500/50"
              >
                Escolher plano
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-gray-500 text-center text-xs mt-6">
          ©2025 Estrategos | Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}

export default Cadastro;

