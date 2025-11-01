import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { HelpCircle, Mail, Phone, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';

export default function Suporte() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.assunto || !formData.mensagem) {
      alert('Preencha todos os campos!');
      return;
    }

    // Criar link mailto
    const mailtoLink = `mailto:lucasaureliano43@gmail.com?subject=${encodeURIComponent(formData.assunto)}&body=${encodeURIComponent(
      `Nome: ${formData.nome}\nE-mail: ${formData.email}\n\nMensagem:\n${formData.mensagem}`
    )}`;
    
    window.location.href = mailtoLink;
    
    setEnviado(true);
    setTimeout(() => {
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
      setEnviado(false);
    }, 3000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Olá! Preciso de suporte com o sistema Tower.');
    window.open(`https://wa.me/5581986473229?text=${message}`, '_blank');
  };

  return (
    <div className="flex h-screen bg-background" style={{padding: "10px", paddingLeft: "0"}}>
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <HelpCircle className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold text-white">Suporte</h1>
            </div>
            <p className="text-gray-400">Entre em contato conosco para tirar dúvidas ou reportar problemas</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulário de Contato */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-white">Enviar Mensagem</h2>
                </div>

                {enviado ? (
                  <div className="bg-green-900/20 border border-green-600/50 rounded-lg p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-400 mb-2">Mensagem Enviada!</h3>
                    <p className="text-gray-400">
                      Seu cliente de e-mail foi aberto. Envie a mensagem para entrar em contato conosco.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="Seu nome"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Assunto *
                      </label>
                      <select
                        value={formData.assunto}
                        onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="Dúvida sobre funcionalidades">Dúvida sobre funcionalidades</option>
                        <option value="Problema técnico">Problema técnico</option>
                        <option value="Sugestão de melhoria">Sugestão de melhoria</option>
                        <option value="Questão financeira">Questão financeira</option>
                        <option value="Upgrade de plano">Upgrade de plano</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Mensagem *
                      </label>
                      <textarea
                        value={formData.mensagem}
                        onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        rows="6"
                        placeholder="Descreva sua dúvida ou problema em detalhes..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                      Enviar Mensagem
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Informações de Contato */}
            <div className="space-y-6">
              {/* Contato Direto */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Contato Direto</h3>

                <div className="space-y-4">
                  {/* E-mail */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">E-mail</p>
                      <a 
                        href="mailto:lucasaureliano43@gmail.com"
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        lucasaureliano43@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">WhatsApp</p>
                      <button
                        onClick={handleWhatsApp}
                        className="text-green-400 hover:text-green-300 font-medium transition-colors"
                      >
                        (81) 98647-3229
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleWhatsApp}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Abrir WhatsApp
                </button>
              </div>

              {/* Horário de Atendimento */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-semibold text-white">Horário de Atendimento</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Segunda a Sexta</span>
                    <span className="font-medium text-white">9h às 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sábado</span>
                    <span className="font-medium text-white">9h às 13h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Domingo</span>
                    <span className="font-medium text-red-400">Fechado</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-500">
                    * Respondemos todas as mensagens em até 24 horas úteis
                  </p>
                </div>
              </div>

              {/* FAQ Rápido */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Perguntas Frequentes</h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-blue-400 mb-1">Como faço upgrade do plano?</p>
                    <p className="text-gray-400">Entre em contato conosco via WhatsApp ou e-mail.</p>
                  </div>

                  <div>
                    <p className="font-medium text-blue-400 mb-1">Posso adicionar mais usuários?</p>
                    <p className="text-gray-400">Sim! Vá em Configurações → Gestão de Perfis.</p>
                  </div>

                  <div>
                    <p className="font-medium text-blue-400 mb-1">Os dados são seguros?</p>
                    <p className="text-gray-400">Sim, todos os dados são armazenados localmente no seu navegador.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

