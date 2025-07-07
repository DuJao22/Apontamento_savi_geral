import { ProducaoRecord, FaturamentoDetalhado, PacienteRelatorio, SenhaErrada } from '../types/database';
import { procedimentoValores, empresaProcedimentos } from '../data/procedimentoValores';
import { allSampleData } from '../data/sampleData';

export class DatabaseAnalysis {
  private data: ProducaoRecord[] = allSampleData;

  // Cálculo de Faturamento
  calcularFaturamento(): { total: number; detalhado: FaturamentoDetalhado[] } {
    const faturamentoPorProcedimento = new Map<string, {
      nome: string;
      quantidade: number;
      valor: number;
    }>();

    this.data.forEach(record => {
      const procedimento = procedimentoValores.find(p => p.codigo === record.procedimento_codigo);
      if (!procedimento) return;

      const key = record.procedimento_codigo;
      const existing = faturamentoPorProcedimento.get(key);
      
      if (existing) {
        existing.quantidade += record.qtde_realizada;
      } else {
        faturamentoPorProcedimento.set(key, {
          nome: record.procedimento_nome,
          quantidade: record.qtde_realizada,
          valor: procedimento.valor
        });
      }
    });

    const detalhado: FaturamentoDetalhado[] = [];
    let total = 0;

    faturamentoPorProcedimento.forEach((value, key) => {
      const faturamentoTotal = value.quantidade * value.valor;
      total += faturamentoTotal;
      
      detalhado.push({
        procedimento_codigo: key,
        procedimento_nome: value.nome,
        quantidade_total: value.quantidade,
        valor_unitario: value.valor,
        faturamento_total: faturamentoTotal
      });
    });

    return { total, detalhado };
  }

  // Apontamento de Senhas Erradas
  identificarSenhasErradas(): SenhaErrada[] {
    const senhasErradas: SenhaErrada[] = [];

    this.data.forEach(record => {
      const procedimentosValidos = empresaProcedimentos[record.empresa as keyof typeof empresaProcedimentos];
      
      if (!procedimentosValidos || !procedimentosValidos.includes(record.procedimento_codigo)) {
        senhasErradas.push({
          empresa: record.empresa,
          usuario_codigo: record.usuario_codigo,
          usuario_nome: record.usuario_nome,
          procedimento_codigo: record.procedimento_codigo,
          procedimento_nome: record.procedimento_nome,
          senha: record.senha,
          data_execucao: record.data_execucao
        });
      }
    });

    return senhasErradas;
  }

  // Apontamento de Pacientes com 12+ Senhas
  pacientesCom12PlusSenhas(): PacienteRelatorio[] {
    const pacientesSenhas = new Map<string, {
      nome: string;
      totalSenhas: number;
      senhasComRealizacao: number;
    }>();

    this.data.forEach(record => {
      const key = record.usuario_codigo;
      const existing = pacientesSenhas.get(key);
      
      if (existing) {
        existing.totalSenhas += 1;
        if (record.qtde_realizada > 0) {
          existing.senhasComRealizacao += 1;
        }
      } else {
        pacientesSenhas.set(key, {
          nome: record.usuario_nome,
          totalSenhas: 1,
          senhasComRealizacao: record.qtde_realizada > 0 ? 1 : 0
        });
      }
    });

    const resultado: PacienteRelatorio[] = [];
    pacientesSenhas.forEach((value, key) => {
      if (value.totalSenhas >= 12 && value.senhasComRealizacao > 0) {
        resultado.push({
          usuario_codigo: key,
          usuario_nome: value.nome,
          total_senhas: value.totalSenhas,
          senhas_com_realizacao: value.senhasComRealizacao
        });
      }
    });

    return resultado;
  }

  // Levantamento de Senhas por Paciente
  levantamentoSenhasPorPaciente(): PacienteRelatorio[] {
    const pacientesSenhas = new Map<string, {
      nome: string;
      totalSenhas: number;
    }>();

    this.data.forEach(record => {
      const key = record.usuario_codigo;
      const existing = pacientesSenhas.get(key);
      
      if (existing) {
        existing.totalSenhas += 1;
      } else {
        pacientesSenhas.set(key, {
          nome: record.usuario_nome,
          totalSenhas: 1
        });
      }
    });

    const resultado: PacienteRelatorio[] = [];
    pacientesSenhas.forEach((value, key) => {
      resultado.push({
        usuario_codigo: key,
        usuario_nome: value.nome,
        total_senhas: value.totalSenhas,
        senhas_com_realizacao: 0 // Não usado neste contexto
      });
    });

    return resultado.sort((a, b) => b.total_senhas - a.total_senhas);
  }
}