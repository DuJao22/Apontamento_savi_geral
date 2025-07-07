import React, { useState, useEffect } from 'react';
import { FileText, Users, BarChart3 } from 'lucide-react';
import { DatabaseAnalysis } from '../utils/database';
import { PacienteRelatorio } from '../types/database';

export const LevantamentoSenhasTab: React.FC = () => {
  const [pacientes, setPacientes] = useState<PacienteRelatorio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = new DatabaseAnalysis();
    const resultado = db.levantamentoSenhasPorPaciente();
    setPacientes(resultado);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const totalSenhas = pacientes.reduce((acc, p) => acc + p.total_senhas, 0);
  const mediaSenhas = pacientes.length > 0 ? totalSenhas / pacientes.length : 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Levantamento de Senhas</h2>
            <p className="text-purple-100">Quantidade total de senhas emitidas por paciente</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{totalSenhas}</div>
            <div className="text-purple-100 text-sm">Total de senhas</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Pacientes</p>
              <p className="text-lg font-semibold">{pacientes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Senhas</p>
              <p className="text-lg font-semibold">{totalSenhas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Média por Paciente</p>
              <p className="text-lg font-semibold">{mediaSenhas.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Relatório de Senhas por Paciente</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome do Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total de Senhas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentual
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pacientes.map((paciente, index) => {
                const percentual = totalSenhas > 0 ? (paciente.total_senhas / totalSenhas) * 100 : 0;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {paciente.usuario_codigo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {paciente.usuario_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {paciente.total_senhas}
                        </span>
                        {paciente.total_senhas >= 12 && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Alta
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{width: `${Math.min(percentual, 100)}%`}}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {percentual.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};