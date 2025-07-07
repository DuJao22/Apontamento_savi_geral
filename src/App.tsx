import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { FaturamentoTab } from './components/FaturamentoTab';
import { SenhasErradasTab } from './components/SenhasErradasTab';
import { Pacientes12SenhasTab } from './components/Pacientes12SenhasTab';
import { LevantamentoSenhasTab } from './components/LevantamentoSenhasTab';
import { DadosTab } from './components/DadosTab';
import { Activity } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('faturamento');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'faturamento':
        return <FaturamentoTab />;
      case 'senhas-erradas':
        return <SenhasErradasTab />;
      case 'pacientes-12-senhas':
        return <Pacientes12SenhasTab />;
      case 'levantamento-senhas':
        return <LevantamentoSenhasTab />;
      case 'dados':
        return <DadosTab />;
      default:
        return <FaturamentoTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Análise Médica</h1>
                <p className="text-sm text-gray-500">Análise de dados de produção e faturamento</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Dados atualizados em tempo real
              </div>
            </div>
          </div>
        </div>
      </header>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;