import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Função para enviar e-mail
def enviar_email_agendamento(destinatario, dados_agendamento):
    remetente = 'zfelp.cs@gmail.com'
    senha = 'rulp ifyd vfhj osul'  # Gere isso nas configurações da sua conta Google
    assunto = 'Confirmação do seu agendamento'
    
    corpo = f"""
    Olá {dados_agendamento['nome']},

    Seu agendamento foi confirmado!

    📅 Data: {dados_agendamento['data']}
    🕒 Turno: {dados_agendamento['turno']}
    👥 Pessoas: {dados_agendamento['quantidade']}
    📝 Observações: {dados_agendamento.get('observacoes', 'Nenhuma')}

    Obrigado por agendar conosco!
    """

    msg = MIMEMultipart()
    msg['From'] = remetente
    msg['To'] = destinatario
    msg['Subject'] = assunto
    msg.attach(MIMEText(corpo, 'plain'))

    try:
        servidor = smtplib.SMTP('smtp.gmail.com', 587)
        servidor.starttls()
        servidor.login(remetente, senha)
        servidor.send_message(msg)
        servidor.quit()
        print('E-mail enviado com sucesso.')
    except Exception as e:
        print('Erro ao enviar e-mail:', e)
