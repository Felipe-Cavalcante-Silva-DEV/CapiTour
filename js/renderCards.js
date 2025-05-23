const sliderContainer = document.getElementById("slider");

// Função para renderizar os cards
function renderCards(cards) {
  let html = "";

  cards.forEach((card, cardIndex) => {
    const imagensHTML = card.imagens.map((img, index) =>
      `<img src="${img}" ${index === 0 ? 'class="active"' : ''} alt="">`
    ).join("");

    const dotsHTML = card.imagens.map((_, index) =>
      `<span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
    ).join("");

    html += `
      <div class="row">
        <div class="image-slider" data-card-index="${cardIndex}">
          ${imagensHTML}
          <div class="dot-container">${dotsHTML}</div>
        </div>
        <div class="card-body">
          <h3>${card.titulo}</h3>
          <p>${card.descricao}</p>
          <h5>Entrada: ${card.entrada}</h5>
          <div class="button-wrapper">
            <h5 class="hora">Horário De Funcionamento: ${card.horario}</h5>
            <button><i class="fa-brands fa-google"></i></button>
            ${[...Array(5)].map(() => '<i class="fa-solid fa-star checked"></i>').join("")}
          </div>
        </div>
      </div>
    `;
  });

  sliderContainer.innerHTML = html;

  inicializarSliders();
}

// Função para inicializar os sliders individuais
function inicializarSliders() {
  const sliders = document.querySelectorAll('.image-slider');

  sliders.forEach(slider => {
    const images = slider.querySelectorAll('img');
    const dots = slider.querySelectorAll('.dot');
    let current = 0;

    function showSlide(index) {
      images.forEach((img, i) => img.classList.toggle('active', i === index));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
      current = index;
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => showSlide(index));
    });

    if (images.length <= 1) return;

    setInterval(() => {
      let next = (current + 1) % images.length;
      showSlide(next);
    }, 3000);
  });
}

// JUNÇÃO DE TODOS OS CARDS SEPARADOS POR ARQUIVOS
const todosOsCards = [...cardsData, ...(typeof cardsGastronomia !== 'undefined' ? cardsGastronomia : [])];
console.log(todosOsCards)

// Renderiza tudo por padrão
renderCards(todosOsCards);


