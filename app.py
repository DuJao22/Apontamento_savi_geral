from flask import Flask, render_template, request, jsonify
import sqlite3
import pandas as pd
import json
from datetime import datetime, timedelta
import random

app = Flask(__name__)

class DatabaseAnalysis:
    def __init__(self, db_path='savi_dados_unificado.db'):
        self.db_path = db_path
        self.procedimento_valores = {
            '60010150': 53.12,   # CONSULTA/SESSAO PSICOPEDAGOGIA - TEA
            '62010204': 53.12,   # SESSAO DE FISIOTERAPIA PARA TEA
            '62010212': 53.12,   # SESSAO MUSICOTERAPIA
            '65010035': 53.12,   # CONSULTA/ SESSAO NUTRICAO TEA
            '60010126': 53.12,   # PSICOTERAPIA TEA
            '61010073': 53.12,   # FONOAUDIOLOGIA TEA
            '62010123': 53.12,   # TERAPIA OCUPACIONAL TEA

            '00010014': 80.00,   # PSIQUIATRIA DA INFANCIA
            '00010015': 67.40,   # CONSULTA MEDICA ESPECIALIZADA
            '60010142': 800.00,  # Teste neuropsicologico
            '60010143': 180.00,  # AVALIACAO NEUROPSICOLOGICA
            '60010363': 100.00,  # Consulta/sessao de neuropsicologia

            '60010144': 45.80,   # TERAPIA OCUPACIONAL (padrão)
            '60010145': 38.90,   # FONOAUDIOLOGIA (padrão)
            '60010146': 42.30    # FISIOTERAPIA NEUROLOGICA (padrão)
        }

        self.empresa_procedimentos = {
            'NOTREDAME OU HAPVIDA': ['60010150','62010204','62010212','65010035','60010126','61010073','62010123'],
            'NOTREDAME OU HAPVIDA NEUROACOLHER': ['00010014'],
            'NOTREDAME OU HAPVIDA Libelula': ['60010142', '60010363']
        }
    
    def get_connection(self):
        return sqlite3.connect(self.db_path)
    
    def calcular_faturamento(self):
        """Calcula o faturamento total e detalhado por procedimento"""
        conn = self.get_connection()
        
        query = '''
            SELECT 
                procedimento_codigo,
                procedimento_nome,
                SUM(qtde_realizada) as quantidade_total
            FROM producao 
            WHERE qtde_realizada > 0
            GROUP BY procedimento_codigo, procedimento_nome
            ORDER BY quantidade_total DESC
        '''
        
        df = pd.read_sql_query(query, conn)
        conn.close()
        
        # Adicionar valores e calcular faturamento
        df['valor_unitario'] = df['procedimento_codigo'].map(self.procedimento_valores).fillna(0)
        df['faturamento_total'] = df['quantidade_total'] * df['valor_unitario']
        
        total_faturamento = df['faturamento_total'].sum()
        
        return {
            'total': total_faturamento,
            'detalhado': df.to_dict('records')
        }
    
    def identificar_senhas_erradas(self):
        """Identifica senhas com procedimentos inválidos para a empresa"""
        conn = self.get_connection()
        
        query = '''
            SELECT 
                empresa,
                usuario_codigo,
                usuario_nome,
                procedimento_codigo,
                procedimento_nome,
                senha,
                data_execucao
            FROM producao
            ORDER BY data_execucao DESC
        '''
        
        df = pd.read_sql_query(query, conn)
        conn.close()
        
        senhas_erradas = []
        
        for _, row in df.iterrows():
            empresa = row['empresa']
            procedimento = row['procedimento_codigo']
            
            if empresa in self.empresa_procedimentos:
                if procedimento not in self.empresa_procedimentos[empresa]:
                    senhas_erradas.append(row.to_dict())
        
        return senhas_erradas
    
    def pacientes_com_12_plus_senhas(self):
        """Identifica pacientes com 12 ou mais senhas e realização > 0"""
        conn = self.get_connection()
        
        query = '''
            SELECT 
                usuario_codigo,
                usuario_nome,
                COUNT(*) as total_senhas,
                SUM(CASE WHEN qtde_realizada > 0 THEN 1 ELSE 0 END) as senhas_com_realizacao
            FROM producao
            GROUP BY usuario_codigo, usuario_nome
            HAVING total_senhas >= 12 AND senhas_com_realizacao > 0
            ORDER BY total_senhas DESC
        '''
        
        df = pd.read_sql_query(query, conn)
        conn.close()
        
        return df.to_dict('records')
    
    def levantamento_senhas_por_paciente(self):
        """Gera relatório de senhas por paciente"""
        conn = self.get_connection()
        
        query = '''
            SELECT 
                usuario_codigo,
                usuario_nome,
                COUNT(*) as total_senhas
            FROM producao
            GROUP BY usuario_codigo, usuario_nome
            ORDER BY total_senhas DESC
        '''
        
        df = pd.read_sql_query(query, conn)
        conn.close()
        
        return df.to_dict('records')
    
    def get_all_data(self, search_term=None):
        """Retorna todos os dados da tabela producao"""
        conn = self.get_connection()
        
        query = '''
            SELECT * FROM producao
            ORDER BY data_execucao DESC
        '''
        
        df = pd.read_sql_query(query, conn)
        conn.close()
        
        if search_term:
            mask = (
                df['usuario_nome'].str.contains(search_term, case=False, na=False) |
                df['usuario_codigo'].str.contains(search_term, case=False, na=False) |
                df['procedimento_nome'].str.contains(search_term, case=False, na=False) |
                df['empresa'].str.contains(search_term, case=False, na=False)
            )
            df = df[mask]
        
        return df.to_dict('records')

def create_database():
    """Cria o banco de dados com dados de exemplo"""
    import os
    
    # Remove existing database if it exists
    if os.path.exists('producao.db'):
        os.remove('producao.db')
    
    conn = sqlite3.connect('producao.db')
    cursor = conn.cursor()
    
    # Create table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS producao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            empresa TEXT NOT NULL,
            servico TEXT NOT NULL,
            rede TEXT NOT NULL,
            data_execucao DATE NOT NULL,
            usuario_codigo TEXT NOT NULL,
            usuario_nome TEXT NOT NULL,
            medico_codigo TEXT NOT NULL,
            medico_nome TEXT NOT NULL,
            procedimento_codigo TEXT NOT NULL,
            procedimento_nome TEXT NOT NULL,
            urgencia TEXT NOT NULL,
            qtde_autorizada INTEGER NOT NULL,
            qtde_realizada INTEGER NOT NULL,
            data_autorizacao DATE NOT NULL,
            numero_guia TEXT NOT NULL,
            senha TEXT NOT NULL
        )
    ''')
    
    # Sample data
    empresas = [
        'NOTREDAME OU HAPVIDA',
        'NOTREDAME OU HAPVIDA NEUROACOLHER', 
        'NOTREDAME OU HAPVIDA Libelula'
    ]
    
    procedimentos = {
        'NOTREDAME OU HAPVIDA': [
            ['60010150', 'CONSULTA/SESSAO PSICOPEDAGOGIA - TEA'],
            ['00010015', 'CONSULTA MEDICA ESPECIALIZADA'],
            ['60010144', 'TERAPIA OCUPACIONAL'],
            ['60010145', 'FONOAUDIOLOGIA']
        ],
        'NOTREDAME OU HAPVIDA NEUROACOLHER': [
            ['00010014', 'PSIQUIATRIA DA INFANCIA'],
            ['60010146', 'FISIOTERAPIA NEUROLOGICA']
        ],
        'NOTREDAME OU HAPVIDA Libelula': [
            ['60010142', 'Teste neuropsicologico'],
            ['60010143', 'AVALIACAO NEUROPSICOLOGICA']
        ]
    }
    
    pacientes = [
        ['PAC001', 'Ana Silva Santos'],
        ['PAC002', 'Carlos Eduardo Lima'],
        ['PAC003', 'Fernanda Costa'],
        ['PAC004', 'Roberto Alves'],
        ['PAC005', 'Juliana Rodrigues'],
        ['PAC006', 'Marcos Henrique Silva'],
        ['PAC007', 'Patricia Oliveira'],
        ['PAC008', 'João Pedro Souza'],
        ['PAC009', 'Maria Clara Ferreira'],
        ['PAC010', 'Lucas Gabriel Santos']
    ]
    
    medicos = [
        ['MED001', 'Dr. João Pereira'],
        ['MED002', 'Dra. Maria Oliveira'],
        ['MED003', 'Dr. Pedro Santos'],
        ['MED004', 'Dra. Clara Mendes'],
        ['MED005', 'Dr. André Silva']
    ]
    
    senha_counter = 1
    
    # Generate 200 sample records
    for i in range(200):
        empresa = random.choice(empresas)
        procedimento_codigo, procedimento_nome = random.choice(procedimentos[empresa])
        usuario_codigo, usuario_nome = random.choice(pacientes)
        medico_codigo, medico_nome = random.choice(medicos)
        
        # 10% chance of intentional error (wrong procedure for company)
        if random.random() < 0.1:
            empresa_errada = random.choice([e for e in empresas if e != empresa])
            procedimento_codigo, procedimento_nome = random.choice(procedimentos[empresa_errada])
        
        data_execucao = datetime.now() - timedelta(days=random.randint(1, 90))
        data_autorizacao = data_execucao - timedelta(days=random.randint(1, 10))
        
        qtde_autorizada = random.randint(1, 20)
        qtde_realizada = random.randint(0, qtde_autorizada)
        
        cursor.execute('''
            INSERT INTO producao (
                empresa, servico, rede, data_execucao, usuario_codigo, usuario_nome,
                medico_codigo, medico_nome, procedimento_codigo, procedimento_nome,
                urgencia, qtde_autorizada, qtde_realizada, data_autorizacao,
                numero_guia, senha
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            empresa,
            f'SERVICO_{random.randint(1, 5)}',
            random.choice(['HAPVIDA', 'NOTREDAME']),
            data_execucao.strftime('%Y-%m-%d'),
            usuario_codigo,
            usuario_nome,
            medico_codigo,
            medico_nome,
            procedimento_codigo,
            procedimento_nome,
            random.choice(['S', 'N']),
            qtde_autorizada,
            qtde_realizada,
            data_autorizacao.strftime('%Y-%m-%d'),
            f'GUI{str(i + 1).zfill(3)}',
            f'SEN{str(senha_counter).zfill(3)}'
        ))
        
        senha_counter += 1
    
    # Add extra records for PAC006 to have 12+ passwords
    for i in range(15):
        data_execucao = datetime.now() - timedelta(days=i + 1)
        data_autorizacao = data_execucao - timedelta(days=1)
        
        cursor.execute('''
            INSERT INTO producao (
                empresa, servico, rede, data_execucao, usuario_codigo, usuario_nome,
                medico_codigo, medico_nome, procedimento_codigo, procedimento_nome,
                urgencia, qtde_autorizada, qtde_realizada, data_autorizacao,
                numero_guia, senha
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            'NOTREDAME OU HAPVIDA',
            'PSICOPEDAGOGIA',
            'HAPVIDA',
            data_execucao.strftime('%Y-%m-%d'),
            'PAC006',
            'Marcos Henrique Silva',
            'MED001',
            'Dr. João Pereira',
            '60010150',
            'CONSULTA/SESSAO PSICOPEDAGOGIA - TEA',
            'N',
            1,
            1,
            data_autorizacao.strftime('%Y-%m-%d'),
            f'GUI{str(200 + i + 1).zfill(3)}',
            f'SEN{str(senha_counter).zfill(3)}'
        ))
        
        senha_counter += 1
    
    conn.commit()
    conn.close()
    print('Database created successfully!')

# Initialize database on startup
import os
if not os.path.exists('producao.db'):
    create_database()

db_analysis = DatabaseAnalysis()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/faturamento')
def faturamento():
    resultado = db_analysis.calcular_faturamento()
    return render_template('faturamento.html', resultado=resultado)

@app.route('/senhas-erradas')
def senhas_erradas():
    senhas = db_analysis.identificar_senhas_erradas()
    return render_template('senhas_erradas.html', senhas=senhas)

@app.route('/pacientes-12-senhas')
def pacientes_12_senhas():
    pacientes = db_analysis.pacientes_com_12_plus_senhas()
    return render_template('pacientes_12_senhas.html', pacientes=pacientes)

@app.route('/levantamento-senhas')
def levantamento_senhas():
    pacientes = db_analysis.levantamento_senhas_por_paciente()
    return render_template('levantamento_senhas.html', pacientes=pacientes)

@app.route('/dados')
def dados():
    search_term = request.args.get('search', '')
    dados = db_analysis.get_all_data(search_term)
    return render_template('dados.html', dados=dados, search_term=search_term)

@app.template_filter('currency')
def currency_filter(value):
    """Formata valor como moeda brasileira"""
    return f"R$ {value:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')

@app.template_filter('date_format')
def date_format_filter(value):
    """Formata data para padrão brasileiro"""
    if isinstance(value, str):
        try:
            date_obj = datetime.strptime(value, '%Y-%m-%d')
            return date_obj.strftime('%d/%m/%Y')
        except:
            return value
    return value

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
