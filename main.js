/* IMPORTACIÓN DE FUNCIONES */

import {getCollectionOfRandomEvents} from "./backend/randomevents.js"
import {CustomSelector} from "./backend/selector.js"
import {getArrayObjectsKeyEvents, getArrayRacersObjects, getArrayTeamsObjects, getArrayTypeEventsObjects} from "./backend/staticdata.js"

console.log(getCollectionOfRandomEvents(5*5))

/* VARIABLES DEL DOCUMENTO */
let tab_main_matrix = document.getElementById("tab_main_matrix")
let btn_reload = document.getElementById("btn_reload")

/* FUNCIONES DOCUMENT */
function updateTabMainMatrix(rows, cols) {
    
    let arr_random_events = getCollectionOfRandomEvents(rows * cols)
    
    tab_main_matrix.innerHTML = ""; // Limpiar la tabla antes de llenarla
    
    // Crear la tabla con el número de filas y columnas especificado
    for (let i = 0; i < rows; i++) {
        
        const row = document.createElement("tr");
        
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("td");
            cell.textContent = arr_random_events.at(i * cols + j);
            row.appendChild(cell);
        }
        
        tab_main_matrix.appendChild(row);
    }
}

/* MAIN */
updateTabMainMatrix(5, 5) // Inicializar la tabla con 5 filas y 5 columnas

btn_reload.addEventListener("click", function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del botón
    // Actualizar la tabla con nuevos valores aleatorios
    updateTabMainMatrix(5, 5);
});


// Datos para los selectores
const eventsData = getArrayObjectsKeyEvents()
const racersData = getArrayRacersObjects()
const teamsData = getArrayTeamsObjects()

// Variables globales para los selectores
let selectorEvents;

// Inicializar selectores cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Crear selector de tecnologías
    selectorEvents = new CustomSelector('selector1', eventsData, {
        label: 'Select the event type:',
        placeholder: 'Choose an event type of your liking',
        onSelectionChange: function(selection) {
            console.log('Event selected:', selection);
            console.log(getArrayTypeEventsObjects(selection.value));

            let selectorRacers = new CustomSelector("selector2", racersData, {
                label: 'Select a racer:',
                placeholder: 'Choose a racer of your liking',
                onSelectionChange: function(selection) {
                    console.log('Racer selected:', selection);
                }
            })

            let selectorTypesEvents = new CustomSelector("selector3", getArrayTypeEventsObjects(selection.value), {
                label: 'Select the type of event:',
                placeholder: 'Choose a type of event of your liking',
                onSelectionChange: function(selection) {
                    console.log('Type of event selected:', selection);
                }
            });
        }
    });
});