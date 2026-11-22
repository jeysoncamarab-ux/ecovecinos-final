EV.map = (function () {
  const COLORS = { pending: '#b7791f', active: '#2b6cb0', resolved: '#2f855a' };
  const RADIO_AGRUPACION = 50;

  // Lógica del mapa con Leaflet y OpenStreetMap

  function create(idContenedor, centro, zoom) {
    const el = document.getElementById(idContenedor);
    if (typeof L === 'undefined') {
      el.innerHTML = '<p class="text-muted map-fallback">No se pudo cargar el mapa (sin conexión). La lista de reportes sigue disponible.</p>';
      return null;
    }
    const map = L.map(el, { scrollWheelZoom: false }).setView([centro.lat, centro.lng], zoom || 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      referrerPolicy: 'strict-origin-when-cross-origin',
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    const capa = L.layerGroup().addTo(map);
    setTimeout(() => map.invalidateSize(), 80);

    // HU-19: agrupar visualmente reportes del mismo punto (radio de 50 m).
    // El agrupamiento no elimina reportes: la lista conserva cada registro individual.
    function agrupar(items) {
      const disponibles = new Map(items.map(item => [item.id, item]));
      const grupos = [];
      const vistos = new Set();
      const clusters = EV.store.clusters();

      items.forEach(item => {
        if (vistos.has(item.id)) return;
        const cluster = clusters[item.id];
        const miembros = cluster
          ? cluster.members.filter(m => disponibles.has(m.id))
          : [item];
        const unicos = miembros.filter(m => !vistos.has(m.id));
        const grupo = unicos.length ? unicos : [item];
        grupo.forEach(m => vistos.add(m.id));
        grupos.push(grupo);
      });
      return grupos;
    }

    function marcadorGrupo(grupo, alHacerClic) {
      const lat = grupo.reduce((total, item) => total + item.lat, 0) / grupo.length;
      const lng = grupo.reduce((total, item) => total + item.lng, 0) / grupo.length;
      const ids = grupo.map(item => item.id);
      const personas = grupo.reduce((total, item) => total + 1 + (item.supporters || []).length, 0);

      if (grupo.length > 1) {
        const icono = L.divIcon({
          className: '',
          html: '<span style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:3px solid #fff;border-radius:50%;background:#1e5b3a;color:#fff;font-size:13px;font-weight:700;box-shadow:0 1px 6px rgba(0,0,0,.35)">' + grupo.length + '</span>',
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });
        const marcador = L.marker([lat, lng], { icon: icono });
        marcador.bindTooltip(grupo.length + ' reportes agrupados · ' + personas + ' vecinos<br>' + ids.join(', '));
        if (alHacerClic) marcador.on('click', () => alHacerClic(ids[0]));
        marcador.addTo(capa);
        return;
      }

      const item = grupo[0];
      const marcador = L.circleMarker([item.lat, item.lng], {
        radius: 9, color: '#fff', weight: 2, fillColor: COLORS[item.status] || '#555', fillOpacity: 0.95
      });
      marcador.bindTooltip(item.id + ' - ' + EV.ui.STATUS[item.status]);
      if (alHacerClic) marcador.on('click', () => alHacerClic(item.id));
      marcador.addTo(capa);
    }

    return {
      map: map,
      setMarkers(items, alHacerClic) {
        capa.clearLayers();
        agrupar(items).forEach(grupo => marcadorGrupo(grupo, alHacerClic));
      },
      fit(puntos) {
        if (puntos.length > 1) {
          map.fitBounds(puntos.map(p => [p.lat, p.lng]), { padding: [30, 30], maxZoom: 16 });
        } else if (puntos.length === 1) {
          map.setView([puntos[0].lat, puntos[0].lng], 16);
        }
      },
      destroy() {
        map.remove();
      }
    };
  }

  return { create };
})();
