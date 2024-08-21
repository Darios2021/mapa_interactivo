// Variable global para almacenar las cámaras de todos los departamentos
var allCameras = [];

// Función para cargar las cámaras desde múltiples archivos JSON
function loadCameras() {
    const jsonFiles = ['camaras_capital.json', 'camaras_rivadavia.json', 'camaras_rawson.json', 'camaras_pocito.json'];

    // Array de promesas para cargar cada archivo JSON
    let promises = jsonFiles.map(file => fetch(file).then(response => response.json()));

    // Una vez que todas las promesas se resuelvan, combinamos los datos
    Promise.all(promises)
        .then(results => {
            results.forEach(data => {
                allCameras = allCameras.concat(data);
            });
            initFilters(); // Inicializar los filtros una vez que se cargan todos los datos
            applyFilters(); // Aplicar filtros con todos los datos cargados
        })
        .catch(error => {
            console.error('Error al cargar los datos de cámaras:', error);
        });
}

// (El resto del código permanece igual)


// Función para inicializar los filtros
function initFilters() {
    var estadoSet = new Set();
    var tipoSet = new Set();
    var departamentoSet = new Set();

    // Extraer las opciones únicas de estado, tipo y departamento
    allCameras.forEach(camera => {
        if (camera["Estado de Camara"]) estadoSet.add(camera["Estado de Camara"]);
        if (camera["Tipo de Camara"]) tipoSet.add(camera["Tipo de Camara"]);
        if (camera["Departamento"]) departamentoSet.add(camera["Departamento"]);
    });

    // Poblar los dropdowns
    populateDropdown('filter-estado', estadoSet);
    populateDropdown('filter-tipo', tipoSet);
    populateDropdown('filter-departamento', departamentoSet);
}

// Función para poblar un dropdown (select) con un conjunto de opciones
function populateDropdown(dropdownId, optionsSet) {
    var selectElement = document.getElementById(dropdownId);
    selectElement.innerHTML = '<option value="all">Todos</option>'; // Añadir opción "Todos"

    optionsSet.forEach(option => {
        // Asegúrate de no agregar opciones vacías o incorrectas
        if (option && option.trim() !== "" && option.toLowerCase() !== "no hay datos") {
            var opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        }
    });
}

// Función para aplicar los filtros seleccionados
function applyFilters() {
    // Obtener los valores de los filtros
    var filterEstado = document.getElementById('filter-estado').value;
    var filterTipo = document.getElementById('filter-tipo').value;
    var filterDepartamento = document.getElementById('filter-departamento').value;
    var searchQuery = document.getElementById('search-input').value.toLowerCase();

    // Filtrar las cámaras según los valores seleccionados
    var filteredCameras = allCameras.filter(function(camera) {
        var estadoMatch = filterEstado === 'all' || camera["Estado de Camara"] === filterEstado;
        var tipoMatch = filterTipo === 'all' || camera["Tipo de Camara"] === filterTipo;
        var departamentoMatch = filterDepartamento === 'all' || camera["Departamento"] === filterDepartamento;
        var matchesSearch = camera["Nombre de Camara"].toLowerCase().includes(searchQuery) || camera["ID"].toLowerCase().includes(searchQuery);

        return estadoMatch && tipoMatch && departamentoMatch && matchesSearch;
    });

    // Actualizar el resumen de cámaras
    updateSummary(filteredCameras);

    // Renderizar la tabla de cámaras
    renderTable(filteredCameras);

    // Actualizar el mapa con las cámaras filtradas
    updateMap(filteredCameras);
}

// Función para actualizar el resumen de cámaras
function updateSummary(filteredCameras) {
    var totalCameras = filteredCameras.length;
    var totalByType = {};
    var totalByStatus = {};

    filteredCameras.forEach(camera => {
        // Contar por tipo
        if (camera["Tipo de Camara"]) {
            totalByType[camera["Tipo de Camara"]] = (totalByType[camera["Tipo de Camara"]] || 0) + 1;
        }

        // Contar por estado
        if (camera["Estado de Camara"]) {
            totalByStatus[camera["Estado de Camara"]] = (totalByStatus[camera["Estado de Camara"]] || 0) + 1;
        }
    });

    const formatData = (entries) => {
        return entries
            .filter(([key, value]) => key.toLowerCase() !== "no hay datos" && value > 0)
            .map(([key, value]) => `${key}: ${value}`)
            .join('<br>');
    };

    // Actualizar los elementos HTML con los valores calculados
    document.getElementById('total-cameras').innerHTML = totalCameras;
    document.getElementById('total-by-type').innerHTML = formatData(Object.entries(totalByType));
    document.getElementById('total-by-status').innerHTML = formatData(Object.entries(totalByStatus));
}

// Función para renderizar la tabla de cámaras
function renderTable(filteredCameras) {
    var tableBody = document.getElementById('camera-table-body');
    tableBody.innerHTML = '';

    filteredCameras.forEach(camera => {
        var row = tableBody.insertRow();
        var cellName = row.insertCell(0);
        var cellStatus = row.insertCell(1);

        cellName.textContent = camera["Nombre de Camara"];
        cellStatus.textContent = camera["Estado de Camara"];
    });
}

// Función para actualizar el mapa con las cámaras filtradas
function updateMap(filteredCameras) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker && layer !== lugarHechoMarker) {
            map.removeLayer(layer);
        }
    });

    filteredCameras.forEach(camera => {
        addMarker(camera);
    });
}

// Función para limpiar los filtros
function clearFilters() {
    document.getElementById('filter-estado').value = 'all';
    document.getElementById('filter-tipo').value = 'all';
    document.getElementById('filter-departamento').value = 'all';
    document.getElementById('search-input').value = '';
    applyFilters();
}

// Event Listeners para los botones de limpiar filtros y buscar
document.getElementById('clear-filters').addEventListener('click', clearFilters);
document.getElementById('search-button').addEventListener('click', applyFilters);

// Cargar los datos de cámaras desde los archivos JSON
loadCameras();
