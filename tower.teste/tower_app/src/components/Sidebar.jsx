import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Table2, 
  FileSpreadsheet,
  FolderOpen,
  Settings,
  Plug,
  GraduationCap,
  HelpCircle,
  Castle,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Cadastramento', path: '/cadastramento' },
    { icon: Table2, label: 'Síntese', path: '/sintese' },
    { icon: FileSpreadsheet, label: 'Ficha Técnica', path: '/ficha-tecnica' },
    { icon: FolderOpen, label: 'Minhas Fichas', path: '/minhas-fichas' },
  ];
  
  const bottomMenuItems = [
    { icon: Plug, label: 'Integrações', path: '/integracoes' },
    { icon: GraduationCap, label: 'Aprendizado', path: '/aprendizado' },
    { icon: HelpCircle, label: 'Suporte', path: '/suporte' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const profileImage = localStorage.getItem('profileImage');
  
  // Verificar se algum item está ativo para expandir
  const hasActiveItem = menuItems.some(item => isActive(item.path)) || 
                        bottomMenuItems.some(item => isActive(item.path));
  
  // Menu expandido se: não estiver manualmente fechado E tiver item ativo
  const isExpanded = !isManuallyCollapsed && hasActiveItem;
  
  const toggleSidebar = () => {
    setIsManuallyCollapsed(!isManuallyCollapsed);
  };
  
  return (
    <div 
      className={`h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      style={{ 
        margin: '10px', 
        marginRight: '0',
        height: 'calc(100vh - 20px)', 
        borderRadius: '8px' 
      }}
    >
      {/* Logo + Toggle Button */}
      <div className={`border-b border-sidebar-border flex items-center ${isExpanded ? 'justify-between p-4' : 'justify-center py-4'}`}>
        <div className="flex items-center gap-2">
          <Castle className="w-8 h-8 text-primary flex-shrink-0" />
          {isExpanded && (
            <span className="text-xl font-bold text-white whitespace-nowrap">
              TOWER
            </span>
          )}
        </div>
        {isExpanded && (
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white hover:bg-gray-800 p-1.5 rounded-md transition-colors"
            title="Fechar menu"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Botão de abrir quando fechado */}
      {!isExpanded && (
        <div className="flex justify-center py-2">
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-md transition-colors"
            title="Abrir menu"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Funcionalidades */}
      <div className="flex-1 overflow-y-auto py-4">
        {isExpanded && (
          <div className="px-4 mb-3">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
              Funcionalidades
            </span>
          </div>
        )}
        
        <nav className={`space-y-1 ${isExpanded ? 'px-2' : 'px-1'}`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-lg transition-all duration-200 ${
                  isExpanded 
                    ? 'gap-3 px-3 py-2.5' 
                    : 'justify-center py-3'
                } ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
                title={!isExpanded ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="font-medium text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Separador visual */}
        {isExpanded && (
          <div className="my-4 px-4">
            <div className="border-t border-gray-800"></div>
          </div>
        )}
        
        {/* Bottom Menu Items */}
        <div className={`mt-4 ${isExpanded ? 'px-2' : 'px-1'}`}>
          {!isExpanded && (
            <div className="mb-3 px-1">
              <div className="border-t border-gray-800"></div>
            </div>
          )}
          <nav className="space-y-1">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center rounded-lg transition-all duration-200 ${
                    isExpanded 
                      ? 'gap-3 px-3 py-2.5' 
                      : 'justify-center py-3'
                  } ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  title={!isExpanded ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isExpanded && (
                    <span className="font-medium text-sm whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* User Profile */}
      <div className={`border-t border-sidebar-border ${isExpanded ? 'p-4' : 'py-4'}`}>
        <div className={`flex items-center ${isExpanded ? 'gap-3' : 'justify-center'}`}>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          {isExpanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.company_name || 'Admin Tower'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user.plan === 'premium' ? 'Premium' : 'Admin'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

