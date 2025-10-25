import { useState } from 'react';
import { X, Save, FileText } from 'lucide-react';

const TEMPLATES = [
  { id: 'cardapio', name: 'Cardápio', color: 'bg-yellow-700', description: 'Ficha para cardápio' },
  { id: 'promocional', name: 'Promocional', color: 'bg-blue-600', description: 'Ficha promocional' },
  { id: 'preco_c', name: 'Preço-C', color: 'bg-yellow-700', description: 'Precificação tipo C' },
  { id: 'preco_d', name: 'Preço-D', color: 'bg-yellow-700', description: 'Precificação tipo D' },
  { id: 'custo_real', name: 'Custo Real', color: 'bg-green-600', description: 'Custo real do produto' },
  { id: 'margem_lucro', name: 'Margem de Lucro', color: 'bg-purple-600', description: 'Análise de margem' },
];

export default function ModalSalvarFicha({ isOpen, onClose, onSave, productName }) {
  const [selectedTemplate, setSelectedTemplate] = useState('cardapio');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(selectedTemplate);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-white">Salvar Ficha Técnica</h2>
              <p className="text-sm text-gray-400">Produto: {productName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Selecione o tipo de ficha técnica:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-slate-700/50'
                    : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 ${template.color} rounded flex items-center justify-center flex-shrink-0`}>
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-400">{template.description}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Preview do template selecionado */}
          <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <h4 className="text-sm font-semibold text-white mb-2">Informações do Template:</h4>
            <div className="text-sm text-gray-300">
              {selectedTemplate === 'cardapio' && (
                <p>Ficha técnica padrão para cardápio com todos os custos e faturamento.</p>
              )}
              {selectedTemplate === 'promocional' && (
                <p>Ficha técnica para produtos em promoção com destaque para preços especiais.</p>
              )}
              {selectedTemplate === 'preco_c' && (
                <p>Modelo de precificação tipo C com análise detalhada de custos.</p>
              )}
              {selectedTemplate === 'preco_d' && (
                <p>Modelo de precificação tipo D com foco em margem de lucro.</p>
              )}
              {selectedTemplate === 'custo_real' && (
                <p>Análise de custo real do produto com todos os componentes.</p>
              )}
              {selectedTemplate === 'margem_lucro' && (
                <p>Análise focada na margem de lucro e rentabilidade do produto.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Ficha
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

