let personajes = [];
let timeoutId;
let paginaActual = 1;
const elementosPorPagina = 12;
let personajesFiltrados = [];

async function cargarPersonajes() {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = '<div class="loading">Cargando guerreros Z...</div>';
  
  try {
    const response = await fetch('https://dragonball-api.com/api/characters?limit=1000');
    
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    
    const data = await response.json();
    personajes = data.items;
    personajesFiltrados = [...personajes];
    
    // Inicializa la paginación con todos los personajes
    actualizarPaginacion();
    mostrarPersonajesPorPagina();
  } catch (error) {
    resultado.innerHTML = '<div class="not-found">¡Por las esferas del dragón! Ha ocurrido un error al cargar los personajes.</div>';
    console.error(error);
  }
}

function mostrarPersonajesPorPagina() {
  const resultado = document.getElementById('resultado');
  
  if (personajesFiltrados.length === 0) {
    resultado.innerHTML = '<div class="not-found">¡No se encontraron guerreros con ese nombre!</div>';
    document.getElementById('paginacion').innerHTML = '';
    return;
  }
  
  // Calcular índices para la paginación
  const inicio = (paginaActual - 1) * elementosPorPagina;
  const fin = inicio + elementosPorPagina;
  const personajesPagina = personajesFiltrados.slice(inicio, fin);
  
  resultado.innerHTML = "";
  
  personajesPagina.forEach((p, index) => {
    const card = document.createElement('div');
    card.className = "card";
    card.style.animationDelay = `${index * 0.05}s`;
    
    card.innerHTML = `
      <div class="card-img-container">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x400?text=Sin+Imagen'">
        <div class="power-aura"></div>
      </div>
      <h3>${p.name}</h3>
    `;
    
    resultado.appendChild(card);
  });
}

function actualizarPaginacion() {
  const paginacionDiv = document.getElementById('paginacion');
  const totalPaginas = Math.ceil(personajesFiltrados.length / elementosPorPagina);
  
  if (totalPaginas <= 1) {
    paginacionDiv.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // Botón anterior
  html += `<button ${paginaActual === 1 ? 'disabled' : ''} onclick="cambiarPagina(${paginaActual - 1})">«</button>`;
  
  // Límite de botones de página para mostrar
  let startPage = Math.max(1, paginaActual - 2);
  let endPage = Math.min(totalPaginas, paginaActual + 2);
  
  // Asegurar que siempre se muestren al menos 5 botones si hay suficientes páginas
  if (endPage - startPage < 4 && totalPaginas > 5) {
    if (paginaActual < 3) {
      endPage = Math.min(5, totalPaginas);
    } else if (paginaActual > totalPaginas - 2) {
      startPage = Math.max(1, totalPaginas - 4);
    }
  }
  
  // Primera página y elipsis
  if (startPage > 1) {
    html += `<button onclick="cambiarPagina(1)">1</button>`;
    if (startPage > 2) {
      html += `<span class="pagination-info">...</span>`;
    }
  }
  
  // Páginas centrales
  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="${i === paginaActual ? 'active' : ''}" onclick="cambiarPagina(${i})">${i}</button>`;
  }
  
  // Última página y elipsis
  if (endPage < totalPaginas) {
    if (endPage < totalPaginas - 1) {
      html += `<span class="pagination-info">...</span>`;
    }
    html += `<button onclick="cambiarPagina(${totalPaginas})">${totalPaginas}</button>`;
  }
  
  // Botón siguiente
  html += `<button ${paginaActual === totalPaginas ? 'disabled' : ''} onclick="cambiarPagina(${paginaActual + 1})">»</button>`;
  
  paginacionDiv.innerHTML = html;
}

function cambiarPagina(pagina) {
  paginaActual = pagina;
  mostrarPersonajesPorPagina();
  actualizarPaginacion();
  // Scroll suave hacia arriba
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function filtrarPersonajes() {
  clearTimeout(timeoutId);
  
  timeoutId = setTimeout(() => {
    const texto = document.getElementById('searchInput').value.toLowerCase().trim();
    personajesFiltrados = personajes.filter(p => p.name.toLowerCase().includes(texto));
    paginaActual = 1; // Volver a la primera página con los resultados filtrados
    actualizarPaginacion();
    mostrarPersonajesPorPagina();
  }, 300);
}

// Iniciar la carga al abrir la página
document.addEventListener('DOMContentLoaded', cargarPersonajes);

// Asignar el evento input
document.getElementById('searchInput').addEventListener('input', filtrarPersonajes);