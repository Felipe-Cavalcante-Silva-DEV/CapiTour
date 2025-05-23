const filtroButtons = document.querySelectorAll('.category-btn');
let categoriaAtual = 'todos';

// Atualiza os botões de filtro
filtroButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    categoriaAtual = btn.getAttribute('data-category');
    filtroButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    aplicarFiltros();  // Chama a função de filtro ao clicar no botão
  });
});

// Função para remover acentos
function removerAcentos(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Busca no input
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', aplicarFiltros);

// Observar mudanças nos filtros de checkbox
const checkboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"]');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', aplicarFiltros);  // Chama a função de filtro ao mudar o checkbox
});

// Função principal de filtro
function aplicarFiltros() {
  const termo = removerAcentos(searchInput.value.toLowerCase());

  // Pega os valores marcados dos filtros de checkbox
  const filtrosSelecionados = {};

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const nome = checkbox.name;
      if (!filtrosSelecionados[nome]) {
        filtrosSelecionados[nome] = [];
      }
      filtrosSelecionados[nome].push(checkbox.value.toLowerCase());
    }
  });

  console.log("Filtros Selecionados:", filtrosSelecionados);  // Verificando os filtros aplicados

  let cardsFiltrados = todosOsCards;  // Começa com todos os cards

  // Filtro por categoria (botões)
  if (categoriaAtual !== 'todos') {
    cardsFiltrados = cardsFiltrados.filter(card => card.categoria === categoriaAtual);
  }

  // Filtro por texto (input)
  if (termo) {
    cardsFiltrados = cardsFiltrados.filter(card => {
      const titulo = removerAcentos(card.titulo?.toLowerCase() || '');
      const descricao = removerAcentos(card.descricao?.toLowerCase() || '');
      const preco = removerAcentos(card.preco?.toLowerCase() || '');
      return (
        titulo.includes(termo) ||
        descricao.includes(termo) ||
        preco.includes(termo)
      );
    });
  }

  // Filtros adicionais (checkboxes)
  cardsFiltrados = cardsFiltrados.filter(card => {
    return Object.entries(filtrosSelecionados).every(([filtroNome, valoresSelecionados]) => {
      const valorCard = (card[filtroNome] || '').toLowerCase();
      return valoresSelecionados.includes(valorCard);
    });
  });

  console.log("Cards Filtrados:", cardsFiltrados);  // Verificando os cards após todos os filtros aplicados

  renderCards(cardsFiltrados);  // Função para renderizar os cards filtrados
}
