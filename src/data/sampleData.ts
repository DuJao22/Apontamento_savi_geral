import { ProducaoRecord } from '../types/database';

export const sampleData: ProducaoRecord[] = [
  {
    empresa: 'NOTREDAME OU HAPVIDA',
    servico: 'PSICOPEDAGOGIA',
    rede: 'HAPVIDA',
    data_execucao: '2024-01-15',
    usuario_codigo: 'PAC001',
    usuario_nome: 'Ana Silva Santos',
    medico_codigo: 'MED001',
    medico_nome: 'Dr. João Pereira',
    procedimento_codigo: '60010150',
    procedimento_nome: 'CONSULTA/SESSAO PSICOPEDAGOGIA - TEA',
    urgencia: 'N',
    qtde_autorizada: 10,
    qtde_realizada: 8,
    data_autorizacao: '2024-01-10',
    numero_guia: 'GUI001',
    senha: 'SEN001'
  },
  {
    empresa: 'NOTREDAME OU HAPVIDA NEUROACOLHER',
    servico: 'PSIQUIATRIA',
    rede: 'NOTREDAME',
    data_execucao: '2024-01-16',
    usuario_codigo: 'PAC002',
    usuario_nome: 'Carlos Eduardo Lima',
    medico_codigo: 'MED002',
    medico_nome: 'Dra. Maria Oliveira',
    procedimento_codigo: '00010014',
    procedimento_nome: 'PSIQUIATRIA DA INFANCIA',
    urgencia: 'N',
    qtde_autorizada: 6,
    qtde_realizada: 5,
    data_autorizacao: '2024-01-12',
    numero_guia: 'GUI002',
    senha: 'SEN002'
  },
  {
    empresa: 'NOTREDAME OU HAPVIDA Libelula',
    servico: 'NEUROPSICOLOGIA',
    rede: 'HAPVIDA',
    data_execucao: '2024-01-17',
    usuario_codigo: 'PAC003',
    usuario_nome: 'Fernanda Costa',
    medico_codigo: 'MED003',
    medico_nome: 'Dr. Pedro Santos',
    procedimento_codigo: '60010142',
    procedimento_nome: 'Teste neuropsicologico',
    urgencia: 'N',
    qtde_autorizada: 3,
    qtde_realizada: 3,
    data_autorizacao: '2024-01-15',
    numero_guia: 'GUI003',
    senha: 'SEN003'
  },
  {
    empresa: 'NOTREDAME OU HAPVIDA',
    servico: 'PSICOPEDAGOGIA',
    rede: 'HAPVIDA',
    data_execucao: '2024-01-18',
    usuario_codigo: 'PAC001',
    usuario_nome: 'Ana Silva Santos',
    medico_codigo: 'MED001',
    medico_nome: 'Dr. João Pereira',
    procedimento_codigo: '60010150',
    procedimento_nome: 'CONSULTA/SESSAO PSICOPEDAGOGIA - TEA',
    urgencia: 'N',
    qtde_autorizada: 10,
    qtde_realizada: 7,
    data_autorizacao: '2024-01-10',
    numero_guia: 'GUI001',
    senha: 'SEN004'
  },
  {
    empresa: 'NOTREDAME OU HAPVIDA',
    servico: 'NEUROPSICOLOGIA',
    rede: 'HAPVIDA',
    data_execucao: '2024-01-19',
    usuario_codigo: 'PAC004',
    usuario_nome: 'Roberto Alves',
    medico_codigo: 'MED004',
    medico_nome: 'Dra. Clara Mendes',
    procedimento_codigo: '60010142',
    procedimento_nome: 'Teste neuropsicologico',
    urgencia: 'N',
    qtde_autorizada: 15,
    qtde_realizada: 12,
    data_autorizacao: '2024-01-14',
    numero_guia: 'GUI004',
    senha: 'SEN005'
  },
  {
    empresa: 'NOTREDAME OU HAPVIDA NEUROACOLHER',
    servico: 'PSIQUIATRIA',
    rede: 'NOTREDAME',
    data_execucao: '2024-01-20',
    usuario_codigo: 'PAC005',
    usuario_nome: 'Juliana Rodrigues',
    medico_codigo: 'MED005',
    medico_nome: 'Dr. André Silva',
    procedimento_codigo: '00010015',
    procedimento_nome: 'CONSULTA MEDICA ESPECIALIZADA',
    urgencia: 'S',
    qtde_autorizada: 8,
    qtde_realizada: 6,
    data_autorizacao: '2024-01-18',
    numero_guia: 'GUI005',
    senha: 'SEN006'
  }
];

// Adicionar mais registros para simulação de pacientes com 12+ senhas
const additionalRecords: ProducaoRecord[] = [];
for (let i = 0; i < 15; i++) {
  additionalRecords.push({
    empresa: 'NOTREDAME OU HAPVIDA',
    servico: 'PSICOPEDAGOGIA',
    rede: 'HAPVIDA',
    data_execucao: `2024-01-${(i + 21).toString().padStart(2, '0')}`,
    usuario_codigo: 'PAC006',
    usuario_nome: 'Marcos Henrique Silva',
    medico_codigo: 'MED001',
    medico_nome: 'Dr. João Pereira',
    procedimento_codigo: '60010150',
    procedimento_nome: 'CONSULTA/SESSAO PSICOPEDAGOGIA - TEA',
    urgencia: 'N',
    qtde_autorizada: 1,
    qtde_realizada: 1,
    data_autorizacao: `2024-01-${(i + 20).toString().padStart(2, '0')}`,
    numero_guia: `GUI00${i + 7}`,
    senha: `SEN00${i + 7}`
  });
}

export const allSampleData = [...sampleData, ...additionalRecords];