import React from 'react';
import { Clock, CreditCard, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AguardandoPagamento() {
  const navigate = useNavigate();

  const handleGoToPlans = () => {
    window.location.href = 'https://estrategos.online/tower/planos/';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Card Principal */}
        <div className="bg-[#0A1929] border border-[#1E3A5F] rounded-lg p-8 shadow-2xl">
          {/* Ícone */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-10 h-10 text-yellow-400" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-white text-center mb-4">
            Aguardando Confirmação de Pagamento
          </h1>

          {/* Descrição */}
          <p className="text-gray-300 text-center mb-8 text-lg">
            Seu cadastro foi realizado com sucesso! Para acessar o sistema Tower, 
            você precisa assinar um dos nossos planos.
          </p>

          {/* Passos */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 bg-[#1A2942] p-4 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Escolha seu plano</h3>
                <p className="text-gray-400 text-sm">
                  Acesse nossa página de planos e escolha o que melhor se adequa às suas necessidades
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-[#1A2942] p-4 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Realize o pagamento</h3>
                <p className="text-gray-400 text-sm">
                  Complete o processo de pagamento através do Stripe de forma segura
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-[#1A2942] p-4 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Acesso liberado automaticamente</h3>
                <p className="text-gray-400 text-sm">
                  Após a confirmação do pagamento, seu acesso será liberado imediatamente
                </p>
              </div>
            </div>
          </div>

          {/* Planos Disponíveis */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Planos Disponíveis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#1A2942] p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Essencial</h4>
                <p className="text-2xl font-bold text-blue-400 mb-2">R$ 149<span className="text-sm text-gray-400">/mês</span></p>
                <p className="text-gray-400 text-sm">Ideal para começar</p>
              </div>
              <div className="bg-[#1A2942] p-4 rounded-lg border-2 border-blue-500">
                <div className="text-xs font-bold text-blue-400 mb-2">MAIS POPULAR</div>
                <h4 className="text-white font-semibold mb-2">PRO</h4>
                <p className="text-2xl font-bold text-blue-400 mb-2">R$ 599<span className="text-sm text-gray-400">/mês</span></p>
                <p className="text-gray-400 text-sm">Recursos completos</p>
              </div>
              <div className="bg-[#1A2942] p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Enterprise</h4>
                <p className="text-2xl font-bold text-blue-400 mb-2">Personalizado</p>
                <p className="text-gray-400 text-sm">Sob medida</p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleLogout}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Voltar ao Login
            </button>
            <button
              onClick={handleGoToPlans}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Ver Planos e Assinar
            </button>
          </div>

          {/* Nota */}
          <p className="text-gray-500 text-sm text-center mt-6">
            Após o pagamento, faça login novamente para acessar o sistema completo
          </p>
        </div>
      </div>
    </div>
  );
}
