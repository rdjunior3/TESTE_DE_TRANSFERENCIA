import { useState, useEffect } from 'react';
import { FileText, Trash2, Eye, Download, RefreshCw, Edit2, Check, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const TEMPLATE_COLORS = {
  'cardapio': 'bg-yellow-700',
  'promocional': 'bg-blue-600',
  'preco-c': 'bg-yellow-600',
  'preco-d': 'bg-yellow-600',
  'custo-real': 'bg-green-600',
  'margem-lucro': 'bg-purple-600',
};

const TEMPLATE_NAMES = {
  'cardapio': 'Cardápio',
  'promocional': 'Promocional',
  'preco-c': 'Preço-C',
  'preco-d': 'Preço-D',
  'custo-real': 'Custo Real',
  'margem-lucro': 'Margem de Lucro',
};

export default function MinhasFichas() {
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    loadFichas();
  }, []);

  const loadFichas = () => {
    try {
      setLoading(true);
      // Carregar fichas do localStorage
      const savedFichas = JSON.parse(localStorage.getItem('fichasTecnicas') || '[]');
      setFichas(savedFichas);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar fichas técnicas' });
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (ficha) => {
    setEditingId(ficha.id);
    setEditingName(ficha.product_name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = (fichaId) => {
    try {
      const savedFichas = JSON.parse(localStorage.getItem('fichasTecnicas') || '[]');
      const updatedFichas = savedFichas.map(f => 
        f.id === fichaId ? { ...f, product_name: editingName, updated_at: new Date().toISOString() } : f
      );
      localStorage.setItem('fichasTecnicas', JSON.stringify(updatedFichas));
      
      setMessage({ type: 'success', text: 'Nome atualizado com sucesso!' });
      setEditingId(null);
      setEditingName('');
      loadFichas();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar nome' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDelete = (fichaId) => {
    if (!confirm('Tem certeza que deseja excluir esta ficha técnica?')) {
      return;
    }

    try {
      const savedFichas = JSON.parse(localStorage.getItem('fichasTecnicas') || '[]');
      const updatedFichas = savedFichas.filter(f => f.id !== fichaId);
      localStorage.setItem('fichasTecnicas', JSON.stringify(updatedFichas));
      
      setMessage({ type: 'success', text: 'Ficha excluída com sucesso!' });
      loadFichas();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao excluir ficha técnica' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStats = () => {
    const total = fichas.length;
    const cardapio = fichas.filter(f => f.template_type === 'cardapio').length;
    const promocional = fichas.filter(f => f.template_type === 'promocional').length;
    const outros = total - cardapio - promocional;
    
    return { total, cardapio, promocional, outros };
  };

  const stats = getStats();

  return (
    <div style={{ display: 'flex', padding: '10px', gap: '10px', height: '100vh', backgroundColor: '#0a0a0a' }}>
      <Sidebar />
      
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
              Minhas Fichas Técnicas
            </h1>
            <p style={{ color: '#9ca3af' }}>
              Gerencie suas fichas técnicas salvas
            </p>
          </div>
          
          <button
            onClick={loadFichas}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <RefreshCw size={18} />
            Atualizar
          </button>
        </div>

        {/* Mensagem */}
        {message.text && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '8px',
            backgroundColor: message.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white'
          }}>
            {message.text}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            Carregando fichas técnicas...
          </div>
        ) : fichas.length === 0 ? (
          /* Empty State */
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#1f2937',
            borderRadius: '12px',
            border: '2px dashed #374151'
          }}>
            <FileText size={64} style={{ color: '#6b7280', margin: '0 auto 20px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#e5e7eb', marginBottom: '8px' }}>
              Nenhuma ficha técnica salva
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
              Vá para a página de Ficha Técnica e salve sua primeira ficha!
            </p>
            <a
              href="/ficha-tecnica"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '500'
              }}
            >
              Ir para Ficha Técnica
            </a>
          </div>
        ) : (
          /* Grid de Fichas */
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {fichas.map((ficha) => (
                <div
                  key={ficha.id}
                  style={{
                    backgroundColor: '#1f2937',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #374151',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Header do Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '8px'
                      }} className={TEMPLATE_COLORS[ficha.template_type] || 'bg-gray-600'}>
                        {TEMPLATE_NAMES[ficha.template_type] || ficha.template_type}
                      </div>
                      {editingId === ficha.id ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            style={{
                              flex: 1,
                              padding: '6px 10px',
                              backgroundColor: '#111827',
                              border: '1px solid #3b82f6',
                              borderRadius: '4px',
                              color: '#e5e7eb',
                              fontSize: '16px',
                              fontWeight: '600',
                              outline: 'none'
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(ficha.id)}
                            style={{
                              padding: '6px',
                              backgroundColor: '#10b981',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Salvar"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            style={{
                              padding: '6px',
                              backgroundColor: '#ef4444',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Cancelar"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#e5e7eb', margin: 0 }}>
                            {ficha.product_name}
                          </h3>
                          <button
                            onClick={() => handleStartEdit(ficha)}
                            style={{
                              padding: '4px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#9ca3af',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                            title="Editar nome"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                      <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                        Criado em {formatDate(ficha.created_at)}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(ficha.id)}
                      style={{
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        color: '#ef4444',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f1d1d'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      title="Excluir ficha"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Informações */}
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#111827',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                      Última atualização
                    </div>
                    <div style={{ fontSize: '14px', color: '#e5e7eb' }}>
                      {formatDate(ficha.updated_at)}
                    </div>
                  </div>

                  {/* Ações */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={`/ficha-tecnica?id=${ficha.id}`}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    >
                      <Eye size={16} />
                      Visualizar
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Estatísticas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              padding: '20px',
              backgroundColor: '#1f2937',
              borderRadius: '12px',
              border: '1px solid #374151'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Total de Fichas</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{stats.total}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Cardápio</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#eab308' }}>{stats.cardapio}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Promocional</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{stats.promocional}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Outros</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6b7280' }}>{stats.outros}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

