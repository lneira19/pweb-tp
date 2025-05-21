/* IMPORTACIÓN DE FUNCIONES */

import {getCollectionOfRandomEvents} from "./backend/randomevents.js"

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