/* Renders the route ("bib") list from data/routes.json and shows the
   selected route's GPX track on a Leaflet map. */

(async function () {
  const listEl = document.getElementById('route-list');
  const mapEl = document.getElementById('map');
  if (!listEl || !mapEl) return;

  const blazeColor = {
    blue: '#2E5C86',
    yellow: '#C99A2E',
    red: '#A83A2C'
  };

  const map = L.map(mapEl, { scrollWheelZoom: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  map.setView([42.3601, -71.0589], 13); // default center; refit once a route loads

  let currentTrack = null;
  let currentButton = null;

  function loadTrack(route, buttonEl) {
    if (currentTrack) {
      map.removeLayer(currentTrack);
      currentTrack = null;
    }
    if (currentButton) currentButton.classList.remove('is-active');
    buttonEl.classList.add('is-active');
    currentButton = buttonEl;

    currentTrack = new L.GPX(route.gpx, {
      async: true,
      polyline_options: {
        color: blazeColor[route.blaze] || '#38513C',
        weight: 5,
        opacity: 0.9
      },
      marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null
      }
    })
      .on('loaded', function (e) {
        map.fitBounds(e.target.getBounds(), { padding: [24, 24] });
      })
      .addTo(map);
  }

  try {
    const res = await fetch('data/routes.json');
    const routes = await res.json();

    listEl.innerHTML = '';
    routes.forEach((route, i) => {
      const btn = document.createElement('button');
      btn.className = 'bib';
      btn.type = 'button';
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = `
        <span class="bib-number">${route.bib}</span>
        <span class="bib-info">
          <h3>${route.name}</h3>
          <p>${route.description}</p>
          <span class="bib-meta">
            <span>${route.distanceMi} mi</span>
            <span>·</span>
            <span>${route.elevationFt} ft gain</span>
            <span class="blaze-tag ${route.blaze}"><span class="swatch"></span>${route.difficulty}</span>
          </span>
        </span>
      `;
      btn.addEventListener('click', () => loadTrack(route, btn));
      listEl.appendChild(btn);

      if (i === 0) loadTrack(route, btn); // show first route by default
    });
  } catch (err) {
    listEl.innerHTML = '<p class="empty-state">Couldn\'t load routes right now — check data/routes.json.</p>';
    console.error(err);
  }
})();
