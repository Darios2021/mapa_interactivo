// Inicializar el mapa
var map = L.map('map').setView([-31.536814, -68.538280], 13);

// Cargar mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Definir un ícono personalizado para el lugar del hecho
var incidentIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
    iconSize: [35, 35],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34]
});

// Cargar los datos del archivo JSON
fetch('bd.json')
    .then(response => response.json())
    .then(cameras => {
        var markers = [];

        // Función para agregar marcadores al mapa según los filtros aplicados
        function applyFilters() {
            // Limpiar marcadores existentes
            markers.forEach(function(marker) {
                map.removeLayer(marker);
            });
            markers = [];

            var filterEstado = document.getElementById('filter-estado').value;
            var filterTipo = document.getElementById('filter-tipo').value;

            cameras.forEach(function(camera) {
                // Validar si la cámara tiene coordenadas válidas
                if (!camera["ID"] || isNaN(camera["Latitud"]) || isNaN(camera["Longitud"])) {
                    console.warn(`Coordenadas no válidas para la cámara ID ${camera["ID"] || "undefined"}`);
                    return; // Ignorar esta entrada si no es válida
                }

                // Filtrar cámaras según el estado y tipo seleccionados
                if ((filterEstado === 'all' || camera["Estado de Camara"] === filterEstado) &&
                    (filterTipo === 'all' || camera["Tipo de Camara"].includes(filterTipo))) {

                    // Verificar si se necesita un ícono personalizado
                    var markerOptions = {};
                    if (camera["ID"] === "hecho") {
                        markerOptions.icon = incidentIcon;
                    }

                    var marker = L.marker([camera["Latitud"], camera["Longitud"]], markerOptions).addTo(map)
                        .bindPopup('<b>' + camera["Nombre de Camara"] + '</b><br>' + camera["Estado de Camara"] + '<br>' + camera["Tipo de Camara"]);
                    
                    markers.push(marker);
                }
            });
        }

        // Aplicar filtros cuando se hace clic en el botón
        document.getElementById('apply-filters').addEventListener('click', applyFilters);

        // Aplicar los filtros por defecto al cargar el mapa
        applyFilters();
    })
    .catch(error => console.error('Error al cargar el JSON:', error));
