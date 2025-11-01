import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ModalItem from '../components/ModalItem';
import storage from '../services/storage';

export default function Cadastramento() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({});
  const [modalItemOpen, setModalItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setItems(storage.getItems());
    setCategories(storage.getCategories());
    setStats(storage.getStats());
  };

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      storage.updateItem(editingItem.id, itemData);
    } else {
      storage.addItem(itemData);
    }
    loadData();
    setEditingItem(null);
    setModalItemOpen(false);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setModalItemOpen(true);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      storage.deleteItem(id);
      loadData();
    }
  };

  const filteredItems = items.filter(item => {
    const search = searchTerm.toLowerCase();
    return (
      item.codigo.toLowerCase().includes(search) ||
      item.descricao.toLowerCase().includes(search) ||
      item.tipo.toLowerCase().includes(search) ||
      item.categoria.toLowerCase().includes(search)
    );
  });

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">CADASTRAMENTO</h1>
            <p className="text-gray-400">Gerencie produtos e insumos do sistema</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#0A1929] p-6 rounded-lg border border-[#1E3A5F]">
              <div className="text-2xl font-bold text-white">{stats.totalItems || 0}</div>
              <div className="text-sm text-gray-400 mt-1">Total de Itens</div>
            </div>
            <div className="bg-[#0A1929] p-6 rounded-lg border border-[#1E3A5F]">
              <div className="text-2xl font-bold text-yellow-400">{stats.totalProdutos || 0}</div>
              <div className="text-sm text-gray-400 mt-1">Produtos</div>
            </div>
            <div className="bg-[#0A1929] p-6 rounded-lg border border-[#1E3A5F]">
              <div className="text-2xl font-bold text-green-400">{stats.totalInsumos || 0}</div>
              <div className="text-sm text-gray-400 mt-1">Insumos</div>
            </div>
            <div className="bg-[#0A1929] p-6 rounded-lg border border-[#1E3A5F]">
              <div className="text-2xl font-bold text-blue-400">{stats.totalCategorias || 0}</div>
              <div className="text-sm text-gray-400 mt-1">Categorias</div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="bg-[#0A1929] p-6 rounded-lg border border-[#1E3A5F] mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por código, descrição, tipo ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1A2942] border border-[#1E3A5F] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Novo Item Button */}
              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalItemOpen(true);
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Item
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#0A1929] rounded-lg border border-[#1E3A5F] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1A2942]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Unidade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Qtd Emb.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Custo Emb.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Custo Unit.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A5F]">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-gray-400">
                        {searchTerm ? 'Nenhum item encontrado' : 'Nenhum item cadastrado. Clique em "Novo Item" para começar.'}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-[#1A2942] transition-colors">
                        <td className="px-4 py-3 text-sm text-white">{item.codigo}</td>
                        <td className="px-4 py-3 text-sm text-white">{item.descricao}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${
                            item.tipo === 'Produto' ? 'bg-white/20 text-white border-white/30' :
                            item.tipo === 'Insumo' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            item.tipo === 'Fabricação' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                            item.tipo === 'Beneficiamento' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            'bg-white/20 text-white border-white/30'
                          }`}>
                            {item.tipo}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300">{item.categoria}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{item.unidade}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">
                          {item.qtdEmbalagem !== null ? item.qtdEmbalagem : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300">
                          {item.custoEmbalagem !== null ? `R$ ${item.custoEmbalagem.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300">
                          R$ {item.custoUnitario.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Item */}
      <ModalItem
        isOpen={modalItemOpen}
        onClose={() => {
          setModalItemOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editItem={editingItem}
      />
    </div>
  );
}
