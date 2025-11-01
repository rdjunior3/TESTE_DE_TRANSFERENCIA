import { useState, useEffect, useRef } from 'react';
import { X, Plus, Package } from 'lucide-react';
import storage from '../services/storage';
import ModalCategoria from './ModalCategoria';

export default function ModalItem({ isOpen, onClose, onSave, editItem }) {
  const [categories, setCategories] = useState([]);
  
  // Refs para navegação automática
  const tipoRef = useRef(null);
  const categoriaRef = useRef(null);
  const descricaoRef = useRef(null);
  const unidadeRef = useRef(null);
  const custoUnitarioRef = useRef(null);
  const qtdEmbalagemRef = useRef(null);
  const custoEmbalagemRef = useRef(null);
  const submitButtonRef = useRef(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [formData, setFormData] = useState({
    tipo: '',
    categoria: '',
    descricao: '',
    unidade: '',
    qtdEmbalagem: '',
    custoEmbalagem: '',
    custoUnitario: ''
  });

  const [errors, setErrors] = useState({});
  const [nextCode, setNextCode] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      
      if (editItem) {
        setFormData({
          tipo: editItem.tipo || '',
          categoria: editItem.categoriaId?.toString() || '',
          descricao: editItem.descricao || '',
          unidade: editItem.unidade || '',
          qtdEmbalagem: editItem.qtdEmbalagem || '',
          custoEmbalagem: editItem.custoEmbalagem || '',
          custoUnitario: editItem.custoUnitario || ''
        });
      }
      
      // Foco automático no primeiro campo quando o modal abrir
      setTimeout(() => {
        if (tipoRef.current) {
          tipoRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, editItem]);

  const loadCategories = () => {
    setCategories(storage.getCategories());
  };

  const handleCategorySave = (categoryData) => {
    storage.addCategory(categoryData);
    loadCategories();
    setShowCategoryModal(false);
  };

  useEffect(() => {
    if (formData.categoria) {
      const categoryId = parseInt(formData.categoria);
      const code = storage.getNextCode(categoryId);
      setNextCode(code);
    } else {
      setNextCode(null);
    }
  }, [formData.categoria]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Função para navegar para o próximo campo
  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      } else {
        // Se não há próximo campo, submete o formulário
        handleSubmit(e);
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.tipo) {
      newErrors.tipo = 'Tipo é obrigatório';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.unidade) {
      newErrors.unidade = 'Unidade de medida é obrigatória';
    }

    // Validações específicas para Insumo
    if (formData.tipo === 'Insumo') {
      if (!formData.qtdEmbalagem || parseFloat(formData.qtdEmbalagem) <= 0) {
        newErrors.qtdEmbalagem = 'Quantidade da embalagem é obrigatória';
      }

      if (!formData.custoEmbalagem || parseFloat(formData.custoEmbalagem) <= 0) {
        newErrors.custoEmbalagem = 'Custo da embalagem é obrigatório';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    if (nextCode === null && !editItem) {
      alert('Categoria cheia! Escolha outra categoria.');
      return;
    }

    const categoryId = parseInt(formData.categoria);
    const category = categories.find(cat => cat.id === categoryId);

    // Calcular custo unitário automaticamente para insumos
    let custoUnitarioCalculado = formData.custoUnitario;
    if (formData.tipo === 'Insumo' && formData.qtdEmbalagem && formData.custoEmbalagem) {
      custoUnitarioCalculado = (parseFloat(formData.custoEmbalagem) / parseFloat(formData.qtdEmbalagem)).toFixed(2);
    }

    const itemData = {
      codigo: editItem ? editItem.codigo : nextCode.toString(),
      tipo: formData.tipo,
      categoria: category.nome,
      categoriaId: categoryId,
      descricao: formData.descricao.trim(),
      unidade: formData.unidade,
      qtdEmbalagem: formData.tipo === 'Insumo' ? parseFloat(formData.qtdEmbalagem) : null,
      custoEmbalagem: formData.tipo === 'Insumo' ? parseFloat(formData.custoEmbalagem) : null,
      custoUnitario: parseFloat(custoUnitarioCalculado) || 0
    };

    onSave(itemData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      tipo: '',
      categoria: '',
      descricao: '',
      unidade: '',
      qtdEmbalagem: '',
      custoEmbalagem: '',
      custoUnitario: ''
    });
    setErrors({});
    setNextCode(null);
    onClose();
  };

  if (!isOpen) return null;

  const isInsumo = formData.tipo === 'Insumo';

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-[#0A1929] rounded-lg shadow-2xl w-full max-w-2xl border border-[#1E3A5F] my-8">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#1E3A5F]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                {editItem ? 'Editar Item' : 'Adicionar Novo Item'}
              </h2>
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
            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo <span className="text-red-400">*</span>
              </label>
              <select
                ref={tipoRef}
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, categoriaRef)}
                disabled={editItem}
                className={`w-full px-4 py-2.5 bg-[#1A2942] border ${
                  errors.tipo ? 'border-red-500' : 'border-[#1E3A5F]'
                } rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors ${
                  editItem ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                <option value="">Selecione um tipo</option>
                <option value="Produto">Produto</option>
                <option value="Insumo">Insumo</option>
                <option value="Fabricação">Fabricação</option>
                <option value="Beneficiamento">Beneficiamento</option>
              </select>
              {errors.tipo && (
                <p className="mt-1 text-sm text-red-400">{errors.tipo}</p>
              )}
            </div>

            {/* Categoria com botão + */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoria <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  ref={categoriaRef}
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, descricaoRef)}
                  disabled={editItem}
                  className={`flex-1 px-4 py-2.5 bg-[#1A2942] border ${
                    errors.categoria ? 'border-red-500' : 'border-[#1E3A5F]'
                  } rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors ${
                    editItem ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome} ({cat.startCode}-{cat.endCode})
                    </option>
                  ))}
                </select>
                {!editItem && (
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="px-3 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center"
                    title="Nova Categoria"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
              {errors.categoria && (
                <p className="mt-1 text-sm text-red-400">{errors.categoria}</p>
              )}
              {nextCode !== null && !editItem && (
                <p className="mt-1 text-sm text-green-400">
                  Próximo código disponível: {nextCode}
                </p>
              )}
              {nextCode === null && formData.categoria && !editItem && (
                <p className="mt-1 text-sm text-red-400">
                  Categoria cheia! Escolha outra categoria.
                </p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição <span className="text-red-400">*</span>
              </label>
              <input
                ref={descricaoRef}
                type="text"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, unidadeRef)}
                placeholder="Digite a descrição do item"
                className={`w-full px-4 py-2.5 bg-[#1A2942] border ${
                  errors.descricao ? 'border-red-500' : 'border-[#1E3A5F]'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
              />
              {errors.descricao && (
                <p className="mt-1 text-sm text-red-400">{errors.descricao}</p>
              )}
            </div>

            {/* Unidade de Medida */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Unidade de Medida <span className="text-red-400">*</span>
              </label>
              <select
                ref={unidadeRef}
                name="unidade"
                value={formData.unidade}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, formData.tipo === 'Insumo' ? qtdEmbalagemRef : custoUnitarioRef)}
                className={`w-full px-4 py-2.5 bg-[#1A2942] border ${
                  errors.unidade ? 'border-red-500' : 'border-[#1E3A5F]'
                } rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors`}
              >
                <option value="">Selecione uma unidade</option>
                <option value="KG">KG (Quilograma)</option>
                <option value="G">G (Grama)</option>
                <option value="L">L (Litro)</option>
                <option value="ML">ML (Mililitro)</option>
                <option value="UN">UN (Unidade)</option>
                <option value="CX">CX (Caixa)</option>
                <option value="PCT">PCT (Pacote)</option>
              </select>
              {errors.unidade && (
                <p className="mt-1 text-sm text-red-400">{errors.unidade}</p>
              )}
            </div>

            {/* Campos específicos para Insumo */}
            {isInsumo && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Qtd da Embalagem <span className="text-red-400">*</span>
                    </label>
                    <input
                      ref={qtdEmbalagemRef}
                      type="number"
                      name="qtdEmbalagem"
                      value={formData.qtdEmbalagem}
                      onChange={handleChange}
                      onKeyDown={(e) => handleKeyDown(e, custoEmbalagemRef)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-2.5 bg-[#1A2942] border ${
                        errors.qtdEmbalagem ? 'border-red-500' : 'border-[#1E3A5F]'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                    {errors.qtdEmbalagem && (
                      <p className="mt-1 text-sm text-red-400">{errors.qtdEmbalagem}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Custo da Embalagem (R$) <span className="text-red-400">*</span>
                    </label>
                    <input
                      ref={custoEmbalagemRef}
                      type="number"
                      name="custoEmbalagem"
                      value={formData.custoEmbalagem}
                      onChange={handleChange}
                      onKeyDown={(e) => handleKeyDown(e, submitButtonRef)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-2.5 bg-[#1A2942] border ${
                        errors.custoEmbalagem ? 'border-red-500' : 'border-[#1E3A5F]'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                    {errors.custoEmbalagem && (
                      <p className="mt-1 text-sm text-red-400">{errors.custoEmbalagem}</p>
                    )}
                  </div>
                </div>

                {/* Custo Unitário Calculado */}
                {formData.qtdEmbalagem && formData.custoEmbalagem && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-sm text-green-300">
                      <strong>Custo Unitário (calculado automaticamente):</strong>{' '}
                      R$ {(parseFloat(formData.custoEmbalagem) / parseFloat(formData.qtdEmbalagem)).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Custo da Embalagem ÷ Quantidade da Embalagem
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Custo Unitário para Produto */}
            {!isInsumo && formData.tipo && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custo Unitário (R$)
                </label>
                <input
                  ref={custoUnitarioRef}
                  type="number"
                  name="custoUnitario"
                  value={formData.custoUnitario}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, submitButtonRef)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2.5 bg-[#1A2942] border border-[#1E3A5F] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            )}

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
                ref={submitButtonRef}
                type="submit"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {editItem ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Categoria */}
      <ModalCategoria
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleCategorySave}
      />
    </>
  );
}
