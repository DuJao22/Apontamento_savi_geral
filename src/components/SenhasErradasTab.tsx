import React, { useState, useEffect } from 'react';
import { AlertTriangle, Building, User } from 'lucide-react';
import { DatabaseAnalysis } from '../utils/database';
import { SenhaErrada } from '../types/database';

export const SenhasErradasTab: React.FC = () => {
  const [senhasErradas, setSenhasErradas] = useState<SenhaErrada[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = new DatabaseAnalysis();
    const resultado = db.identificarSenhasErradas();
    setSenhasErradas(resultado);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const empresas = Array.from(new Set(senhasErradas.map(s => s.empresa)));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Senhas Erradas Identificadas</h2>
            <p className="text-red-100">Procedimentos não válidos para as empresas</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{senhasErradas.length}</div>
            <div className="text-red-100 text-sm">Senhas incorretas</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Erros</p>
              <p className="text-lg font-semibold">{senhasErradas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Empresas Afetadas</p>
              <p className="text-lg font-semibold">{empresas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pacientes Afetados</p>
              <p className="text-lg font-semibold">
                {new Set(senhasErradas.map(s => s.usuario_codigo)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {senhasErradas.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-green-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Nenhuma senha errada encontrada</h3>
              <p className="text-gray-500">Todos os procedimentos estão corretos para suas respectivas empresas.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Detalhamento das Senhas Erradas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código Procedimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Procedimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Senha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {senhasErradas.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-red-100 rounded">
                          <Building className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-medium">{item.empresa}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{item.usuario_nome}</div>
                        <div className="text-gray-500">{item.usuario_codigo}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.procedimento_codigo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.procedimento_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        {item.senha}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.data_execucao).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};