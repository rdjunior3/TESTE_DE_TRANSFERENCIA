import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import storage from '../services/storage';

export default function ModalCategoria({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nome: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da categoria é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getNextCategoryRange = () => {
    const categories = storage.getCategories();
    
    if (categories.length === 0) {
      // Primeira categoria: 1-999
      return { startCode: 1, endCode: 999 };
    }
    
    // Encontrar o maior endCode existente
    const maxEndCode = Math.max(...categories.map(cat => cat.endCode));
    
    // Próxima categoria começa após o último endCode
    const startCode = maxEndCode + 1;
    const endCode = startCode + 999; // Faixa de 1000 códigos
    
    return { startCode, endCode };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const { startCode, endCode } = getNextCategoryRange();

    const categoryData = {
      nome: formData.nome.trim(),
      startCode,
      endCode
    };

    onSave(categoryData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({ nome: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const nextRange = getNextCategoryRange();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A1929] rounded-lg shadow-2xl w-full max-w-md border border-[#1E3A5F]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E3A5F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Nova Categoria</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome da Categoria <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Bebidas, Alimentos, etc"
              className={`w-full px-4 py-2.5 bg-[#1A2942] border ${
                errors.nome ? 'border-red-500' : 'border-[#1E3A5F]'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-400">{errors.nome}</p>
            )}
          </div>

          {/* Info sobre faixa automática */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-300 mb-2">
              <strong>Faixa de códigos (automática):</strong>
            </p>
            <p className="text-lg font-semibold text-blue-400">
              {nextRange.startCode} - {nextRange.endCode}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Esta categoria terá 1000 códigos disponíveis
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FolderPlus className="w-4 h-4" />
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

