import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ModalSalvarFicha from '../components/ModalSalvarFicha';
import storage from '../services/storage';

export default function FichaTecnica() {
  const [modalOpen, setModalOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [tipoFichaTecnica, setTipoFichaTecnica] = useState('produto');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCodigo, setSearchCodigo] = useState('');
  const [searchItem, setSearchItem] = useState('');
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [nomeProdutoPrincipal, setNomeProdutoPrincipal] = useState('NOME DO PRODUTO');
  const [codigoProdutoPrincipal, setCodigoProdutoPrincipal] = useState('-');

  // Produtos da tabela (inicialmente vazia)
  const [produtos, setProdutos] = useState([]);

  // Carregar todos os produtos do storage
  useEffect(() => {
    const items = storage.getItems();
    setProdutosDisponiveis(items);
  }, []);

  // Carregar ficha salva se houver ID na URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fichaId = params.get('id');
    
    if (fichaId) {
      const fichas = JSON.parse(localStorage.getItem('fichasTecnicas') || '[]');
      const ficha = fichas.find(f => f.id === parseInt(fichaId));
      
      if (ficha) {
        // Carregar produtos
        if (ficha.produtos) setProdutos(ficha.produtos);
        
        // Carregar nome do produto
        if (ficha.nomeProdutoPrincipal) setNomeProdutoPrincipal(ficha.nomeProdutoPrincipal);
        
        // Carregar embalagem
        if (ficha.embalagem) setEmbalagem(ficha.embalagem);
        
        // Carregar cardápio
        if (ficha.cardapio) setCardapio(ficha.cardapio);
        
        // Carregar promocional
        if (ficha.promocional) setPromocional(ficha.promocional);
        
        // Carregar preço-c
        if (ficha.precoC) setPrecoC(ficha.precoC);
        
        // Carregar preço-d
        if (ficha.precoD) setPrecoD(ficha.precoD);
      }
    }
  }, []);

  const [showDropdown, setShowDropdown] = useState(false);

  // Filtrar produtos pela busca
  const produtosFiltrados = produtosDisponiveis.filter(item => {
    // Filtro por busca de código
    if (searchCodigo) {
      const search = searchCodigo.toLowerCase();
      if (!item.codigo.toLowerCase().includes(search)) return false;
    }
    
    // Filtro por busca de item/descrição
    if (searchItem) {
      const search = searchItem.toLowerCase();
      if (!item.descricao.toLowerCase().includes(search)) return false;
    }
    
    // Filtro por busca geral (mantido para compatibilidade)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        item.codigo.toLowerCase().includes(search) ||
        item.descricao.toLowerCase().includes(search)
      );
    }
    
    return true;
  });

  // Selecionar produto principal (barra de pesquisa superior)
  const handleSelectProdutoPrincipal = (item) => {
    setNomeProdutoPrincipal(item.descricao);
    setCodigoProdutoPrincipal(item.codigo);
    setSearchTerm('');
    setShowDropdown(false);
  };

  // Adicionar produto à tabela de composição
  const handleAddProduto = (item) => {
    // Verificar se o produto já existe na lista
    const produtoExiste = produtos.find(p => p.codigo === item.codigo);
    
    if (produtoExiste) {
      setSaveMessage({ 
        type: 'error', 
        text: `O produto "${item.descricao}" já foi adicionado à lista!` 
      });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
      setShowDropdown(false);
      return;
    }
    
    // Determinar tipo e cor baseado no item
    let tipoItem = 'insumo';
    let corTipo = 'yellow';
    
    const tipoLower = (item.tipo || '').toLowerCase();
    const categoriaLower = (item.categoria || '').toLowerCase();
    
    if (tipoLower === 'insumo') {
      tipoItem = 'insumo';
      corTipo = 'yellow';
    } else if (tipoLower === 'fabricação') {
      tipoItem = 'fabricacao';
      corTipo = 'blue';
    } else if (tipoLower === 'beneficiamento') {
      tipoItem = 'beneficiamento';
      corTipo = 'green';
    } else if (tipoLower === 'produto') {
      if (categoriaLower.includes('fabrica')) {
        tipoItem = 'fabricacao';
        corTipo = 'blue';
      } else if (categoriaLower.includes('beneficiamento')) {
        tipoItem = 'beneficiamento';
        corTipo = 'green';
      } else {
        tipoItem = 'produto';
        corTipo = 'blue';
      }
    }
    
    const novoProduto = {
      codigo: item.codigo,
      nome: item.descricao,
      qtd: 1,
      valor: parseFloat(item.custoUnitario) || 0,
      tipo: tipoItem,
      cor: corTipo
    };
    
    setProdutos([...produtos, novoProduto]);
    setSearchCodigo('');
    setSearchItem('');
    setShowDropdown(false);
  };

  // Produtos de embalagem
  const [embalagem, setEmbalagem] = useState([
    { codigo: '000', nome: 'INSUMO', qtd: 0.00, valor: 0.00 }
  ]);

  // Estados para os custos dos 4 cards
  const [cardapio, setCardapio] = useState({
    custoProducao: { percent: 0, value: 0 },
    impostos: { percent: 0, value: 0 },
    pessoal: { percent: 0, value: 0 },
    custosOperacionais: { percent: 0, value: 0 },
    despesas: { percent: 0, value: 0 },
    margemLucro: { percent: 0, value: 0 }
  });

  const [promocional, setPromocional] = useState({
    custoProducao: { percent: 0, value: 0 },
    impostos: { percent: 0, value: 0 },
    pessoal: { percent: 0, value: 0 },
    custosOperacionais: { percent: 0, value: 0 },
    despesas: { percent: 0, value: 0 },
    margemLucro: { percent: 0, value: 0 }
  });

  const [precoC, setPrecoC] = useState({
    custoProducao: { percent: 0, value: 0 },
    impostos: { percent: 0, value: 0 },
    pessoal: { percent: 0, value: 0 },
    custosOperacionais: { percent: 0, value: 0 },
    despesas: { percent: 0, value: 0 },
    margemLucro: { percent: 0, value: 0 }
  });

  const [precoD, setPrecoD] = useState({
    custoProducao: { percent: 0, value: 0 },
    impostos: { percent: 0, value: 0 },
    pessoal: { percent: 0, value: 0 },
    custosOperacionais: { percent: 0, value: 0 },
    despesas: { percent: 0, value: 0 },
    margemLucro: { percent: 0, value: 0 }
  });

  const handleSaveFicha = async () => {
    try {
      const fichas = JSON.parse(localStorage.getItem('fichasTecnicas') || '[]');
      
      const novaFicha = {
        id: Date.now(),
        product_name: nomeProdutoPrincipal || 'Ficha Técnica',
        product_code: '000',
        template_type: 'geral',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        nomeProdutoPrincipal: nomeProdutoPrincipal,
        produtos: produtos,
        embalagem: embalagem,
        cardapio: cardapio,
        promocional: promocional,
        precoC: precoC,
        precoD: precoD
      };
      
      fichas.push(novaFicha);
      localStorage.setItem('fichasTecnicas', JSON.stringify(fichas));
      
      setSaveMessage({ type: 'success', text: 'Ficha técnica salva com sucesso!' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Erro ao salvar ficha:', error);
      setSaveMessage({ type: 'error', text: 'Erro ao salvar ficha técnica.' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleProdutoChange = (index, field, value) => {
    const newProdutos = [...produtos];
    newProdutos[index][field] = value;
    setProdutos(newProdutos);
  };

  const handleEmbalagemChange = (index, field, value) => {
    const newEmbalagem = [...embalagem];
    newEmbalagem[index][field] = value;
    setEmbalagem(newEmbalagem);
  };

  const handleCustoChange = (card, field, type, value) => {
    const setter = card === 'cardapio' ? setCardapio : 
                   card === 'promocional' ? setPromocional :
                   card === 'precoC' ? setPrecoC : setPrecoD;
    
    setter(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: parseFloat(value) || 0
      }
    }));
  };

  const calcularFaturamento = (custos) => {
    return Object.values(custos).reduce((sum, item) => sum + (item.value || 0), 0);
  };

  const calcularTotalProdutos = () => {
    return produtos.reduce((sum, p) => sum + ((p.qtd || 0) * (parseFloat(p.valor) || 0)), 0);
  };

  const calcularTotalEmbalagem = () => {
    return embalagem.reduce((sum, e) => sum + ((parseFloat(e.qtd) || 0) * (parseFloat(e.valor) || 0)), 0);
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <div className="flex-1 p-4 overflow-auto bg-black">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-blue-400 mb-4">FICHA TÉCNICA DE DESEMPENHO DO PRODUTO</h1>
          
          {/* Barra de Controles - Tipo de Ficha + Pesquisa + Botão Salvar */}
          <div className="grid grid-cols-[240px_1fr_auto] gap-3 items-end">
            {/* Seletor de Tipo de Ficha Técnica - PRIMEIRO */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Tipo de Ficha Técnica
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <select 
                  value={tipoFichaTecnica}
                  onChange={(e) => setTipoFichaTecnica(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-9 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer hover:border-gray-600 appearance-none"
                >
                  <option value="produto">PRODUTO</option>
                  <option value="fabricacao">FABRICAÇÃO</option>
                  <option value="beneficiamento">BENEFICIAMENTO</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Barra de Pesquisa - SEGUNDO */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Pesquisar Produto
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value) {
                      setShowDropdown(true);
                    } else {
                      setShowDropdown(false);
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  placeholder="Digite o código ou nome do produto..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all hover:border-gray-600"
                />
                {showDropdown && produtosFiltrados.length > 0 && searchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-blue-500/30 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
                    {produtosFiltrados.map((item) => {
                    // Determinar tipo e cor
                    let tipoBadge = '';
                    let tipoCor = '';
                    
                    const tipoLower = (item.tipo || '').toLowerCase();
                    
                    if (tipoLower === 'insumo') {
                      tipoBadge = 'INSUMO';
                      tipoCor = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
                    } else if (tipoLower === 'produto') {
                      tipoBadge = 'PRODUTO';
                      tipoCor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                    } else if (tipoLower === 'fabricação') {
                      tipoBadge = 'FABRICAÇÃO';
                      tipoCor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                    } else if (tipoLower === 'beneficiamento') {
                      tipoBadge = 'BENEFICIAMENTO';
                      tipoCor = 'bg-green-500/20 text-green-400 border-green-500/30';
                    } else {
                      tipoBadge = 'PRODUTO';
                      tipoCor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                    }
                    
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          handleSelectProdutoPrincipal(item);
                        }}
                        className="px-4 py-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-b-0 transition-all"
                      >
                        <div className="flex items-center justify-between gap-4">
                          {/* Código */}
                          <div className="flex-shrink-0">
                            <div className="text-gray-400 text-xs font-medium mb-0.5">Cód</div>
                            <div className="text-white font-bold text-sm font-mono">{item.codigo}</div>
                          </div>
                          
                          {/* Nome e Tipo */}
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold text-sm mb-1 truncate">{item.descricao}</div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${tipoCor}`}>
                              {tipoBadge}
                            </span>
                          </div>
                          
                          {/* Preço */}
                          <div className="flex-shrink-0 text-right">
                            <div className="text-green-400 font-bold text-base">
                              R$ {item.custoUnitario && !isNaN(parseFloat(item.custoUnitario)) ? parseFloat(item.custoUnitario).toFixed(2) : '0.00'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                )}
              </div>
            </div>

            {/* Botão Salvar - TERCEIRO (na mesma linha) */}
            <button
              onClick={handleSaveFicha}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-green-600/50 whitespace-nowrap"
            >
              <Save className="w-4 h-4" />
              Salvar Ficha Técnica
            </button>
          </div>
        </div>

        {/* Mensagem de sucesso/erro */}
        {saveMessage.text && (
          <div className={`mb-4 p-3 rounded ${
            saveMessage.type === 'success' ? 'bg-green-600/20 border border-green-600 text-green-400' : 'bg-red-600/20 border border-red-600 text-red-400'
          }`}>
            {saveMessage.text}
          </div>
        )}

        {/* Layout Principal */}
        <div className="flex gap-2">
          {/* Coluna Esquerda - Tabela de Produtos */}
          <div className="w-[550px] flex-shrink-0">
            {/* Header da Tabela */}
            <div className="bg-black border-2 border-cyan-500/50 rounded-t overflow-hidden shadow-lg shadow-cyan-500/20">
              {/* Header com 3 linhas */}
              <div className="bg-gradient-to-b from-gray-900 to-black">
                {/* Primeira linha - Produto Selecionado */}
                <div className="grid grid-cols-[180px_1fr] border-b border-cyan-500/50 bg-gray-800/50">
                  <div className="px-3 py-2 border-r border-cyan-500/30 flex items-center gap-2">
                    <span className="text-gray-400 text-[10px] font-medium">Código do Produto</span>
                    <span className="text-white font-bold text-xs font-mono">{codigoProdutoPrincipal}</span>
                  </div>
                  <div className="px-3 py-2 flex items-center gap-2">
                    <span className="text-gray-400 text-[10px] font-medium">Descrição do Produto</span>
                    <span className="text-white font-bold text-xs truncate">{nomeProdutoPrincipal}</span>
                  </div>
                </div>
                
                {/* Segunda linha - Cabeçalhos e Campos de busca */}
                <div className="grid grid-cols-[100px_1fr_50px_60px] border-b border-cyan-500/30">
                  <div className="text-cyan-400 p-2 text-[11px] font-bold border-r border-cyan-500/30">CÓDIGO</div>
                  <div className="text-cyan-400 p-2 text-[10px] font-medium border-r border-cyan-500/30">Descrição</div>
                <div className="text-cyan-400 p-2 text-[11px] font-bold text-right border-r border-cyan-500/30">Qtd</div>
                  <div className="text-cyan-400 p-2 text-[11px] font-bold text-right">R$</div>
                </div>
                
                {/* Terceira linha - Campos de busca */}
                <div className="relative grid grid-cols-[100px_1fr_50px_60px] border-b border-cyan-500/50">
                  <input
                    type="text"
                    value={searchCodigo}
                    onChange={(e) => {
                      setSearchCodigo(e.target.value);
                      if (e.target.value) {
                        setShowDropdown(true);
                      } else {
                        setShowDropdown(false);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    placeholder="Código..."
                    className="bg-gray-800 text-white text-[11px] p-2 border-r border-cyan-500/30 focus:outline-none focus:bg-gray-700 transition-colors"
                  />
                  <input
                    type="text"
                    value={searchItem}
                    onChange={(e) => {
                      setSearchItem(e.target.value);
                      if (e.target.value) {
                        setShowDropdown(true);
                      } else {
                        setShowDropdown(false);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    placeholder="Nome do produto..."
                    className="bg-gray-800 text-white text-[11px] p-2 border-r border-cyan-500/30 focus:outline-none focus:bg-gray-700 transition-colors"
                  />
                  <div className="border-r border-cyan-500/30"></div>
                  <div></div>
                  {showDropdown && produtosFiltrados.length > 0 && (searchCodigo || searchItem) && (
                    <div className="absolute top-full left-0 right-0 bg-gray-900 border-2 border-cyan-500/50 rounded-b shadow-2xl max-h-60 overflow-y-auto z-50">
                      {produtosFiltrados.map((item) => {
                        let tipoBadge = '';
                        let tipoCor = '';
                        const tipoLower = (item.tipo || '').toLowerCase();
                        
                        if (tipoLower === 'insumo') {
                          tipoBadge = 'INSUMO';
                          tipoCor = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
                        } else if (tipoLower === 'fabricação') {
                          tipoBadge = 'FABRICAÇÃO';
                          tipoCor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                        } else if (tipoLower === 'beneficiamento') {
                          tipoBadge = 'BENEFICIAMENTO';
                          tipoCor = 'bg-green-500/20 text-green-400 border-green-500/30';
                        } else {
                          tipoBadge = 'PRODUTO';
                          tipoCor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                        }
                        
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleAddProduto(item)}
                            className="px-3 py-2.5 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-b-0 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              {/* Código */}
                              <div className="flex-shrink-0 min-w-[60px]">
                                <div className="text-cyan-400 font-bold text-[11px] font-mono">{item.codigo}</div>
                              </div>
                              
                              {/* Nome e Tipo */}
                              <div className="flex-1 min-w-0">
                                <div className="text-white font-semibold text-[11px] mb-1 truncate">{item.descricao}</div>
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${tipoCor}`}>
                                  {tipoBadge}
                                </span>
                              </div>
                              
                              {/* Preço */}
                              <div className="flex-shrink-0">
                                <div className="text-green-400 font-bold text-[11px]">
                                  R$ {item.custoUnitario && !isNaN(parseFloat(item.custoUnitario)) ? parseFloat(item.custoUnitario).toFixed(2) : '0.00'}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Container com Scroll para Produtos */}
              <div className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-900 [&::-webkit-scrollbar-thumb]:bg-cyan-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-cyan-400">
                {/* Produtos */}
                {produtos.map((produto, index) => {
                  const valorTotal = (produto.qtd || 0) * (produto.valor || 0);
                  return (
                  <div key={index} className="grid grid-cols-[100px_1fr_50px_60px] border-b border-cyan-500/20 bg-gradient-to-r from-gray-900/50 to-black hover:from-gray-800/50 transition-all">
                    <div className="text-gray-400 p-2 text-[10px] font-mono bg-transparent border-r border-cyan-500/20 flex items-center">
                      {produto.codigo}
                    </div>
                    <div className={`p-2 text-[11px] font-bold bg-transparent border-r border-cyan-500/20 flex items-center ${
                        produto.tipo === 'insumo' ? 'text-yellow-400' :
                        produto.tipo === 'fabricacao' ? 'text-cyan-400' : 'text-green-400'
                      }`}>
                      {produto.nome}
                    </div>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={produto.qtd}
                      onChange={(e) => handleProdutoChange(index, 'qtd', parseInt(e.target.value) || 1)}
                      className="text-white p-2 text-[11px] text-right bg-transparent border-r border-cyan-500/20 outline-none focus:bg-gray-800/50 transition-colors w-full"
                    />
                    <div className="text-green-400 p-2 text-[11px] text-right bg-transparent font-bold flex items-center justify-end">
                      {valorTotal.toFixed(2)}
                    </div>
                  </div>
                  );
                })}

                {/* Linhas vazias */}
                {[...Array(7 - produtos.length)].map((_, i) => (
                  <div key={`empty-${i}`} className="grid grid-cols-[100px_1fr_50px_60px] border-b border-cyan-500/10 bg-black">
                    <div className="p-2 text-[11px] border-r border-cyan-500/10">&nbsp;</div>
                    <div className="p-2 text-[11px] border-r border-cyan-500/10">&nbsp;</div>
                    <div className="p-2 text-[11px] border-r border-cyan-500/10">&nbsp;</div>
                    <div className="p-2 text-[11px]">&nbsp;</div>
                  </div>
                ))}
              </div>
              {/* Fim do Container com Scroll */}

              {/* Seção EMBALAGEM */}
              <div className="grid grid-cols-[100px_1fr_50px_60px] bg-gradient-to-r from-yellow-900/50 to-yellow-700/50 border-y border-yellow-500/50">
                <div className="col-span-4 text-yellow-200 p-2 text-center font-bold text-xs tracking-wider">
                  EMBALAGEM
                </div>
              </div>

              {/* Produto de Embalagem */}
              {embalagem.map((item, index) => (
                <div key={index} className="grid grid-cols-[100px_1fr_50px_60px] border-b border-blue-500 bg-[#0A1929]">
                  <div className="text-gray-400 p-2 text-[10px] border-r border-blue-500">
                    {item.codigo}
                  </div>
                  <div className="text-yellow-400 p-2 text-[10px] font-bold border-r border-blue-500">
                    {item.nome}
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={item.qtd}
                    onChange={(e) => handleEmbalagemChange(index, 'qtd', e.target.value)}
                    className="text-white p-2 text-[10px] text-right bg-transparent border-r border-blue-500 outline-none focus:bg-gray-800/50 transition-colors"
                  />
                  <div className="text-gray-300 p-2 text-[10px] text-right">
                    {(item.qtd * item.valor).toFixed(2)}
                  </div>
                </div>
              ))}

              {/* Linhas vazias embalagem */}
              {[...Array(3)].map((_, i) => (
                <div key={`empty-emb-${i}`} className="grid grid-cols-[100px_1fr_50px_60px] border-b border-blue-500 bg-[#0A1929]">
                  <div className="p-2 text-[10px] border-r border-blue-500">&nbsp;</div>
                  <div className="p-2 text-[10px] border-r border-blue-500">&nbsp;</div>
                  <div className="p-2 text-[10px] border-r border-blue-500">&nbsp;</div>
                  <div className="p-2 text-[10px]">&nbsp;</div>
                </div>
              ))}

              {/* Custo da Matéria-Prima */}
              <div className="grid grid-cols-[100px_1fr_50px_60px] border-b border-blue-500 bg-gray-700">
                <div className="text-yellow-400 p-2 text-[10px] font-bold border-r border-blue-500 col-span-2">Custo da Matéria-Prima</div>
                <div className="text-white p-2 text-[10px] text-right border-r border-blue-500">{calcularTotalProdutos().toFixed(2)}</div>
                <div className="text-yellow-400 p-2 text-[10px] text-right">{(calcularTotalProdutos() + calcularTotalEmbalagem()).toFixed(2)}</div>
              </div>

              {/* Linhas KG e UND */}
              <div className="grid grid-cols-[100px_1fr_50px_60px] border-b border-blue-500 bg-gray-700">
                <div className="text-gray-400 p-2 text-[10px] border-r border-blue-500">KG</div>
                <div className="text-cyan-400 p-2 text-[10px] font-bold border-r border-blue-500">
                  {nomeProdutoPrincipal}
                </div>
                <div className="text-white p-2 text-[10px] text-right border-r border-blue-500">0,00</div>
                <div className="text-gray-300 p-2 text-[10px] text-right">0,00</div>
              </div>

              <div className="grid grid-cols-[100px_1fr_50px_60px] border-b border-blue-500 bg-gray-700">
                <div className="text-gray-400 p-2 text-[10px] border-r border-blue-500">UND</div>
                <div className="p-2 text-[10px] border-r border-blue-500"></div>
                <div className="text-white p-2 text-[10px] text-right border-r border-blue-500">0,00</div>
                <div className="text-gray-300 p-2 text-[10px] text-right">0,00</div>
              </div>

              {/* Seção de Custos */}
              <div className="bg-gray-800">
                <div className="grid grid-cols-[1fr_60px_60px] border-b border-blue-500">
                  <div className="text-white p-2 text-[10px] font-bold border-r border-blue-500">CUSTO DE PRODUÇÃO</div>
                  <div className="text-white p-2 text-[10px] text-right border-r border-blue-500">0,00%</div>
                  <div className="text-red-400 p-2 text-[10px] text-right">0,00</div>
                </div>

                <div className="grid grid-cols-[1fr_60px_60px] border-b border-blue-500">
                  <div className="text-white p-2 text-[10px] font-bold border-r border-blue-500">IMPOSTOS</div>
                  <div className="text-white p-2 text-[10px] text-right border-r border-blue-500">0,00%</div>
                  <div className="text-red-400 p-2 text-[10px] text-right">0,00</div>
                </div>

                <div className="grid grid-cols-[1fr_60px_60px] border-b border-blue-500">
                  <div className="text-white p-2 text-[10px] font-bold border-r border-blue-500">PESSOAL</div>
                  <div className="text-white p-2 text-[10px] text-right border-r border-blue-500">0,00%</div>
                  <div className="text-red-400 p-2 text-[10px] text-right">0,00</div>
                </div>

                <div className="grid grid-cols-[1fr_60px_60px] border-b border-blue-500">
                  <div className="text-white p-2 text-[10px] font-bold border-r border-blue-500">CUSTOS OPERACIONAIS</div>
                  <div className="text-white p-2 text-[10px] text-right border-r border-blue-500">0,00%</div>
                  <div className="text-red-400 p-2 text-[10px] text-right">0,00</div>
                </div>

                <div className="grid grid-cols-[1fr_60px_60px] border-b border-blue-500">
                  <div className="text-white p-2 text-[10px] font-bold border-r border-blue-500">DESPESAS</div>
                  <div className="text-white p-2 text-[10px] text-right border-r border-blue-500">0,00%</div>
                  <div className="text-red-400 p-2 text-[10px] text-right">0,00</div>
                </div>

                <div className="grid grid-cols-[1fr_60px_60px] border-b border-blue-500">
                  <div className="text-white p-2 text-[10px] font-bold border-r border-blue-500">MARGEM DE LUCRO</div>
                  <div className="text-white p-2 text-[10px] text-right border-r border-blue-500">0,00%</div>
                  <div className="text-green-400 p-2 text-[10px] text-right">R$ 0,00</div>
                </div>
              </div>

              {/* Footer PRECIFICADO */}
              <div className="grid grid-cols-[1fr_60px_80px] bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-b border-t-2 border-cyan-400">
                <div className="text-white p-3 text-xs font-bold border-r border-cyan-400 uppercase tracking-wider">PRECIFICADO</div>
                <div className="text-white p-3 text-xs font-bold text-center border-r border-cyan-400">100%</div>
                <div className="text-white p-3 text-xs font-bold text-right">R$ 0,00</div>
              </div>
            </div>

            {/* Legenda */}
            <div className="mt-3 bg-black border-2 border-cyan-500/50 rounded-lg p-4 shadow-lg shadow-cyan-500/20">
              <div className="text-cyan-400 text-xs font-bold mb-3 uppercase tracking-wider">CLASSIFICAÇÃO DE TIPO</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-gray-900/50 rounded">
                  <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50"></div>
                  <span className="text-yellow-400 text-[11px] font-semibold">INSUMO</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-900/50 rounded">
                  <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
                  <span className="text-cyan-400 text-[11px] font-semibold">FABRICAÇÃO</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-900/50 rounded">
                  <div className="w-4 h-4 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                  <span className="text-green-400 text-[11px] font-semibold">BENEFICIAMENTO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita - 3 COLUNAS VERTICAIS COMPLETAS */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-2">
              {[
                { titulo: 'CARDÁPIO', dados: cardapio },
                { titulo: 'PROMOCIONAL', dados: promocional },
                { titulo: 'PREÇO - C', dados: precoC }
              ].map((card, index) => (
                <div key={index} className="flex flex-col gap-2">
                  {/* Card Superior com Dados */}
                  <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-yellow-600 rounded overflow-hidden">
                  <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-2.5">
                    <table className="w-full text-[9px]">
                      <tbody>
                        {Object.entries(card.dados).map(([key, value]) => (
                          <tr key={key} className="border-b border-gray-700/30">
                            <td className="text-white font-semibold uppercase py-1 text-[9px]">
                              {key === 'custoProducao' ? 'CUSTO DE PRODUÇÃO' :
                               key === 'impostos' ? 'IMPOSTOS' :
                               key === 'pessoal' ? 'PESSOAL' :
                               key === 'custosOperacionais' ? 'CUSTOS OPERACIONAIS' :
                               key === 'despesas' ? 'DESPESAS' : 'MARGEM DE LUCRO'}
                            </td>
                            <td className="text-white text-right font-bold py-1 w-12 text-[9px]">{value.percent.toFixed(3)}%</td>
                            <td className={`text-right font-bold py-1 w-10 text-[9px] ${key === 'margemLucro' ? 'text-lime-400' : 'text-red-400'}`}>
                              {value.value.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
            </div>

                  {/* Área de Separação */}
                  <div className="bg-black border-2 border-yellow-600 rounded overflow-hidden">
                  <div className="bg-gradient-to-b from-blue-900/80 to-blue-950/90 h-32 flex items-center justify-center">
                    <div className="text-gray-600 text-[10px]"></div>
                  </div>
                  </div>
                  
                  {/* Card com APLICADO */}
                  <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-yellow-600 rounded overflow-hidden flex flex-col">
                  <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 p-2.5">
                    <table className="w-full text-[9px]">
                      <tbody>
                        {Object.entries(card.dados).map(([key, value]) => (
                          <tr key={key} className="border-b border-gray-700/30">
                            <td className="text-white uppercase font-semibold py-1 pr-1 text-[9px]">
                              {key === 'custoProducao' ? 'CUSTO DE PRODUÇÃO' :
                               key === 'impostos' ? 'IMPOSTOS' :
                               key === 'pessoal' ? 'PESSOAL' :
                               key === 'custosOperacionais' ? 'CUSTOS OPERACIONAIS' :
                               key === 'despesas' ? 'DESPESAS' : 'MARGEM DE LUCRO'}
                            </td>
                            <td className="text-white text-right font-bold py-1 w-12 text-[9px]">{value.percent.toFixed(3)}%</td>
                            <td className={`text-right font-bold py-1 w-10 text-[9px] ${key === 'margemLucro' ? 'text-lime-400' : 'text-red-400'}`}>
                              {value.value.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-white px-3 py-1.5" style={{ backgroundColor: '#0077CF' }}>
                    {index === 0 ? (
                      <div className="flex items-center gap-4 text-[11px] font-bold">
                        <span className="uppercase tracking-wider">APLICADO</span>
                        <span className="text-sm ml-auto" style={{ color: '#005DA1' }}>100%</span>
                        <span className="text-sm" style={{ color: '#005DA1' }}>R$ {calcularFaturamento(card.dados).toFixed(2)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span style={{ color: '#005DA1' }}>100%</span>
                        <span style={{ color: '#005DA1' }}>R$ {calcularFaturamento(card.dados).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
            </div>

                  {/* Cards de Resumo */}
                  <div className="flex flex-col gap-px">
                  {/* Bloco FATURAMENTO */}
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded px-2 py-1 h-7 flex items-center">
                    {index === 0 && (
                      <div className="text-[10px] text-white font-bold uppercase leading-tight">FATURAMENTO</div>
                    )}
                    <div className="text-[11px] font-bold text-white leading-tight ml-auto">{calcularFaturamento(card.dados).toFixed(2)}</div>
                  </div>
                  
                  {/* Bloco LUCRO */}
                  <div className="bg-lime-500 border border-lime-600 rounded px-2 py-1 h-7 flex items-center">
                    {index === 0 && (
                      <div className="text-[10px] text-black font-bold uppercase leading-tight">LUCRO</div>
                    )}
                    <div className="text-[11px] font-bold leading-tight ml-auto" style={{ color: '#005DA1' }}>R$ {index === 0 ? card.dados.margemLucro.value.toFixed(2) : calcularFaturamento(card.dados).toFixed(2)}</div>
                  </div>
                  
                  {/* Bloco Percentual */}
                  <div className="bg-black border border-gray-700 rounded px-2 py-1 h-6 flex items-center justify-end">
                    <div className="text-[11px] text-white/70 leading-tight font-bold">0.0%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Salvar Ficha */}
      <ModalSalvarFicha
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveFicha}
        productName="Nova Ficha"
      />
    </div>
  );
}

