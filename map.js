// Inicializar el mapa centrado en una ubicación específica
var map = L.map('map').setView([-31.536814, -68.538280], 13);

// Cargar mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Definir un ícono personalizado para el lugar del hecho
var incidentIcon = L.icon({
    iconUrl: 'assets/lugar_hecho.png',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
});

// Añadir el marcador permanente para el lugar del hecho
var lugarHechoMarker = L.marker([-31.531590, -68.544850], { icon: incidentIcon }).addTo(map)
    .bindPopup("<b>Lugar del Hecho</b><br>Este es el centro del incidente.");

// Función para agregar un marcador al mapa para una cámara
function addMarker(camera) {
    var lat = parseFloat(camera["Latitud"]);
    var lng = parseFloat(camera["Longitud"]);

    // Validar si las coordenadas son válidas
    if (!isNaN(lat) && !isNaN(lng)) {
        console.log("Agregando marcador para cámara: ", camera["Nombre de Camara"]);
        var marker = L.marker([lat, lng]).addTo(map)
            .bindPopup('<b>' + camera["Nombre de Camara"].toUpperCase() + '</b><br>' + camera["Estado de Camara"] + '<br>' + camera["Tipo de Camara"]);
    } else {
        console.warn("Cámara con coordenadas inválidas: ", camera);
    }
}

// No cargues el archivo bd.json aquí, eso ya lo hace main.js
