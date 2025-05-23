


// Slideshow de imagens por card com dots
document.querySelectorAll('.image-slider').forEach(slider => {
  const images = slider.querySelectorAll('img');
  let current = 0;
  let interval;

  // Criar dots dinamicamente
  const dotContainer = document.createElement('div');
  dotContainer.classList.add('dot-container');

  images.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.dataset.index = index;

    dot.addEventListener('click', () => {
      current = index;
      showImage(current);
      resetInterval(); // Reinicia o intervalo após clique
    });

    dotContainer.appendChild(dot);
  });

  slider.appendChild(dotContainer);

  function showImage(index) {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });

    const dots = slider.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function startInterval() {
    interval = setInterval(() => {
      current = (current + 1) % images.length;
      showImage(current);
    }, 4000);
  }

  function resetInterval() {
    clearInterval(interval);
    startInterval();
  }

  showImage(current);
  startInterval();
});















  const decrement = document.getElementById('decrement');
  const increment = document.getElementById('increment');
  const quantidadeSpan = document.getElementById('quantidade');
  let quantidade = 1;

  decrement.onclick = () => {
    if (quantidade > 1) {
      quantidade--;
      quantidadeSpan.textContent = quantidade;
    }
  };

  increment.onclick = () => {
    if (quantidade < 4) {
      quantidade++;
      quantidadeSpan.textContent = quantidade;
    }
  };

 // document.getElementById('booking-form').addEventListener('submit', function(e) {
  //  e.preventDefault();
  
 //   const nome = document.getElementById('nome').value;
 //   const turno = document.getElementById('turno').value;
  //  const data = document.getElementById('data').value;
 //   const quantidade = document.getElementById('quantidade').textContent; // não esquece de declarar isso!
 //   const observacoes = document.getElementById('observacoes').value;
  
 //   if (!nome || !turno || !data) {
  //    alert('Por favor, preencha todos os campos obrigatórios.');
  //    return;
 //   }
  
 //   const mensagem = `Olá! Gostaria de agendar o serviço.\n\nNome: ${nome}\nTurno: ${turno}\nData: ${data}\nQuantidade de pessoas: ${quantidade}\nObservações: ${observacoes || "Nenhuma"}`;
  
 //   const whatsappURL = `https://wa.me/5561992633520?text=${encodeURIComponent(mensagem)}`;
  
//alert("Você será redirecionado para o WhatsApp. Clique em 'enviar' na conversa para confirmar o agendamento!");
  
 //   window.open(whatsappURL, '_blank');
 // });
  
