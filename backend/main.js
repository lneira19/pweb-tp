/* 1. IMPORTACIÓN DE FUNCIONES */

import {getCollectionOfRandomEvents} from "./randomevents.js"
import {CustomSelector} from "./selector.js"
import {getArrayObjectsKeyEvents, getArrayRacersObjects, getArrayTeamsObjects, getArrayTypeEventsObjects} from "./staticdata.js"
import {getNextStage} from "./staticdata.js"

/* 2. VARIABLES BACKEND GLOBALES: DEFINICIÓN E INCIALIZACIÓN */

// Array para almacenar los textos de las celdas junto a inicialización aleatoria
let arr_events = getCollectionOfRandomEvents(5 * 5)

// Array para almacenar los estados de los boxes
let arr_boxes_states = [] 

// Inicializar el array de estados de los boxes
function getDefaultCellState() {
    for (let i = 0; i < 5 * 5; i++) {
        // Estado inicial de cada celda)
        arr_boxes_states.push('default') 
    }
}
getDefaultCellState()

 // Variable para bloquear la grilla
let blocked_grid = false;

// Variable para almacenar colores de uso general
let webp_colours = {
    'cell_border': "#202020",
    'cell_border_selected': "#ECC26F",
    'checked': '#FF1F1F',
    'unchecked': '#26394f',
    'default': '#26394f',
    'empty': "#5388BE",
    'selected': "#E5AC38",
    'footer': "#14141c",
};

/* 3. VARIABLES DEL DOCUMENTO GLOBALES */

// Grilla
let tab_main_matrix = document.getElementById("tab_main_matrix")

// Botón de recarga con valores aleatorios
let btn_reload = document.getElementById("btn_reload")

// Botón para cerrar el contenedor de botones móviles
let mobile_btn_close = document.getElementById("mobile_btn_close");

// Botón para cerrar el contenedor de edición
let btn_close_edit_box = document.getElementById("btn_close_edit_box");

// Botón de navegación hacia la grilla
let btn_to_grill = document.getElementById("btn_to_grill");

// Botón de navegación hacia editor de boxes
let btn_to_custom_grill = document.getElementById("btn_to_custom_grill");

// Botón de navegación hacia el sección circuito
let btn_to_circuit = document.getElementById("btn_to_circuit");

// Botón de navegación hacia la sección de ayuda
let btn_to_help = document.getElementById("btn_to_help");

/* 4. FUNCIONES DOCUMENT GLOBALES */

// Función para colorear boxes según su estado
function recolorBoxes() {
    
    let allBoxes = document.querySelectorAll("td");
    
    let i = 0
    allBoxes.forEach(box => {
        box.style.border = '2px solid' + webp_colours["cell_border"]; // Borde original
        
        let cellState = arr_boxes_states.at(i); // Obtener el estado de la celda

        if (cellState === 'checked') {
            box.style.backgroundColor = webp_colours["checked"]; // Cambiar el borde a verde
        }
        else if (cellState === 'unchecked') {
            box.style.backgroundColor = webp_colours["unchecked"]; // Cambiar el borde a rojo
        }
        else if (cellState === 'default') {
            box.style.backgroundColor = webp_colours["default"]; // Cambiar el borde a gris
        }
        else if (cellState === 'empty') {
            box.style.backgroundColor = webp_colours["empty"]; // Cambiar el borde a azul
        }
        
        i++;  
    });
}

// Función para actualizar la tabla luego de crearla o modificarla
function updateTabMainMatrix(rows, cols) {
    
    tab_main_matrix.innerHTML = ""; // Limpiar la tabla antes de llenarla
    
    // Crear la tabla con el número de filas y columnas especificado
    for (let i = 0; i < rows; i++) {
        
        const row = document.createElement("tr");
        
        for (let j = 0; j < cols; j++) {
            const box = document.createElement("td");
            box.id = "cell" + (i * cols + j); // Asignar un ID único a cada box

            const containerBox = createContainerBox(arr_events.at(i * cols + j), i * cols + j)
            box.appendChild(containerBox); // Agregar el container_box al box

            
            box.onclick = function() {
                let selection = i * cols + j

                let status = arr_boxes_states.at(selection); // Obtener el estado del box

                // Mostrar div
                if (window.matchMedia('(max-width: 700px)').matches) {
                    const container_mobile_box_btns = document.getElementById("container_mobile_box_btns");
                    container_mobile_box_btns.style.display = "grid"; // Ocultar el contenedor de botones móviles
                }


                // Eliminar botón check
                const mobile_check_btn_area = document.getElementById("mobile_check_btn_area");
                mobile_check_btn_area.removeChild(document.querySelector('#mobile_btn_check'));
                
                // Eliminar botón delete
                const mobile_delete_btn_area = document.getElementById("mobile_delete_btn_area");
                mobile_delete_btn_area.removeChild(document.querySelector('#mobile_btn_delete'));

                // Eliminar botón edit
                const mobile_edit_btn_area = document.getElementById("mobile_edit_btn_area");
                mobile_edit_btn_area.removeChild(document.querySelector('#mobile_btn_edit'));


                // Crear un nuevo botón Check
                const mobile_btn_check = document.createElement("input");
                mobile_btn_check.type = "button";
                mobile_btn_check.id = "mobile_btn_check";
                mobile_btn_check.className = "mobile_btn_box";
                mobile_btn_check.setAttribute("data-state", status);
                if (status === 'default') {
                    mobile_btn_check.value = "Check box"; // Valor del botón Check
                }
                else if (status === 'checked') {
                    mobile_btn_check.value = "Uncheck box"; // Valor del botón Check
                } 
                else if (status === 'unchecked') {
                    mobile_btn_check.value = "Check box"; // Valor del botón Check
                }
                else if (status === 'empty') {
                    mobile_btn_check.value = "Check box"; // Valor del botón Check
                    mobile_btn_check.disabled = true; // Deshabilitar el botón si la celda está vacía
                    mobile_btn_check.style.opacity = '0.5'; // Cambiar la opacidad del botón
                }

                // Crear un nuevo botón Delete
                const mobile_btn_delete = document.createElement("input");
                mobile_btn_delete.type = "button";
                mobile_btn_delete.id = "mobile_btn_delete";
                mobile_btn_delete.className = "mobile_btn_box";
                mobile_btn_delete.value = "Delete box"; // Valor del botón Delete
                if (blocked_grid === true) {
                    mobile_btn_delete.disabled = true; // Deshabilitar el botón si la cuadrícula está bloqueada
                    mobile_btn_delete.style.opacity = '0.5'; // Cambiar la opacidad del botón
                }

                // Crear un nuevo botón Edit
                const mobile_btn_edit = document.createElement("input");
                mobile_btn_edit.type = "button";
                mobile_btn_edit.id = "mobile_btn_edit";
                mobile_btn_edit.className = "mobile_btn_box";
                mobile_btn_edit.value = "Edit box"; // Valor del botón Edit
                if (blocked_grid === true) {
                    mobile_btn_edit.disabled = true; // Deshabilitar el botón si la cuadrícula está bloqueada
                    mobile_btn_edit.style.opacity = '0.5'; // Cambiar la opacidad del botón
                }

                // Agregar los nuevos botones al área correspondiente
                mobile_check_btn_area.appendChild(mobile_btn_check); // Agregar el nuevo botón Check
                mobile_delete_btn_area.appendChild(mobile_btn_delete); // Agregar el nuevo botón Delete
                mobile_edit_btn_area.appendChild(mobile_btn_edit); // Agregar el nuevo botón Edit

                mobile_btn_check.addEventListener("click", function() {
                    console.log("cell clicked:", selection);
                })
                
                // Configurar los event listeners para los botones móviles
                setupEventListenersForBoxBtns(
                    selection,
                    mobile_btn_check,
                    mobile_btn_delete,
                    mobile_btn_edit,
                    containerBox.querySelector('.box_text_area')
                );

            }

            row.appendChild(box);
        }
        
        tab_main_matrix.appendChild(row);
    }

    recolorBoxes(); // Recolorear las celdas después de crear la tabla
}

// Función para verificar si se ha hecho bingo
function checkForBingo() {
    if (arr_boxes_states.every(state => state === 'checked')) {
        console.log("Bingo! All cells are checked.");
        return true; // Retornar true si se ha hecho bingo
    }
    else {
        console.log("Not all cells are checked yet.");
        return false; // Retornar false si no se ha hecho bingo
    }
}

// Función para desplazarse a una sección específica del documento
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ 
        behavior: 'smooth' // Desplazamiento suave
    });      
}

// Función para actualizar la sección del circuito
function updateCircuitSection() {
    const circuit = getNextStage();
    
    // TEXTO
    const circuit_title_area = document.getElementById("circuit_title_area");
    circuit_title_area.innerHTML = circuit.name; // Actualizar el título del circuito

    const circuit_country_area = document.getElementById("circuit_country_area");
    circuit_country_area.innerHTML = circuit.country; // Actualizar el país del circuito

    const laps_value = document.getElementById("laps_value");
    laps_value.innerHTML = circuit.laps; // Actualizar el número de vueltas del circuito

    const turns_value = document.getElementById("turns_value");
    turns_value.innerHTML = circuit.turns; // Actualizar el número de curvas del circuito

    const length_value = document.getElementById("length_value");
    length_value.innerHTML = circuit["circuit-length"]+" m"; // Actualizar la longitud del circuito

    const circuit_history_area = document.getElementById("circuit_history_area");
    circuit_history_area.innerHTML = circuit.history; // Actualizar la historia del circuito

    // IMAGEN
    const circuit_img_area = document.getElementById("circuit_img_area");
    circuit_img_area.innerHTML = ""; // Limpiar el área de imagen antes de agregar la nueva
    const circuitImg = document.createElement("img");
    circuitImg.src = circuit.imgsrc; // Asignar la fuente de la imagen del circuito
    circuitImg.alt = "Circuit Image"; // Texto alternativo para la imagen
    circuitImg.height = "300"; // Altura de la imagen
    circuitImg.width = "500"; // Ancho de la imagen
    circuit_img_area.appendChild(circuitImg); // Agregar la imagen al área correspondiente
}

/* 5. EVENT LISTENERS GLOBALES */

// Evento para el botón de cerrar el contenedor de botones móviles
mobile_btn_close.addEventListener("click", function() {
    const container_mobile_box_btns = document.getElementById("container_mobile_box_btns");
    // Ocultar el contenedor de botones móviles
    container_mobile_box_btns.style.display = "none"; 
})

// Evento para el botón de recarga aleatoria
btn_reload.addEventListener("click", function(event) {
     // Prevenir el comportamiento por defecto del botón
    event.preventDefault();
    
    // Verificar si se ha hecho bingo
    let bingo = checkForBingo();
    if (bingo) {
        document.getElementById("tab_main_matrix_title").style.display = "grid"
        document.getElementById("bingo_message").style.display = "none";
    }

    // Reiniciar el array de eventos con nuevos valores aleatorios
    arr_events = getCollectionOfRandomEvents(5 * 5)
    
     // Reiniciar el array de estados de las celdas
    arr_boxes_states = [];
    
     // Reiniciar los estados de las celdas
    getDefaultCellState();

    // Actualizar la tabla con nuevos valores aleatorios
    updateTabMainMatrix(5, 5);

    // Desplazar a la sección de la tabla
    scrollToSection('container_motto')
});

// Evento para el botón de cerrar el contenedor de edición
btn_close_edit_box.addEventListener("click", function() {
    document.getElementById("container_edit_box").style.display = "none"; // Ocultar el contenedor de edición

    recolorBoxes()
    
    scrollToSection('container_motto'); // Desplazarse a la sección de la tabla
});

// Evento para el botón de navegación hacia la grilla
btn_to_grill.addEventListener("click", function() {
    
    scrollToSection("table_container"); // Desplazarse a la sección de la tabla
})

// Evento para el botón de navegación hacia el editor de boxes
btn_to_custom_grill.addEventListener("click", function() {
    
    document.getElementById("container_edit_box").style.display = "grid";

    scrollToSection('container_edit_box'); // Desplazarse a la sección de edición
})

// Evento para el botón de navegación hacia la sección del circuito
btn_to_circuit.addEventListener("click", function() {
    
    scrollToSection('container_circuit'); // Desplazarse a la sección del circuito
})

// Evento para el botón de navegación hacia la sección de ayuda
btn_to_help.addEventListener("click", function() {
    scrollToSection('container_help'); // Desplazarse a la sección de ayuda
})

/* 6. INCIALIZACIÓN DEL MAIN CON EJECUCIÓN DE FUNCIONES BACKEND Y DOCUMENT */

// Inicializar la tabla con 5 filas y 5 columnas
updateTabMainMatrix(5, 5)
updateCircuitSection()
updateHeaderNavigation();

/* 7. MANEJO COMPLEJO DE SECCIONES PARTICUALRES DEL HTML*/ 

/* ################# CÓDIGO DEDICADO A SELECTORES ################# */
// Variable para almacenar la celda seleccionada para editar
let selectedBoxToEdit = null;

// Datos para los selectores
const eventsData = getArrayObjectsKeyEvents()
const racersData = getArrayRacersObjects()
const teamsData = getArrayTeamsObjects()

// Obtener los elementos del DOM para los selectores
let selector2 = document.getElementById("selector2");
let selector3 = document.getElementById("selector3");
let selector4 = document.getElementById("selector4");
let selector5 = document.getElementById("selector5");

// Obtener el área del botón de confirmación y el mensaje de alerta
let edit_box_confirm_btn_area = document.getElementById("edit_box_confirm_btn_area")
let edit_box_alert = document.getElementById("edit_box_alert")

// Inicializar selectores cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Crear selector de tecnologías
    
    let selectorEvents = new CustomSelector('selector1', eventsData, {
        label: 'Select the event type:',
        placeholder: 'Choose an event type of your liking',
        onSelectionChange: function(selection) {
            
            edit_box_confirm_btn_area.innerHTML = ""; // Limpiar el área del botón antes de agregar uno nuevo
            
            // Creación de botón de confirmación
            const btn_edit_box_confirm = document.createElement("button");
            btn_edit_box_confirm.id = "btn_edit_box_confirm";
            btn_edit_box_confirm.textContent = "Confirm selection";
            btn_edit_box_confirm.className = "btn_edit_box_confirm";
            edit_box_confirm_btn_area.appendChild(btn_edit_box_confirm);

            selector2.innerHTML = ""; // Limpiar el selector2 antes de llenarlo
            selector3.innerHTML = ""; // Limpiar el selector3 antes de llenarlo
            selector4.innerHTML = ""; // Limpiar el selector4 antes de llenarlo
            selector5.innerHTML = ""; // Limpiar el selector5 antes de llenarlo

            edit_box_alert.innerHTML = ""; // Limpiar el mensaje de alerta

            switch (selection.value) {
                case 'racer-event':
                    racerEventSelectors(selection.value);
                    break;
                case 'racer-event-racer':
                    racerEventRacerSelector(selection.value);
                    break;
                case 'team-event':
                    teamEventSelectors(selection.value);
                    break;
                case 'lap-or-turn-event':
                    lapOrTurnEventSelector(selection.value);
                    break;
                case 'amount-event':
                    amountEventSelector(selection.value);
                    break;
                case 'random-event':
                    randomEventSelector(selection.value);
                    break;
            }

        }
    });
});

function racerEventSelectors(event_key){
    
    let racer = null
    let event = null
    let position = ""

    let selectorRacers = new CustomSelector("selector2", racersData, {
        label: 'Select a racer:',
        placeholder: 'Choose a racer of your liking',
        onSelectionChange: function(selection) {
            racer = selection.text; // Guardar el valor del corredor seleccionado
        }
    })

    let selectorTypesEvents = new CustomSelector("selector3", getArrayTypeEventsObjects(event_key), {
        
        label: 'Select the type of event:',
        placeholder: 'Choose a type of event of your liking',
        onSelectionChange: function(selection) {
            
            selector5.innerHTML = ""
            position = "" // Reiniciar la posición al seleccionar un nuevo evento

            event = selection.text; // Guardar el valor del evento seleccionado

            if (selection.value === 6){

                let positionData = []

                for (let i = 1; i < 20; i++) {
                    positionData.push({
                        value: i + 1,
                        text: i + 1
                    });
                }

                let selectorPositions = new CustomSelector("selector5", positionData, {
                    label: 'Select the position:',
                    placeholder: 'Choose a position of your liking',
                    onSelectionChange: function(selection) {
                        position = selection.text; // Guardar el valor de la posición seleccionada
                    }
                });
            }
        }
    });

    function sendSelectedData() {

        if (selectedBoxToEdit === null) {
            console.log("Please select a box to edit.");
            edit_box_alert.innerHTML = "Please select a box to edit";
            return
        }

        if (racer && event) {
            
            if (event === "P" && position === "") {
                console.log("Please select a position for the racer.");
                edit_box_alert.innerHTML = "Please select a position for the racer";
                return;
            }
            else{
                
                edit_box_alert.innerHTML = ""; // Limpiar el mensaje de alerta

                arr_events[selectedBoxToEdit] = racer+" "+event+position; // Actualizar el texto de la celda seleccionada
                
                arr_boxes_states[selectedBoxToEdit] = 'default'; // Actualizar el estado de la celda a 'default'

                updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

                scrollToSection('container_motto'); // Desplazarse a la sección de la tabla 

                console.log(arr_events.at(selectedBoxToEdit));
                
                selectedBoxToEdit = null; // Reiniciar la celda seleccionada para evitar ediciones múltiples sin selección
            }
        }
        else {
            console.log("Please select a racer and an event type.")
            edit_box_alert.innerHTML = "Please select a racer and an event type.";
        }
    }

    btn_edit_box_confirm.addEventListener("click", function(e){
        e.preventDefault() // Prevenir el comportamiento por defecto del botón

        sendSelectedData(); // Llamar a la función para enviar los datos seleccionados
    })
}

function racerEventRacerSelector(event_key) {

    let racer1 = null
    let event = null
    let racer2 = null

    let selectorRacers1 = new CustomSelector("selector2", racersData, {
        label: 'Select the first racer:',
        placeholder: 'Choose a racer of your liking',
        onSelectionChange: function(selection) {
            racer1 = selection.text; // Guardar el valor del primer corredor seleccionado
        }
    });

    let selectorTypesEvents = new CustomSelector("selector3", getArrayTypeEventsObjects(event_key), {
        label: 'Select the type of event:',
        placeholder: 'Choose a type of event of your liking',
        onSelectionChange: function(selection) {
            event = selection.text; // Guardar el valor del evento seleccionado
        }
    });

    let selectorRacers2 = new CustomSelector("selector4", racersData, {
        label: 'Select the second racer:',
        placeholder: 'Choose a racer of your liking',
        onSelectionChange: function(selection) {
            racer2 = selection.text; // Guardar el valor del segundo corredor seleccionado
        }
    });


    function sendSelectedData() {
        if (selectedBoxToEdit === null) {
            console.log("Please select a box to edit.");
            edit_box_alert.innerHTML = "Please select a box to edit";
            return
        }


        if (racer1 && event && racer2) {
            edit_box_alert.innerHTML = ""; // Limpiar el mensaje de alerta
            
            arr_events[selectedBoxToEdit] = racer1 + " " + event + " " + racer2; // Actualizar el texto de la celda seleccionada
            
            arr_boxes_states[selectedBoxToEdit] = 'default'; // Actualizar el estado de la celda a 'default'

            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            scrollToSection('container_motto'); // Desplazarse a la sección de la tabla

            console.log(arr_events.at(selectedBoxToEdit));
            
            selectedBoxToEdit = null; // Reiniciar la celda seleccionada para evitar ediciones múltiples sin selección
            
        } else {
            console.log("Please select both racers and an event type.");
            edit_box_alert.innerHTML = "Please select both racers and an event type.";
        }
    }

    btn_edit_box_confirm.addEventListener("click", function(e) {
        e.preventDefault()

        sendSelectedData();
    });
}

function teamEventSelectors(event_key) {
    let team = null
    let event = null

    let selectorTeams = new CustomSelector("selector2", teamsData, {
        label: 'Select a team:',
        placeholder: 'Choose a team of your liking',
        onSelectionChange: function(selection) {
            team = selection.text; // Guardar el valor del equipo seleccionado
        }
    });

    let selectorTypesEvents = new CustomSelector("selector3", getArrayTypeEventsObjects(event_key), {
        label: 'Select the type of event:',
        placeholder: 'Choose a type of event of your liking',
        onSelectionChange: function(selection) {
            event = selection.text; // Guardar el valor del evento seleccionado
        }
    });

    btn_edit_box_confirm.addEventListener("click", function(e) {
        e.preventDefault()

        if (selectedBoxToEdit === null) {
            console.log("Please select a box to edit.");
            edit_box_alert.innerHTML = "Please select a box to edit";
            return
        }

        if (team && event) {
            
            edit_box_alert.innerHTML = ""; // Limpiar el mensaje de alerta

            arr_events[selectedBoxToEdit] = team + " " + event // Actualizar el texto de la celda seleccionada
            
            arr_boxes_states[selectedBoxToEdit] = 'default'; // Actualizar el estado de la celda a 'default'

            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            scrollToSection('container_motto'); // Desplazarse a la sección de la tabla

            console.log(arr_events.at(selectedBoxToEdit));

            selectedBoxToEdit = null; // Reiniciar la celda seleccionada para evitar ediciones múltiples sin selección

        } else {
            console.log("Please select a team and an event type.");
            edit_box_alert.innerHTML = "Please select a team and an event type.";
        }
    });
}

function lapOrTurnEventSelector(event_key){
    
    let type = null
    let type_value = null
    let event = null

    let specialTypeData = [
        { value: 'Lap', text: 'Lap' },
        { value: 'Turn', text: 'Turn' }
    ]

    let selectorSpecialType = new CustomSelector("selector2", specialTypeData, {
        label: 'Select LAP or TURN:',
        placeholder: 'Choose LAP or TURN',
        onSelectionChange: function(selection) {
            type = selection.text; // Guardar el valor del corredor seleccionado
            
            let circuit = getNextStage()

            if (selection.value === 'Lap') {
                
                type = "Lap"
                
                let lapData = []

                for (let i = 0; i < circuit.laps; i++) {
                    lapData.push({
                        value: i + 1,
                        text: i + 1
                    });
                }

                let selectorLaps = new CustomSelector("selector3", lapData, {
                    label: 'Select a lap:',
                    placeholder: 'Choose a lap of your liking',
                    onSelectionChange: function(selection) {
                        // Aquí puedes agregar lógica específica para la vuelta seleccionada
                        type_value = selection.text; // Guardar el valor de la vuelta seleccionada
                    }
                });

                let selectorTypesEvents = new CustomSelector("selector4", getArrayTypeEventsObjects(event_key), {
                    label: 'Select the type of event:',
                    placeholder: 'Choose a type of event of your liking',
                    onSelectionChange: function(selection) {
                        event = selection.text; // Guardar el valor del evento seleccionado
                    }
                }); 
            }
            else if (selection.value === 'Turn') {
                
                type = "Turn"
                let turnData = []

                for (let i = 0; i < circuit.turns; i++) {
                    turnData.push({
                        value: i + 1,
                        text: i + 1
                    });
                }

                let selectorTurns = new CustomSelector("selector3", turnData, {
                    label: 'Select a turn:',
                    placeholder: 'Choose a turn of your liking',
                    onSelectionChange: function(selection) {
                        // Aquí puedes agregar lógica específica para la curva seleccionada
                        type_value = selection.text; // Guardar el valor de la curva seleccionada
                    }
                });

                let selectorTypesEvents = new CustomSelector("selector4", getArrayTypeEventsObjects(event_key), {
                    label: 'Select the type of event:',
                    placeholder: 'Choose a type of event of your liking',
                    onSelectionChange: function(selection) {
                        event = selection.text; // Guardar el valor del evento seleccionado
                    }
                });
            }
        
        }
    })

    function sendSelectedData() {
        
        if (selectedBoxToEdit === null) {
            console.log("Please select a box to edit.");
            edit_box_alert.innerHTML = "Please select a box to edit";
            return
        }

        if (type && type_value && event) {
            edit_box_alert.innerHTML = ""; // Limpiar el mensaje de alerta

            arr_events[selectedBoxToEdit] = type + " " + type_value + " " + event // Actualizar el texto de la celda seleccionada
            
            arr_boxes_states[selectedBoxToEdit] = 'default'; // Actualizar el estado de la celda a 'default'

            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            scrollToSection('container_motto'); // Desplazarse a la sección de la tabla

            console.log(arr_events.at(selectedBoxToEdit));

            selectedBoxToEdit = null; // Reiniciar la celda seleccionada para evitar ediciones múltiples sin selección

        } else {
            console.log("Please select a type, a value and an event type.");
            edit_box_alert.innerHTML = "Please select a type, a value and an event type.";
        }
    }

    btn_edit_box_confirm.addEventListener("click", function(e) {
        e.preventDefault()

        sendSelectedData();
    });
}

function amountEventSelector(event_key) {
    let amount = null
    let event = null

    let amountData = []

    for (let i = 0; i < 50; i++) {
        amountData.push({
            value: i + 1,
            text: i + 1
        });
    }

    let selectorAmount = new CustomSelector("selector2", amountData, {
        label: 'Select an amount:',
        placeholder: 'Choose an amount of your liking',
        onSelectionChange: function(selection) {
            amount = selection.text; // Guardar el valor de la cantidad seleccionada
        }
    });

    let selectorTypesEvents = new CustomSelector("selector3", getArrayTypeEventsObjects(event_key), {
        label: 'Select the type of event:',
        placeholder: 'Choose a type of event of your liking',
        onSelectionChange: function(selection) {
            event = selection.text; // Guardar el valor del evento seleccionado
        }
    });

    function sendSelectedData() {
        if (selectedBoxToEdit === null) {
            console.log("Please select a box to edit.");
            edit_box_alert.innerHTML = "Please select a box to edit";
            return
        }


        if (amount && event) {
            
            edit_box_alert.innerHTML = ""; // Limpiar el mensaje de alerta

            arr_events[selectedBoxToEdit] = amount + " " + event // Actualizar el texto de la celda seleccionada
            
            arr_boxes_states[selectedBoxToEdit] = 'default'; // Actualizar el estado de la celda a 'default'

            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            scrollToSection('container_motto'); // Desplazarse a la sección de la tabla

            console.log(arr_events.at(selectedBoxToEdit));

            selectedBoxToEdit = null; // Reiniciar la celda seleccionada para evitar ediciones múltiples sin selección

        } else {
            console.log("Please select an amount and an event type.");
            edit_box_alert.innerHTML = "Please select an amount and an event type.";
        }
    }
    
    btn_edit_box_confirm.addEventListener("click", function(e) {
        e.preventDefault()

        sendSelectedData();
    });
}

function randomEventSelector(event_key) {
    let event = null

    let selectorTypesEvents = new CustomSelector("selector2", getArrayTypeEventsObjects(event_key), {
        label: 'Select the type of event:',
        placeholder: 'Choose a type of event of your liking',
        onSelectionChange: function(selection) {
            event = selection.text; // Guardar el valor del evento seleccionado
        }
    });

    function sendSelectedData() {
        if (selectedBoxToEdit === null) {
            console.log("Please select a box to edit.");
            edit_box_alert.innerHTML = "Please select a box to edit";
            return
        }

        if (event) {
            edit_box_alert.innerHTML = ""; // Limpiar el mensaje de alerta
            
            arr_events[selectedBoxToEdit] = event // Actualizar el texto de la celda seleccionada
            
            // Agregar esto en las otras funciones también
            arr_boxes_states[selectedBoxToEdit] = 'default'; // Actualizar el estado de la celda a 'default'
            
            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            scrollToSection('container_motto'); // Desplazarse a la sección de la tabla

            console.log(arr_events.at(selectedBoxToEdit));

            // Reiniciar la celda seleccionada para evitar ediciones múltiples sin selección
            selectedBoxToEdit = null;

        } else {
            console.log("Please select an event.");
            edit_box_alert.innerHTML = "Please select an event.";
        }
    }

    btn_edit_box_confirm.addEventListener("click", function(e) {
        e.preventDefault()

        sendSelectedData();
    });
}
/* ################# FIN CÓDIGO DEDICADO A SELECTORES ################# */


/* ################# CÓDIGO DEDICADO A BOX CELLS ################# */

function createContainerBox(text,cellId) {
    // Crear el contenedor principal
    const containerBox = document.createElement('div');
    containerBox.className = 'container_box';
    containerBox.setAttribute('data-cell-id', cellId);

    // Crear el área de texto
    const boxTextArea = document.createElement('div');
    boxTextArea.className = 'box_text_area';
    boxTextArea.textContent = text;

    // Crear el área de botones
    const boxBtnsArea = document.createElement('div');
    boxBtnsArea.className = 'box_btns_area';

    // Crear botón Check
    const checkBtnArea = document.createElement('div');
    checkBtnArea.className = 'check_btn_area';
    const btnCheck = document.createElement('input');
    btnCheck.type = 'button';
    btnCheck.className = 'btn';
    btnCheck.id = 'btn_check';
    btnCheck.value = '✓';
    btnCheck.setAttribute('data-state', 'default'); // Estados: default, checked, unchecked

    // Crear botón Delete
    const deleteBtnArea = document.createElement('div');
    deleteBtnArea.className = 'delete_btn_area';
    const btnDelete = document.createElement('input');
    btnDelete.type = 'button';
    btnDelete.className = 'btn';
    btnDelete.id = 'btn_delete';
    btnDelete.value = '🗑';

    // Crear botón Edit
    const editBtnArea = document.createElement('div');
    editBtnArea.className = 'edit_btn_area';
    const btnEdit = document.createElement('input');
    btnEdit.type = 'button';
    btnEdit.className = 'btn';
    btnEdit.id = 'btn_edit';
    btnEdit.value = '🖉';

    // Ensamblar los elementos
    checkBtnArea.appendChild(btnCheck);
    deleteBtnArea.appendChild(btnDelete);
    editBtnArea.appendChild(btnEdit);

    boxBtnsArea.appendChild(checkBtnArea);
    boxBtnsArea.appendChild(deleteBtnArea);
    boxBtnsArea.appendChild(editBtnArea);

    containerBox.appendChild(boxTextArea);
    containerBox.appendChild(boxBtnsArea);

    // Agregar event listeners
    setupEventListenersForBoxBtns(
        cellId,
        containerBox.querySelector('#btn_check'),
        containerBox.querySelector('#btn_delete'),
        containerBox.querySelector('#btn_edit'),
        containerBox.querySelector('.box_text_area'))

    return containerBox;
}

function setupEventListenersForBoxBtns(
    cellId,
    btnCheck,
    btnDelete,
    btnEdit,
    textArea) {
    

    // Funcionalidad del botón Check
    btnCheck.addEventListener('click', function() {
        const currentState = this.getAttribute('data-state');
        
        if (currentState === 'default') {
            
            if (this.className === "mobile_btn_box"){
                this.value = 'Uncheck box'; // Cambiar el valor del botón a "Uncheck box"
            }
            else{
                this.value = '☓'
            }

            
            this.setAttribute('data-state', 'checked')

            let selectedBox = document.getElementById("cell"+cellId);
            selectedBox.style.backgroundColor = webp_colours["checked"];
            arr_boxes_states[cellId] = 'checked'; // Actualizar el estado de la celda

            console.log("Setting state to checked after default...")

            
            let bingo = checkForBingo(); // Verificar si se ha hecho bingo
            if (bingo) {
                document.getElementById("tab_main_matrix_title").style.display = "none"
                document.getElementById("bingo_message").style.display = "grid"; // Mostrar mensaje de bingo
                
                scrollToSection('container_motto'); // Desplazarse a la sección de la tabla
            }
        }
        else if (currentState === 'checked') {
            
            if (this.className === "mobile_btn_box"){
                this.value = 'Check box'; // Cambiar el valor del botón a "Check box"
            }
            else{
                this.value = '✓'
            }

            this.setAttribute('data-state', 'unchecked')

            let selectedBox = document.getElementById("cell"+cellId);
            selectedBox.setAttribute('data_state', 'unchecked');
            selectedBox.style.backgroundColor = webp_colours["unchecked"];
            arr_boxes_states[cellId] = 'unchecked'; // Actualizar el estado de la celda

            console.log("Setting state to unchecked after checked...")

            if (cellId === selectedBoxToEdit) {
                let selectedCell = document.getElementById("cell"+selectedBoxToEdit);
                selectedCell.style.backgroundColor = webp_colours["selected"]
            }
        }
        else if (currentState === 'unchecked') {
            
            if (this.className === "mobile_btn_box"){
                this.value = 'Uncheck box'; // Cambiar el valor del botón a "Check box"
            }
            else{
                this.value = '☓'
            }

            
            this.setAttribute('data-state', 'checked')

            let selectedBox = document.getElementById("cell"+cellId);
            selectedBox.setAttribute('data_state', 'checked');
            selectedBox.style.backgroundColor = webp_colours["checked"];
            arr_boxes_states[cellId] = 'checked'; // Actualizar el estado de la celda

            console.log("Setting state to checked after unchecked...")

            let bingo = checkForBingo(); // Verificar si se ha hecho bingo
            if (bingo) {
                document.getElementById("tab_main_matrix_title").style.display = "none"
                document.getElementById("bingo_message").style.display = "grid"; // Mostrar mensaje de bingo
                
                scrollToSection('container_motto'); // Desplazarse a la sección de la tabla
            }
        }

        const container_mobile_box_btns = document.getElementById("container_mobile_box_btns");
        container_mobile_box_btns.style.display = "none"; // Ocultar el contenedor de botones móviles
    });

    // Funcionalidad del botón Delete
    btnDelete.addEventListener('click', function() {
        
        arr_events[cellId] = "Fill this cell with your prediction!"; // Limpiar el texto de la celda seleccionada

        textArea.textContent = "Fill this cell with your prediction!";
        btnCheck.disabled = true;
        btnCheck.style.opacity = '0.5';
        //parentCell.className = 'default';
        
        if (this.className === "mobile_btn_box"){
            btnCheck.value = 'Check box'; // Cambiar el valor del botón a "Delete box"
        }
        else{
            btnCheck.value = '✓';
        }

        
        btnCheck.setAttribute('data-state', 'default');

        let selectedBox = document.getElementById("cell"+cellId);
        selectedBox.setAttribute('data_state', 'empty');
        selectedBox.style.backgroundColor = webp_colours["empty"];
        arr_boxes_states[cellId] = 'empty'; // Actualizar el estado de la celda   
        
        const container_mobile_box_btns = document.getElementById("container_mobile_box_btns");
        container_mobile_box_btns.style.display = "none"; // Ocultar el contenedor de botones móviles
    
    });

    // Funcionalidad del botón Edit
    btnEdit.addEventListener('click', function() {
        
        document.getElementById("container_edit_box").style.display = "grid";

        selectedBoxToEdit = cellId;

        let selectedBox = document.getElementById("cell"+selectedBoxToEdit);
        
        recolorBoxes(); // Recolorear las celdas antes de resaltar la seleccionada

        // Resaltar la celda seleccionada
        selectedBox.style.border = '3px solid '+webp_colours["cell_border_selected"];
        selectedBox.style.backgroundColor = webp_colours["selected"]; // Cambiar el color de fondo para resaltar
        selectedBox.style.transition = 'background-color 0.3s ease'; // Añadir transición suave

    
        scrollToSection('container_edit_box'); // Desplazarse a la sección de edición

        edit_box_alert.innerHTML = ""; // Limpiar el mensaje de alerta
    
        const container_mobile_box_btns = document.getElementById("container_mobile_box_btns");
        container_mobile_box_btns.style.display = "none"; // Ocultar el contenedor de botones móviles

    });
}
/* ################# FIN CÓDIGO DEDICADO A BOX CELLS ################# */


/* ################# CÓDIGO DEDICADO A BLOCK GRID BTN ################# */
let btn_block_matrix_input = document.getElementById("btn_block_matrix_input");

btn_block_matrix_input.addEventListener("click", function() {
    let status = btn_block_matrix_input.getAttribute("status");

    if (status === "not-blocked") {
        
        blocked_grid = true; // Marcar la cuadrícula como bloqueada

        btn_block_matrix_input.setAttribute("status", "blocked");
        btn_block_matrix_input.value = "Unblock grid";
        btn_block_matrix_input.style.backgroundColor = "#FFB116"; // Cambiar el color del botón a naranja
        btn_block_matrix_input.style.color = "#000"; // Cambiar el

        btn_block_matrix_input.innerHTML = "Unblock grid"; // Cambiar el texto del botón

        // Deshabilitar todos los botones de edicion de las celdas
        let all_btn_edit = document.querySelectorAll("#btn_edit");
        all_btn_edit.forEach(btn => {
            btn.disabled = true; // Deshabilitar los botones de edición
            btn.style.opacity = '0.5'; // Cambiar la opacidad para indicar que están deshabilitados
        });

        // Deshabilitar todos los botones de eliminar de las celdas
        let all_btn_delete = document.querySelectorAll("#btn_delete");
        all_btn_delete.forEach(btn => {
            btn.disabled = true; // Deshabilitar los botones de eliminación
            btn.style.opacity = '0.5'; // Cambiar la opacidad para indicar que están deshabilitados
        });

        // Ocultar el contenedor de edición
        document.getElementById("container_edit_box").style.display = "none"; // Ocultar el contenedor de edición
        
        // Recolorear las celdas
        recolorBoxes()

        document.getElementById("btn_reload").disabled = true; // Deshabilitar el botón de recarga
        document.getElementById("btn_to_custom_grill").disabled = true; // Deshabilitar el botón de ir a la parrilla personalizada
        document.getElementById("btn_to_custom_grill").style.opacity = '0.5'; // Cambiar la opacidad del botón de ir a la parrilla personalizada

        document.getElementById("mobile_btn_delete").disabled = true; // Deshabilitar el botón de eliminar en la vista móvil
        document.getElementById("mobile_btn_delete").style.opacity = '0.5'; // Cambiar la opacidad del botón de eliminar en la vista móvil

        document.getElementById("mobile_btn_edit").disabled = true; // Deshabilitar el botón de editar en la vista móvil
        document.getElementById("mobile_btn_edit").style.opacity = '0.5'; // Cambiar la opacidad del botón de editar en la vista móvil

        document.getElementById("custom_grid_nav_btn").disabled = true; // Deshabilitar el botón de navegación a la parrilla personalizada
        document.getElementById("custom_grid_nav_btn").style.opacity = '0.5'; // Cambiar la opacidad del botón de navegación a la parrilla personalizada

        console.log("Grid blocked");
    } else if (status === "blocked") {
        
        blocked_grid = false; // Marcar la cuadrícula como desbloqueada

        btn_block_matrix_input.setAttribute("status", "not-blocked");
        btn_block_matrix_input.value = "Block grid";
        btn_block_matrix_input.style.backgroundColor = webp_colours["checked"];
        btn_block_matrix_input.style.color = "#fff"; // Cambiar el color del texto a blanco

        // Habilitar todos los botones de edicion de las celdas
        let all_btn_edit = document.querySelectorAll("#btn_edit");
        all_btn_edit.forEach(btn => {
            btn.disabled = false; // Habilitar los botones de edición
            btn.style.opacity = '1'; // Restaurar la opacidad
        });

        // Habilitar todos los botones de eliminar de las celdas
        let all_btn_delete = document.querySelectorAll("#btn_delete");
        all_btn_delete.forEach(btn => {
            btn.disabled = false; // Habilitar los botones de eliminación
            btn.style.opacity = '1'; // Restaurar la opacidad
        });

        document.getElementById("btn_reload").disabled = false; // Habilitar el botón de recarga
        document.getElementById("btn_to_custom_grill").disabled = false; // Deshabilitar el botón de ir a la parrilla personalizada
        document.getElementById("btn_to_custom_grill").style.opacity = '1'; // Cambiar la opacidad del botón de ir a la parrilla personalizada

        document.getElementById("mobile_btn_delete").disabled = false; // Habilitar el botón de eliminar en la vista móvil
        document.getElementById("mobile_btn_delete").style.opacity = '1'; // Restaurar la opacidad del botón de eliminar en la vista móvil
        
        document.getElementById("mobile_btn_edit").disabled = false; // Habilitar el botón de editar en la vista móvil
        document.getElementById("mobile_btn_edit").style.opacity = '1'; // Restaurar la opacidad del botón de editar en la vista móvil

        document.getElementById("custom_grid_nav_btn").disabled = false; // Habilitar el botón de navegación a la parrilla personalizada
        document.getElementById("custom_grid_nav_btn").style.opacity = '1'; // Restaurar la opacidad del botón de navegación a la parrilla personalizada

        console.log("Grid unblocked");
    }

    scrollToSection('container_motto'); // Desplazarse a la sección de la tabla
});
/* ################# FIN CÓDIGO DEDICADO A BLOCK GRID BTN ################# */


/* ################# CÓDIGO DEDICADO A BOTÓN DE NAVEGACIÓN DEL HEADER #################*/
function updateHeaderNavigation() {
// Elementos del DOM
    const header_nav_btn = document.getElementById('header_nav_btn');
    const dropdown_menu = document.getElementById('dropdownMenu');
    const dropdown_items = document.querySelectorAll('.dropdown-item');

    // Variable para controlar el estado del menú
    let isMenuOpen = false;

    // Función para alternar el menú
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            openMenu();
        } else {
            closeMenu();
        }
    }

    // Función para abrir el menú
    function openMenu() {
        dropdown_menu.classList.add('show');
        header_nav_btn.classList.add('active');
        isMenuOpen = true;
    }

    // Función para cerrar el menú
    function closeMenu() {
        dropdown_menu.classList.remove('show');
        header_nav_btn.classList.remove('active');
        isMenuOpen = false;
    }

    // Event listener para el botón hamburguesa
    header_nav_btn.addEventListener('click', toggleMenu);

    // Event listeners para los elementos del menú
    dropdown_items.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            // Aquí puedes agregar tu lógica personalizada para cada botón
            switch(action) {
                case 'grid':
                    // Tu código para perfil aquí
                    console.log('grid');

                    const seccion1 = document.getElementById('container_motto');
                    seccion1.scrollIntoView({ 
                        behavior: 'smooth' // Desplazamiento suave
                    });

                    break;
                case 'custom-grid':
                    // Tu código para configuración aquí
                    console.log('custom-grid');
                    
                    document.getElementById("container_edit_box").style.display = "grid";

                    const seccion2 = document.getElementById('container_edit_box');
                    seccion2.scrollIntoView({ 
                        behavior: 'smooth' // Desplazamiento suave
                    });

                    break;
                case 'circuit':
                    // Tu código para cerrar sesión aquí
                    console.log('circuit');

                    const seccion3 = document.getElementById('container_circuit');
                    seccion3.scrollIntoView({ 
                        behavior: 'smooth' // Desplazamiento suave
                    });

                    break;
                case 'help':
                    
                    const seccion4 = document.getElementById('container_help');
                    seccion4.scrollIntoView({ 
                        behavior: 'smooth' // Desplazamiento suave
                    });

                    break;
            }
            
            // Cerrar el menú después de hacer clic
            closeMenu();
        });
    });

    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        if (isMenuOpen && 
            !header_nav_btn.contains(event.target) && 
            !dropdown_menu.contains(event.target)) {
            closeMenu();
        }
    });

    // Cerrar menú con la tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
}
/* ################# FIN CÓDIGO DEDICADO A BOTÓN DE NAVEGACIÓN DEL HEADER ################# */