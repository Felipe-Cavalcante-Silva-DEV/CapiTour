function initMap() {
  const brasilia = { lat: -15.793889, lng: -47.882778 };

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: brasilia,
  });

  const locais = [
    {
      nome: "Congresso Nacional",
      pos: { lat: -15.799, lng: -47.864 },
      link: "https://www.google.com/maps/place/Congresso+Nacional"
    },
    // ... mais locais
  ];

  const infoWindow = new google.maps.InfoWindow();

  locais.forEach(local => {
    const marker = new google.maps.Marker({
      position: local.pos,
      map,
      title: local.nome
    });

    marker.addListener("click", () => {
      infoWindow.setContent(`
        <div>
          <strong>${local.nome}</strong><br>
          <a href="${local.link}" target="_blank">Abrir no Google Maps</a>
        </div>
      `);
      infoWindow.open(map, marker);
    });
  });
}



