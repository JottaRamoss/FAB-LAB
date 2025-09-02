// ===== MAPA INTERATIVO DOS FAB LABS =====

let map;
let markers = [];
let filteredLabs = [...fabLabsData];

// Cores por região
const regionColors = {
    'Sudeste': '#e74c3c',
    'Sul': '#3498db',
    'Nordeste': '#f39c12',
    'Centro-Oeste': '#27ae60'
};

// Inicializar o mapa quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    populateLabList();
    setupEventListeners();
});

// Inicializar o mapa Leaflet
function initializeMap() {
    // Criar o mapa centrado no Brasil
    map = L.map('map').setView([-15.7939869, -47.8828], 4);

    // Adicionar camada de tiles do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Adicionar marcadores para todos os Fab Labs
    addMarkersToMap(fabLabsData);
}

// Adicionar marcadores ao mapa
function addMarkersToMap(labs) {
    // Limpar marcadores existentes
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    labs.forEach((lab, index) => {
        if (lab.latitude && lab.longitude) {
            // Criar ícone personalizado baseado na região
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="
                    background-color: ${regionColors[lab.region] || '#666'};
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                "></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            // Criar marcador
            const marker = L.marker([lab.latitude, lab.longitude], { icon })
                .addTo(map)
                .bindPopup(`
                    <div class="popup-content">
                        <div class="popup-title">${lab.name}</div>
                        <div class="popup-location"><i class="fas fa-map-marker-alt"></i> ${lab.location}</div>
                        <div class="popup-description">${lab.description}</div>
                    </div>
                `);

            // Adicionar evento de clique no marcador
            marker.on('click', function() {
                selectLabInList(index);
            });

            markers.push(marker);
        }
    });
}

// Preencher a lista de labs na sidebar
function populateLabList() {
    const labList = document.getElementById('lab-list');
    labList.innerHTML = '';

    filteredLabs.forEach((lab, index) => {
        const labItem = document.createElement('div');
        labItem.className = 'lab-item';
        labItem.dataset.index = index;
        
        labItem.innerHTML = `
            <div class="lab-name">${lab.name}</div>
            <div class="lab-location"><i class="fas fa-map-marker-alt"></i> ${lab.location}</div>
            <div class="lab-description">${lab.description}</div>
        `;

        // Adicionar evento de clique
        labItem.addEventListener('click', function() {
            const originalIndex = fabLabsData.findIndex(l => l.name === lab.name);
            selectLabInList(originalIndex);
            
            // Centralizar o mapa no lab selecionado
            if (lab.latitude && lab.longitude) {
                map.setView([lab.latitude, lab.longitude], 10);
                
                // Abrir popup do marcador correspondente
                const marker = markers.find(m => 
                    m.getLatLng().lat === lab.latitude && 
                    m.getLatLng().lng === lab.longitude
                );
                if (marker) {
                    marker.openPopup();
                }
            }
        });

        labList.appendChild(labItem);
    });
}

// Selecionar lab na lista
function selectLabInList(index) {
    // Remover seleção anterior
    document.querySelectorAll('.lab-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Adicionar seleção ao item clicado
    const labItems = document.querySelectorAll('.lab-item');
    if (labItems[index]) {
        labItems[index].classList.add('selected');
        labItems[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros por região
    const regionButtons = document.querySelectorAll('[data-region]');
    regionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Atualizar botões ativos
            regionButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filtrar labs
            const region = this.dataset.region;
            if (region === 'all') {
                filteredLabs = [...fabLabsData];
            } else {
                filteredLabs = fabLabsData.filter(lab => lab.region === region);
            }

            // Atualizar mapa e lista
            addMarkersToMap(filteredLabs);
            populateLabList();
            
            // Ajustar zoom do mapa para mostrar todos os labs filtrados
            if (filteredLabs.length > 0) {
                const group = new L.featureGroup(markers);
                map.fitBounds(group.getBounds().pad(0.1));
            }
        });
    });

    // Busca por texto
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // Obter região ativa
        const activeRegion = document.querySelector('[data-region].active').dataset.region;
        let baseData = activeRegion === 'all' ? fabLabsData : fabLabsData.filter(lab => lab.region === activeRegion);
        
        // Filtrar por termo de busca
        if (searchTerm) {
            filteredLabs = baseData.filter(lab => 
                lab.name.toLowerCase().includes(searchTerm) ||
                lab.location.toLowerCase().includes(searchTerm) ||
                lab.description.toLowerCase().includes(searchTerm)
            );
        } else {
            filteredLabs = [...baseData];
        }

        // Atualizar mapa e lista
        addMarkersToMap(filteredLabs);
        populateLabList();
    });
}

// Função para redimensionar o mapa quando necessário
function resizeMap() {
    if (map) {
        map.invalidateSize();
    }
}

// Redimensionar mapa quando a janela for redimensionada
window.addEventListener('resize', resizeMap);

// Exportar funções para uso global se necessário
window.fabLabMap = {
    resizeMap,
    selectLabInList,
    filteredLabs: () => filteredLabs
};

