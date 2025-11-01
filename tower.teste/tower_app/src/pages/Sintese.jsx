import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import storage from '../services/storage';

export default function Sintese() {
  const [categorizedData, setCategorizedData] = useState([]);
  const [totalItens, setTotalItens] = useState(0);
  const [totalCusto, setTotalCusto] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const cats = storage.getCategories();
      const allItems = storage.getItems();

      console.log('=== DEBUG SÍNTESE ===');
      console.log('Categorias:', cats);
      console.log('Todos os itens:', allItems);

      const grouped = cats.map(cat => {
        const categoryItems = allItems.filter(item => {
          return item.categoriaId === cat.id;
        });

        const totalCustoCat = categoryItems.reduce((sum, item) => sum + (parseFloat(item.custoUnitario) || 0), 0);

        return {
          ...cat,
          itens: categoryItems,
          totalCusto: totalCustoCat,
          quantidadeItens: categoryItems.length
        };
      }).filter(cat => cat.itens.length > 0);

      console.log('Dados agrupados:', grouped);

      setCategorizedData(grouped);
      setTotalItens(grouped.reduce((sum, cat) => sum + cat.quantidadeItens, 0));
      setTotalCusto(grouped.reduce((sum, cat) => sum + cat.totalCusto, 0));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <div className="flex-1">
        {/* Cabeçalho Fixo */}
        <div className="bg-[#0A1929] border-b border-[#1E3A5F] px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white uppercase">SÍNTESE DA PRECIFICAÇÃO</h1>
                <p className="text-sm text-gray-400">Análise consolidada de vendas por categoria</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#1A2942] px-6 py-3 rounded-lg border border-[#1E3A5F] min-w-[180px]">
                <div className="text-xs text-gray-400 mb-1 text-center">TOTAL DE VENDAS</div>
                <div className="text-3xl font-bold text-white text-center">{totalItens}</div>
              </div>
              
              <div className="bg-[#1A2942] px-6 py-3 rounded-lg border border-[#1E3A5F] min-w-[180px]">
                <div className="text-xs text-gray-400 mb-1 text-center">CATEGORIAS ATIVAS</div>
                <div className="text-3xl font-bold text-white text-center">{categorizedData.length}</div>
              </div>

              <button
                onClick={loadData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors ml-4"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {categorizedData.length === 0 ? (
              <div className="bg-[#0A1929] p-12 rounded-lg border border-[#1E3A5F] text-center">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum Item Cadastrado</h3>
                <p className="text-gray-400 mb-4">
                  Cadastre produtos ou insumos na seção de Cadastramento para visualizar a síntese.
                </p>
                <a
                  href="/cadastramento"
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Ir para Cadastramento
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {categorizedData.map((category) => (
                  <div key={category.id} className="bg-[#0A1929] rounded-lg border border-[#1E3A5F] overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-center">
                      <h3 className="text-lg font-bold text-white uppercase">{category.nome}</h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#1A2942]">
                          <tr>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">Produtos</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">CMV/CPV/CGV</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">Preço de Venda do Produto</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">Margem do Produto</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">CMV/CPV/CGV do Produto</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">Desempenho do Produto</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">Vendas</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">Total de Vendas do Produto</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">Margem</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">CMV/CPV/CGV do Produto</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">Desempenho do Produto</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1E3A5F]">
                          {category.itens.map((item) => {
                            const cmv = parseFloat(item.custoUnitario) || 0;
                            const precoVenda = cmv * 1.5;
                            const margem = precoVenda > 0 ? ((precoVenda - cmv) / precoVenda * 100).toFixed(0) : 0;
                            const cmvPercent = precoVenda > 0 ? ((cmv / precoVenda) * 100).toFixed(0) : 0;
                            const vendas = 0;
                            const totalVendas = vendas * precoVenda;

                            return (
                              <tr key={item.id} className="hover:bg-[#1A2942] transition-colors">
                                <td className="px-4 py-3 text-sm text-white">{item.descricao}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-300">R$ {cmv.toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-300">R$ {precoVenda.toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-300">{margem}%</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-300">{cmvPercent}%</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-300">%</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-300">{vendas}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-300">R$ {totalVendas.toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-300">%</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-300">%</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-300">%</td>
                                <td className="px-4 py-3 text-sm text-center">
                                  <button className="text-blue-400 hover:text-blue-300 text-xs">
                                    ✏️
                                  </button>
                                </td>
                              </tr>
                            );
                          })}

                          <tr className="bg-[#0F1F35] font-semibold">
                            <td className="px-4 py-3 text-sm text-white">TOTAL</td>
                            <td className="px-4 py-3 text-sm text-center text-white">R$ {category.totalCusto.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-center text-white">R$ {(category.totalCusto * 1.5).toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-center text-white">-</td>
                            <td className="px-4 py-3 text-sm text-center text-white">-</td>
                            <td className="px-4 py-3 text-sm text-center text-white">-</td>
                            <td className="px-4 py-3 text-sm text-center text-white">{category.quantidadeItens}</td>
                            <td className="px-4 py-3 text-sm text-center text-white">R$ 0,00</td>
                            <td className="px-4 py-3 text-sm text-center text-white">R$ 0,00</td>
                            <td className="px-4 py-3 text-sm text-center text-white">R$ 0,00</td>
                            <td className="px-4 py-3 text-sm text-center text-white">R$ 0,00</td>
                            <td className="px-4 py-3 text-sm text-center"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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

