import { useState, useEffect } from 'react';
import { Package, FileText, TrendingUp, DollarSign, ShoppingCart, BarChart3, PieChart, Calendar } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import storage from '../services/storage';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalFichas: 0,
    produtosPorTipo: {
      produto: 0,
      insumo: 0,
      fabricacao: 0,
      beneficiamento: 0
    },
    fichasPorTipo: {
      cardapio: 0,
      promocional: 0,
      geral: 0,
      outros: 0
    }
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    // Carregar produtos
    const produtos = storage.getItems();
    
    // Carregar fichas técnicas
    const fichas = JSON.parse(localStorage.getItem('fichasTecnicas') || '[]');
    
    // Contar produtos por tipo
    const produtosPorTipo = {
      produto: 0,
      insumo: 0,
      fabricacao: 0,
      beneficiamento: 0
    };
    
    produtos.forEach(item => {
      const tipo = (item.tipo || '').toLowerCase();
      const categoria = (item.categoria || '').toLowerCase();
      
      if (tipo === 'insumo') {
        produtosPorTipo.insumo++;
      } else if (tipo === 'fabricacao' || categoria === 'fabricacao' || categoria === 'fabricação') {
        produtosPorTipo.fabricacao++;
      } else if (tipo === 'beneficiamento' || categoria === 'beneficiamento') {
        produtosPorTipo.beneficiamento++;
      } else {
        produtosPorTipo.produto++;
      }
    });
    
    // Contar fichas por tipo
    const fichasPorTipo = {
      cardapio: 0,
      promocional: 0,
      geral: 0,
      outros: 0
    };
    
    fichas.forEach(ficha => {
      const tipo = (ficha.template_type || '').toLowerCase();
      if (tipo === 'cardapio' || tipo === 'cardápio') {
        fichasPorTipo.cardapio++;
      } else if (tipo === 'promocional') {
        fichasPorTipo.promocional++;
      } else if (tipo === 'geral') {
        fichasPorTipo.geral++;
      } else {
        fichasPorTipo.outros++;
      }
    });
    
    setStats({
      totalProdutos: produtos.length,
      totalFichas: fichas.length,
      produtosPorTipo,
      fichasPorTipo
    });
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <span className={`text-3xl font-bold ${color}`}>{value}</span>
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
    </div>
  );

  const PieChartComponent = ({ data, title }) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (total === 0) return null;

    const colors = {
      produto: '#3b82f6',
      insumo: '#eab308',
      fabricacao: '#06b6d4',
      beneficiamento: '#10b981',
      cardapio: '#ca8a04',
      promocional: '#2563eb',
      geral: '#6b7280',
      outros: '#9333ea'
    };

    const labels = {
      produto: 'Produtos',
      insumo: 'Insumos',
      fabricacao: 'Fabricação',
      beneficiamento: 'Beneficiamento',
      cardapio: 'Cardápio',
      promocional: 'Promocional',
      geral: 'Geral',
      outros: 'Outros'
    };

    let currentAngle = -90;
    const segments = Object.entries(data).map(([key, value]) => {
      if (value === 0) return null;
      const percentage = (value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      const startX = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
      const startY = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
      const endX = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
      const endY = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
      const largeArc = angle > 180 ? 1 : 0;

      return {
        key,
        value,
        percentage: percentage.toFixed(1),
        color: colors[key],
        label: labels[key],
        path: `M 100 100 L ${startX} ${startY} A 80 80 0 ${largeArc} 1 ${endX} ${endY} Z`
      };
    }).filter(Boolean);

    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-400" />
          {title}
        </h3>
        <div className="flex items-center justify-center gap-8">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {segments.map((segment, i) => (
              <g key={i}>
                <path
                  d={segment.path}
                  fill={segment.color}
                  stroke="#1f2937"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              </g>
            ))}
            <circle cx="100" cy="100" r="50" fill="#111827" />
            <text x="100" y="95" textAnchor="middle" fill="#e5e7eb" fontSize="20" fontWeight="bold">
              {total}
            </text>
            <text x="100" y="110" textAnchor="middle" fill="#9ca3af" fontSize="12">
              Total
            </text>
          </svg>
          <div className="space-y-2">
            {segments.map((segment, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                <div>
                  <div className="text-sm text-gray-300">{segment.label}</div>
                  <div className="text-xs text-gray-500">{segment.value} ({segment.percentage}%)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const BarChartComponent = ({ data, title }) => {
    const maxValue = Math.max(...Object.values(data), 1);
    
    const colors = {
      produto: '#3b82f6',
      insumo: '#eab308',
      fabricacao: '#06b6d4',
      beneficiamento: '#10b981',
      cardapio: '#ca8a04',
      promocional: '#2563eb',
      geral: '#6b7280',
      outros: '#9333ea'
    };

    const labels = {
      produto: 'Produtos',
      insumo: 'Insumos',
      fabricacao: 'Fabricação',
      beneficiamento: 'Beneficiamento',
      cardapio: 'Cardápio',
      promocional: 'Promocional',
      geral: 'Geral',
      outros: 'Outros'
    };

    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          {title}
        </h3>
        <div className="space-y-4">
          {Object.entries(data).map(([key, value]) => {
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{labels[key]}</span>
                  <span className="text-sm font-semibold text-gray-400">{value}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: colors[key]
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const QuickActionCard = ({ icon: Icon, title, description, link, color }) => (
    <a
      href={link}
      className="block bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 group"
    >
      <div className={`p-3 rounded-lg ${color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </a>
  );

  return (
    <div style={{ display: 'flex', padding: '10px', gap: '10px', height: '100vh', backgroundColor: '#0a0a0a' }}>
      <Sidebar />
      
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-2">Dashboard</h1>
          <p className="text-gray-400">Visão geral do sistema de precificação Tower</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Package}
            title="Total de Produtos"
            value={stats.totalProdutos}
            color="text-blue-400"
            bgColor="bg-blue-500/20"
          />
          <StatCard
            icon={FileText}
            title="Fichas Técnicas"
            value={stats.totalFichas}
            color="text-green-400"
            bgColor="bg-green-500/20"
          />
          <StatCard
            icon={BarChart3}
            title="Categorias Ativas"
            value={Object.values(stats.produtosPorTipo).filter(v => v > 0).length}
            color="text-yellow-400"
            bgColor="bg-yellow-500/20"
          />
          <StatCard
            icon={TrendingUp}
            title="Taxa de Uso"
            value={stats.totalFichas > 0 ? "100%" : "0%"}
            color="text-purple-400"
            bgColor="bg-purple-500/20"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {stats.totalProdutos > 0 ? (
            <>
              <PieChartComponent data={stats.produtosPorTipo} title="Distribuição de Produtos" />
              <BarChartComponent data={stats.produtosPorTipo} title="Produtos por Tipo" />
            </>
          ) : (
            <>
              <BarChartComponent data={stats.produtosPorTipo} title="Produtos por Tipo" />
              <BarChartComponent data={stats.fichasPorTipo} title="Fichas Técnicas por Tipo" />
            </>
          )}
        </div>

        {stats.totalFichas > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PieChartComponent data={stats.fichasPorTipo} title="Distribuição de Fichas" />
            <BarChartComponent data={stats.fichasPorTipo} title="Fichas por Tipo" />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              icon={Package}
              title="Cadastrar Produto"
              description="Adicione novos produtos ao sistema"
              link="/cadastramento"
              color="bg-blue-600"
            />
            <QuickActionCard
              icon={FileText}
              title="Nova Ficha Técnica"
              description="Crie uma nova ficha de precificação"
              link="/ficha-tecnica"
              color="bg-green-600"
            />
            <QuickActionCard
              icon={BarChart3}
              title="Ver Síntese"
              description="Analise dados e relatórios"
              link="/sintese"
              color="bg-purple-600"
            />
            <QuickActionCard
              icon={ShoppingCart}
              title="Minhas Fichas"
              description="Gerencie suas fichas salvas"
              link="/minhas-fichas"
              color="bg-yellow-600"
            />
          </div>
        </div>

        {/* Welcome Message */}
        {stats.totalProdutos === 0 && stats.totalFichas === 0 && (
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">🎉 Bem-vindo ao Tower!</h2>
            <p className="text-gray-300 mb-6">
              Comece cadastrando seus produtos e insumos para começar a usar o sistema de precificação.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/cadastramento"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Cadastrar Produtos
              </a>
              <a
                href="/ficha-tecnica"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                Ver Ficha Técnica
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

