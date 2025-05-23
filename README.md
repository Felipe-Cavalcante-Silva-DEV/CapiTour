# 🌆 Sistema de Agendamentos Turísticos - Brasília

Este projeto é um site responsivo para agendamento de serviços turísticos em Brasília, desenvolvido com **HTML**, **CSS** e **JavaScript** no frontend, e **Python** no backend para integração com a API de pagamentos do **Mercado Pago**.

## 📌 Funcionalidades

- Exibição de pacotes turísticos em cards com imagens e descrição.
- Formulário de agendamento com seleção de:
  - Nome
  - Data
  - Turno (manhã/tarde)
  - Quantidade de pessoas
  - Observações
- Envio dos dados para o backend Python.
- Geração de link de pagamento via Mercado Pago.
- Status de agendamento salvo como "pendente" até a confirmação do pagamento.
- Webhook para atualização automática do status de pagamento.

## 🛠️ Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript (vanilla)
- Responsividade com Flexbox/Grid

### Backend
- Python 3.x
- Flask
- Firebase Admin SDK (para banco de dados)
- Mercado Pago SDK

## 💳 Integração com Mercado Pago

O backend em Python gera um link de pagamento com os dados do agendamento e responde ao frontend com a URL. O usuário é redirecionado para concluir o pagamento.

Um webhook escuta atualizações do Mercado Pago e altera o status do agendamento no banco de dados para "confirmado" após o pagamento.

## 🔧 Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/sistema-agendamentos-turismo.git
cd sistema-agendamentos-turismo
