export interface ProducaoRecord {
  empresa: string;
  servico: string;
  rede: string;
  data_execucao: string;
  usuario_codigo: string;
  usuario_nome: string;
  medico_codigo: string;
  medico_nome: string;
  procedimento_codigo: string;
  procedimento_nome: string;
  urgencia: string;
  qtde_autorizada: number;
  qtde_realizada: number;
  data_autorizacao: string;
  numero_guia: string;
  senha: string;
}

export interface ProcedimentoValor {
  codigo: string;
  nome: string;
  valor: number;
}

export interface FaturamentoDetalhado {
  procedimento_codigo: string;
  procedimento_nome: string;
  quantidade_total: number;
  valor_unitario: number;
  faturamento_total: number;
}

export interface PacienteRelatorio {
  usuario_codigo: string;
  usuario_nome: string;
  total_senhas: number;
  senhas_com_realizacao: number;
}

export interface SenhaErrada {
  empresa: string;
  usuario_codigo: string;
  usuario_nome: string;
  procedimento_codigo: string;
  procedimento_nome: string;
  senha: string;
  data_execucao: string;
}