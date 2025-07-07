import React from 'react';
import { Calculator, AlertTriangle, Users, FileText, Database } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'faturamento', label: 'Faturamento', icon: Calculator },
    { id: 'senhas-erradas', label: 'Senhas Erradas', icon: AlertTriangle },
    { id: 'pacientes-12-senhas', label: 'Pacientes 12+ Senhas', icon: Users },
    { id: 'levantamento-senhas', label: 'Levantamento Senhas', icon: FileText },
    { id: 'dados', label: 'Dados', icon: Database }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};