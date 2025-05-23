from flask import Flask, request, jsonify
from flask_cors import CORS
from enviar_email_auto import enviar_email_agendamento
import sqlite3
import mercadopago
import os
from flask import Response
import json
import traceback
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure o Mercado Pago
sdk = mercadopago.SDK("APP_USR-2497859079825404-041710-5cc9eeb83958b58644bfc8267ea4c8e3-2392808365")  # Substitua pela sua chave real

# Inicializar base de dados SQLite
def init_db():
    conn = sqlite3.connect('agendamentos.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS agendamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            email TEXT,
            telefone TEXT,
            turno TEXT,
            data TEXT,
            quantidade INTEGER,
            observacoes TEXT,
            status TEXT,
            pref_id TEXT,
            external_reference TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()


@app.route('/webhook', methods=['POST'])
def webhook():
    try:
        # Obtém os dados da requisição
        data = request.json
        payment_id = data['data']['id']
        print(data)

        # Consulta o status do pagamento via Mercado Pago
        payment_details = sdk.payment().get(payment_id)
        external_reference = payment_details['response']['external_reference']
        status_novo = payment_details['response']['status']
        print(external_reference, status_novo)

        # Conexão com o banco de dados
        conn = sqlite3.connect('agendamentos.db')
        cursor = conn.cursor()

        # Verifica o status atual no banco antes de atualizar
        cursor.execute('''
            SELECT status FROM agendamentos
            WHERE external_reference = ?
        ''', (external_reference,))
        resultado_status = cursor.fetchone()

        if resultado_status:
            status_antigo = resultado_status[0]

            # Se o novo status é approved e o antigo não era, atualiza e envia e-mail
            if status_novo == 'approved' and status_antigo != 'approved':
                # Atualiza o status no banco
                cursor.execute('''
                    UPDATE agendamentos
                    SET status = ?
                    WHERE external_reference = ?
                ''', (status_novo, external_reference))
                conn.commit()

                # Busca os dados do agendamento
                cursor.execute('''
                    SELECT nome, email, data, turno, quantidade, observacoes 
                    FROM agendamentos
                    WHERE external_reference = ?
                ''', (external_reference,))
                resultado = cursor.fetchone()

                if resultado:
                    nome, email, data_ag, turno, quantidade, observacoes = resultado
                    dados_agendamento = {
                        'nome': nome,
                        'data': data_ag,
                        'turno': turno,
                        'quantidade': quantidade,
                        'observacoes': observacoes
                    }
                    enviar_email_agendamento(email, dados_agendamento)
                    

        conn.close()
        return 'Webhook processado com sucesso', 200

    except Exception as e:
        print(f"Erro ao processar o webhook: {e}")
        return 'Erro ao processar o webhook', 500




@app.route('/salvar_agendamento', methods=['POST'])
def salvar_agendamento():
    try:
        data = request.get_json() 
        print("Recebido do front-end:", data) # Recebendo os dados enviados pelo frontend
        

        nome = data.get('nome')
        email = data.get('email')  # Captura o email
        telefone = data.get('telefone')           # Nome do cliente
        turno = data.get('turno')         # Turno
        data_agendamento = data.get('data')  # Data do agendamento
        quantidade = data.get('quantidade')  # Quantidade de pessoas
        observacoes = data.get('observacoes')  # Observações
        pref_id = data.get('pref_id')    # Recebendo o pref_id gerado
        external_reference = f"{nome}-{turno}-{data_agendamento}" 

        if not pref_id:
            return jsonify({'error': 'pref_id não recebido'}), 400

        # Inserir no banco de dados
        conn = sqlite3.connect('agendamentos.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO agendamentos (nome, email, telefone, turno, data, quantidade, observacoes, status, pref_id, external_reference)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (nome, email, telefone, turno, data_agendamento, quantidade, observacoes, 'pendente', pref_id, external_reference))
        conn.commit()
        conn.close()

        print("Agendamento salvo com sucesso no SQLite!")
        return jsonify({'mensagem': 'Agendamento salvo com sucesso'}), 200

    except Exception as e:
        print("Erro ao salvar agendamento:", e)
        return jsonify({'error': 'Erro ao salvar agendamento'}), 500



@app.route('/gerar_link_pagamento', methods=['POST'])
def gerar_link_pagamento():
    try:
        # Receber os dados do corpo da requisição
        data = request.get_json()
        

        nome = data.get('nome')
        
        turno = data.get('turno')
        data_agendamento = data.get('data')
        quantidade = data.get('quantidade')
        external_reference = f"{nome}-{turno}-{data_agendamento}"

        # Criar pagamento no Mercado Pago
        preference_data = {
            "items": [
                {
                    "title": "Agendamento de Serviço",
                    "quantity": quantidade,
                    "unit_price": 100.0,  # Defina o preço conforme necessário
                    "currency_id": "BRL"
                }
            ],
            "back_urls": {
                "success": "https://www.google.com",
                "failure": "https://www.google.com",
                "pending": "https://www.google.com"
            },
            "auto_return": "all",
            "external_reference": external_reference
        }

        # Gerar o link de pagamento
        preference_response = sdk.preference().create(preference_data)

        # Imprimir a resposta para depuração
        print("Resposta do Mercado Pago:", preference_data)

        # Verificar se a chave 'response' e 'init_point' existem na resposta
        if 'response' in preference_response and 'init_point' in preference_response['response']:
            payment_url = preference_response['response']['init_point']
            preference_id = preference_response['response']['id']  # Esse é o pref_id

            print("Pagamento criado com sucesso:", payment_url)
            print("Preference ID (pref_id):", preference_id)

            return jsonify({'url': payment_url, 'pref_id': preference_id, 'external_reference': external_reference}), 200
        else:
            print("Erro: Não foi possível encontrar 'init_point' na resposta do Mercado Pago")
            print("Resposta completa:", preference_response)  # Adicione para verificar a estrutura da resposta
            return jsonify({'error': 'Erro ao gerar link de pagamento'}), 500

    except Exception as e:
        print("Erro geral na função gerar_link_pagamento:", e)
        traceback.print_exc()
        return jsonify({'error': 'Erro inesperado ao gerar link de pagamento'}), 500





if __name__ == '__main__':
    app.run(debug=True, port=5000)
