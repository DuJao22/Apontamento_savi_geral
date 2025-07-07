import { ProcedimentoValor } from '../types/database';

export const procedimentoValores: ProcedimentoValor[] = [
  {
    codigo: '60010150',
    nome: 'CONSULTA/SESSAO PSICOPEDAGOGIA - TEA',
    valor: 53.12
  },
  {
    codigo: '00010014',
    nome: 'PSIQUIATRIA DA INFANCIA',
    valor: 89.75
  },
  {
    codigo: '60010142',
    nome: 'Teste neuropsicologico',
    valor: 125.50
  },
  {
    codigo: '00010015',
    nome: 'CONSULTA MEDICA ESPECIALIZADA',
    valor: 67.40
  },
  {
    codigo: '60010143',
    nome: 'AVALIACAO NEUROPSICOLOGICA',
    valor: 180.00
  },
  {
    codigo: '60010144',
    nome: 'TERAPIA OCUPACIONAL',
    valor: 45.80
  },
  {
    codigo: '60010145',
    nome: 'FONOAUDIOLOGIA',
    valor: 38.90
  },
  {
    codigo: '60010146',
    nome: 'FISIOTERAPIA NEUROLOGICA',
    valor: 42.30
  }
];

export const empresaProcedimentos = {
  'NOTREDAME OU HAPVIDA': [
    '60010150', // CONSULTA/SESSAO PSICOPEDAGOGIA - TEA
    '00010015', // CONSULTA MEDICA ESPECIALIZADA
    '60010144', // TERAPIA OCUPACIONAL
    '60010145'  // FONOAUDIOLOGIA
  ],
  'NOTREDAME OU HAPVIDA NEUROACOLHER': [
    '00010014', // PSIQUIATRIA DA INFANCIA
    '60010146'  // FISIOTERAPIA NEUROLOGICA
  ],
  'NOTREDAME OU HAPVIDA Libelula': [
    '60010142', // Teste neuropsicologico
    '60010143'  // AVALIACAO NEUROPSICOLOGICA
  ]
};