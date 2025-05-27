/* IMPORTACIÓN DE FUNCIONES */

import {getCollectionOfRandomEvents} from "./backend/randomevents.js"
import {CustomSelector} from "./backend/selector.js"
import {getArrayObjectsKeyEvents, getArrayRacersObjects, getArrayTeamsObjects, getArrayTypeEventsObjects} from "./backend/staticdata.js"
import { getNextStage } from "./backend/staticdata.js"

console.log(getCollectionOfRandomEvents(5*5))

/* VARIABLES BACKEND */

// Array para almacenar los textos de las celdas junto a inicialización
let arr_events = getCollectionOfRandomEvents(5 * 5)

// Array para almacenar los estados de las celdas
let arr_cells_states = [] 
// Inicializar el array de estados de las celdas
function getDefaultCellState() {
    for (let i = 0; i < 5 * 5; i++) {
        arr_cells_states.push('default') // Estado inicial de cada celda);
    }
}
getDefaultCellState()

/* VARIABLES DEL DOCUMENTO */
let tab_main_matrix = document.getElementById("tab_main_matrix")
let btn_reload = document.getElementById("btn_reload")

let webp_colours = {
    
    'cell_border': "#202020",
    'cell_border_selected': "#ECC26F",
    
    'checked': '#FF1F1F',
    'unchecked': '#26394f',
    'default': '#26394f',
    'empty': "#5388BE",
    'selected': "#E5AC38",
    
    'edit_box': "#5388be",
    'footer': "#14141c",

};

/* FUNCIONES DOCUMENT */
function recolorCells() {
    // Poner el borde original de las celdas a las demás
    let allCells = document.querySelectorAll("td");
    
    let i = 0
    allCells.forEach(cell => {
        cell.style.border = '2px solid' + webp_colours["cell_border"]; // Borde original
        
        let cellState = arr_cells_states.at(i); // Obtener el estado de la celda

        if (cellState === 'checked') {
            cell.style.backgroundColor = webp_colours["checked"]; // Cambiar el borde a verde
        }
        else if (cellState === 'unchecked') {
            cell.style.backgroundColor = webp_colours["unchecked"]; // Cambiar el borde a rojo
        }
        else if (cellState === 'default') {
            cell.style.backgroundColor = webp_colours["default"]; // Cambiar el borde a gris
        }
        else if (cellState === 'empty') {
            cell.style.backgroundColor = webp_colours["empty"]; // Cambiar el borde a azul
        }
        
        i++;  
    });
}

function updateTabMainMatrix(rows, cols) {
    
    //let arr_random_events = getCollectionOfRandomEvents(rows * cols)
    
    tab_main_matrix.innerHTML = ""; // Limpiar la tabla antes de llenarla
    
    // Crear la tabla con el número de filas y columnas especificado
    for (let i = 0; i < rows; i++) {
        
        const row = document.createElement("tr");
        
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("td");
            cell.id = "cell" + (i * cols + j); // Asignar un ID único a cada celda

            const containerBox = createContainerBox(arr_events.at(i * cols + j), i * cols + j)
            cell.appendChild(containerBox); // Agregar el container_box a la celda

            //cell.textContent = arr_events.at(i * cols + j);
            row.appendChild(cell);
        }
        
        tab_main_matrix.appendChild(row);
    }

    recolorCells(); // Recolorear las celdas después de crear la tabla
}

/* MAIN */
updateTabMainMatrix(5, 5) // Inicializar la tabla con 5 filas y 5 columnas

btn_reload.addEventListener("click", function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del botón
    
    arr_events = getCollectionOfRandomEvents(5 * 5)
    
    arr_cells_states = []; // Reiniciar el array de estados de las celdas
    getDefaultCellState(); // Reiniciar los estados de las celdas
    console.log(arr_cells_states)
    // Actualizar la tabla con nuevos valores aleatorios
    updateTabMainMatrix(5, 5);
});

/* ################# CÓDIGO DEDICADO A SELECTORES ################# */

// Datos para los selectores
const eventsData = getArrayObjectsKeyEvents()
const racersData = getArrayRacersObjects()
const teamsData = getArrayTeamsObjects()

// Variables globales para los selectores
let selectorEvents

let selector1 = document.getElementById("selector1");
let selector2 = document.getElementById("selector2");
let selector3 = document.getElementById("selector3");
let selector4 = document.getElementById("selector4");
let selector5 = document.getElementById("selector5");

let edit_box_confirm_btn_area = document.getElementById("edit_box_confirm_btn_area")
let edit_box_alert = document.getElementById("edit_box_alert")

// Inicializar selectores cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Crear selector de tecnologías
    
    selectorEvents = new CustomSelector('selector1', eventsData, {
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

            console.log('Event selected:', selection);
            console.log(getArrayTypeEventsObjects(selection.value));

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
                default:
                    console.log('Default event selected');
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
            console.log('Racer selected:', selection);
            racer = selection.text; // Guardar el valor del corredor seleccionado
        }
    })

    let selectorTypesEvents = new CustomSelector("selector3", getArrayTypeEventsObjects(event_key), {
        
        label: 'Select the type of event:',
        placeholder: 'Choose a type of event of your liking',
        onSelectionChange: function(selection) {
            
            selector5.innerHTML = ""
            position = "" // Reiniciar la posición al seleccionar un nuevo evento

            console.log('Type of event selected:', selection);
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
                        console.log('Position selected:', selection);
                        position = selection.text; // Guardar el valor de la posición seleccionada
                    }
                });
            }
        }
    });

    function sendSelectedData() {

        if (selectedCellForEdit === null) {
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

                console.log(racer+" "+event+position)
                arr_events[selectedCellForEdit] = racer+" "+event+position; // Actualizar el texto de la celda seleccionada
                
                arr_cells_states[selectedCellForEdit] = 'default'; // Actualizar el estado de la celda a 'default'

                updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

                const seccion = document.getElementById('table_container');
                seccion.scrollIntoView({ 
                    behavior: 'smooth' // Desplazamiento suave
                });

                selectedCellForEdit = null; // Reiniciar la celda seleccionada para evitar ediciones múltiples sin selección
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
            console.log('Racer selected:', selection);
            racer1 = selection.text; // Guardar el valor del primer corredor seleccionado
        }
    });

    let selectorTypesEvents = new CustomSelector("selector3", getArrayTypeEventsObjects(event_key), {
        label: 'Select the type of event:',
        placeholder: 'Choose a type of event of your liking',
        onSelectionChange: function(selection) {
            console.log('Type of event selected:', selection);
            event = selection.text; // Guardar el valor del evento seleccionado
        }
    });

    let selectorRacers2 = new CustomSelector("selector4", racersData, {
        label: 'Select the second racer:',
        placeholder: 'Choose a racer of your liking',
        onSelectionChange: function(selection) {
            console.log('Racer selected:', selection);
            racer2 = selection.text; // Guardar el valor del segundo corredor seleccionado
        }
    });


    function sendSelectedData() {
        if (selectedCellForEdit === null) {
            console.log("Please select a box to edit.");
            edit_box_alert.innerHTML = "Please select a box to edit";
            return
        }


        if (racer1 && event && racer2) {
            edit_box_alert.innerHTML = ""; // Limpiar el mensaje de alerta

            console.log(racer1 + " " + event + " " + racer2);
            
            arr_events[selectedCellForEdit] = racer1 + " " + event + " " + racer2; // Actualizar el texto de la celda seleccionada
            
            arr_cells_states[selectedCellForEdit] = 'default'; // Actualizar el estado de la celda a 'default'

            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            const seccion = document.getElementById('table_container');
            seccion.scrollIntoView({ 
                behavior: 'smooth' // Desplazamiento suave
            });

            selectedCellForEdit = null; // Reiniciar la celda seleccionada para evitar ediciones múltiples sin selección

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
            console.log('Team selected:', selection);
            team = selection.text; // Guardar el valor del equipo seleccionado
        }
    });

    let selectorTypesEvents = new CustomSelector("selector3", getArrayTypeEventsObjects(event_key), {
        label: 'Select the type of event:',
        placeholder: 'Choose a type of event of your liking',
        onSelectionChange: function(selection) {
            console.log('Type of event selected:', selection);
            event = selection.text; // Guardar el valor del evento seleccionado
        }
    });

    btn_edit_box_confirm.addEventListener("click", function(e) {
        e.preventDefault()

        if (selectedCellForEdit === null) {
            console.log("Please select a box to edit.");
            edit_box_alert.innerHTML = "Please select a box to edit";
            return
        }

        if (team && event) {
            
            edit_box_alert.innerHTML = ""; // Limpiar el mensaje de alerta

            console.log(team + " " + event);

            arr_events[selectedCellForEdit] = team + " " + event // Actualizar el texto de la celda seleccionada
            
            arr_cells_states[selectedCellForEdit] = 'default'; // Actualizar el estado de la celda a 'default'

            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            const seccion = document.getElementById('table_container');
            seccion.scrollIntoView({ 
                behavior: 'smooth' // Desplazamiento suave
            });

            selectedCellForEdit = null; // Reiniciar la celda seleccionada para evitar ediciones múltiples sin selección

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
            console.log('Selected:', selection);
            type = selection.text; // Guardar el valor del corredor seleccionado
            
            let circuit = getNextStage()
            console.log("Circuit selected:", circuit);

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
                        console.log('Lap selected:', selection);
                        // Aquí puedes agregar lógica específica para la vuelta seleccionada
                        type_value = selection.text; // Guardar el valor de la vuelta seleccionada
                    }
                });

                let selectorTypesEvents = new CustomSelector("selector4", getArrayTypeEventsObjects(event_key), {
                    label: 'Select the type of event:',
                    placeholder: 'Choose a type of event of your liking',
                    onSelectionChange: function(selection) {
                        console.log('Type of event selected:', selection);
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
                        console.log('Turn selected:', selection);
                        // Aquí puedes agregar lógica específica para la curva seleccionada
                        type_value = selection.text; // Guardar el valor de la curva seleccionada
                    }
                });

                let selectorTypesEvents = new CustomSelector("selector4", getArrayTypeEventsObjects(event_key), {
                    label: 'Select the type of event:',
                    placeholder: 'Choose a type of event of your liking',
                    onSelectionChange: function(selection) {
                        console.log('Type of event selected:', selection);
                        event = selection.text; // Guardar el valor del evento seleccionado
                    }
                });
            }
        
        }
    })

    function sendSelectedData() {
        
        if (selectedCellForEdit === null) {
            console.log("Please select a box to edit.");
            edit_box_alert.innerHTML = "Please select a box to edit";
            return
        }

        if (type && type_value && event) {
            edit_box_alert.innerHTML = ""; // Limpiar el mensaje de alerta

            console.log(type + " " + type_value + " " + event);

            arr_events[selectedCellForEdit] = type + " " + type_value + " " + event // Actualizar el texto de la celda seleccionada
            
            arr_cells_states[selectedCellForEdit] = 'default'; // Actualizar el estado de la celda a 'default'

            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            const seccion = document.getElementById('table_container');
            seccion.scrollIntoView({ 
                behavior: 'smooth' // Desplazamiento suave
            });

            selectedCellForEdit = null; // Reiniciar la celda seleccionada para evitar ediciones múltiples sin selección

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
            console.log('Amount selected:', selection);
            amount = selection.text; // Guardar el valor de la cantidad seleccionada
        }
    });

    let selectorTypesEvents = new CustomSelector("selector3", getArrayTypeEventsObjects(event_key), {
        label: 'Select the type of event:',
        placeholder: 'Choose a type of event of your liking',
        onSelectionChange: function(selection) {
            console.log('Type of event selected:', selection);
            event = selection.text; // Guardar el valor del evento seleccionado
        }
    });

    function sendSelectedData() {
        if (selectedCellForEdit === null) {
            console.log("Please select a box to edit.");
            edit_box_alert.innerHTML = "Please select a box to edit";
            return
        }


        if (amount && event) {
            
            edit_box_alert.innerHTML = ""; // Limpiar el mensaje de alerta

            console.log(amount + " " + event);

            arr_events[selectedCellForEdit] = amount + " " + event // Actualizar el texto de la celda seleccionada
            
            arr_cells_states[selectedCellForEdit] = 'default'; // Actualizar el estado de la celda a 'default'

            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            const seccion = document.getElementById('table_container');
            seccion.scrollIntoView({ 
                behavior: 'smooth' // Desplazamiento suave
            });

            selectedCellForEdit = null; // Reiniciar la celda seleccionada para evitar ediciones múltiples sin selección

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
            console.log('Type of event selected:', selection);
            event = selection.text; // Guardar el valor del evento seleccionado
        }
    });

    function sendSelectedData() {
        if (selectedCellForEdit === null) {
            console.log("Please select a box to edit.");
            edit_box_alert.innerHTML = "Please select a box to edit";
            return
        }

        if (event) {
            edit_box_alert.innerHTML = ""; // Limpiar el mensaje de alerta

            console.log(event);
            
            arr_events[selectedCellForEdit] = event // Actualizar el texto de la celda seleccionada
            
            // Agregar esto en las otras funciones también
            arr_cells_states[selectedCellForEdit] = 'default'; // Actualizar el estado de la celda a 'default'
            
            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            const seccion = document.getElementById('table_container');
            seccion.scrollIntoView({ 
                behavior: 'smooth' // Desplazamiento suave
            });
        } else {
            console.log("Please select an event.");
            edit_box_alert.innerHTML = "Please select an event.";
        }

        selectedCellForEdit = null; // Reiniciar la celda seleccionada para evitar ediciones múltiples sin selección
    }

    btn_edit_box_confirm.addEventListener("click", function(e) {
        e.preventDefault()

        sendSelectedData();
    });
}

/* ################# FIN CÓDIGO DEDICADO A SELECTORES ################# */

/* ################# CÓDIGO DEDICADO A BOX CELLS ################# */
let selectedCellForEdit = null;

/* 
 * Función principal para crear una celda con container_box
 * @param {string} text - El texto principal a mostrar en la celda
 * @returns {HTMLElement} - El elemento container_box creado
 */

function createContainerBox(text,cellId) {
    // cellCounter++;
    // const cellId = cellCounter;

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
    setupEventListeners(containerBox, cellId);

    return containerBox;
}

/* 
 * Configura los event listeners para los botones del container
 * @param {HTMLElement} container - El contenedor box
 * @param {number} cellId - ID único de la celda
 */
function setupEventListeners(container, cellId) {
    const btnCheck = container.querySelector('#btn_check');
    const btnDelete = container.querySelector('#btn_delete');
    const btnEdit = container.querySelector('#btn_edit');
    const textArea = container.querySelector('.box_text_area');

    // Funcionalidad del botón Check
    btnCheck.addEventListener('click', function() {
        const currentState = this.getAttribute('data-state');
        
        if (currentState === 'default') {
            this.value = '☓'
            this.setAttribute('data-state', 'checked')

            let selectedCell = document.getElementById("cell"+cellId);
            selectedCell.style.backgroundColor = webp_colours["checked"]; // Cambiar el borde a verde
            arr_cells_states[cellId] = 'checked'; // Actualizar el estado de la celda

            console.log("Setting state to checked after default...")
        }
        else if (currentState === 'checked') {
            this.value = '✓'
            this.setAttribute('data-state', 'unchecked')

            let selectedCell = document.getElementById("cell"+cellId);
            selectedCell.setAttribute('data_state', 'unchecked');
            selectedCell.style.backgroundColor = webp_colours["unchecked"]; // Cambiar el borde a rojo
            arr_cells_states[cellId] = 'unchecked'; // Actualizar el estado de la celda

            console.log("Setting state to unchecked after checked...")

            if (cellId === selectedCellForEdit) {
                let selectedCell = document.getElementById("cell"+selectedCellForEdit);
                selectedCell.style.backgroundColor = webp_colours["selected"]
            }
        }
        else if (currentState === 'unchecked') {
            this.value = '☓'
            this.setAttribute('data-state', 'checked')

            let selectedCell = document.getElementById("cell"+cellId);
            selectedCell.setAttribute('data_state', 'checked');
            selectedCell.style.backgroundColor = webp_colours["checked"];
            arr_cells_states[cellId] = 'checked'; // Actualizar el estado de la celda

            console.log("Setting state to checked after unchecked...")
        }
    });

    // Funcionalidad del botón Delete
    btnDelete.addEventListener('click', function() {
        textArea.textContent = "Fill this cell with your prediction!";
        btnCheck.disabled = true;
        btnCheck.style.opacity = '0.5';
        //parentCell.className = 'default';
        btnCheck.value = '✓';
        btnCheck.setAttribute('data-state', 'default');

        let selectedCell = document.getElementById("cell"+cellId);
        selectedCell.setAttribute('data_state', 'empty');
        selectedCell.style.backgroundColor = webp_colours["empty"];
        arr_cells_states[cellId] = 'empty'; // Actualizar el estado de la celda   
    });

    // Funcionalidad del botón Edit
    btnEdit.addEventListener('click', function() {
        
        document.getElementById("container_edit_box").style.display = "grid";

        selectedCellForEdit = cellId;

        let selectedCell = document.getElementById("cell"+selectedCellForEdit);
        console.log("Selected cell:", selectedCell);
        
        
        recolorCells(); // Recolorear las celdas antes de resaltar la seleccionada

        // Resaltar la celda seleccionada
        selectedCell.style.border = '3px solid '+webp_colours["cell_border_selected"];
        selectedCell.style.backgroundColor = webp_colours["selected"]; // Cambiar el color de fondo para resaltar
        selectedCell.style.transition = 'background-color 0.3s ease'; // Añadir transición suave

    
        const seccion = document.getElementById('container_edit_box');
        seccion.scrollIntoView({ 
            behavior: 'smooth' // Desplazamiento suave
        });

        edit_box_alert.innerHTML = ""; // Limpiar el mensaje de alerta
    });
}
/* ################# FIN CÓDIGO DEDICADO A BOX CELLS ################# */

/* ################# CÓDIGO DEDICADO A EDIT BOX CLOSE BTN ################# */

let btn_close_edit_box = document.getElementById("btn_close_edit_box");

btn_close_edit_box.addEventListener("click", function() {
    document.getElementById("container_edit_box").style.display = "none"; // Ocultar el contenedor de edición

    recolorCells()
    
    const seccion = document.getElementById('table_container');
    seccion.scrollIntoView({ 
        behavior: 'smooth' // Desplazamiento suave
    });
});

/* ################# FIN CÓDIGO DEDICADO A EDIT BOX CLOSE BTN ################# */

/* ################# CÓDIGO DEDICADO A BLOCK GRID BTN ################# */
let btn_block_matrix_input = document.getElementById("btn_block_matrix_input");


btn_block_matrix_input.addEventListener("click", function() {
    let status = btn_block_matrix_input.getAttribute("status");

    if (status === "not-blocked") {
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
        recolorCells()

        document.getElementById("btn_reload").disabled = true; // Deshabilitar el botón de recarga

        console.log("Grid blocked");
    } else if (status === "blocked") {
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

        console.log("Grid unblocked");
    }

    const seccion = document.getElementById('table_container');
    seccion.scrollIntoView({ 
        behavior: 'smooth' // Desplazamiento suave
    });
});

/* ################# FIN CÓDIGO DEDICADO A BLOCK GRID BTN ################# */


/*  ################# CÓDIGO DEDICADO A SECTION BTNS #################*/
let btn_to_grill = document.getElementById("btn_to_grill");
let btn_to_custom_grill = document.getElementById("btn_to_custom_grill");
let btn_to_circuit = document.getElementById("btn_to_circuit");

btn_to_grill.addEventListener("click", function() {
    
    const seccion = document.getElementById('table_container');
    seccion.scrollIntoView({ 
        behavior: 'smooth' // Desplazamiento suave
    });
})

btn_to_custom_grill.addEventListener("click", function() {
    
    document.getElementById("container_edit_box").style.display = "grid";

    const seccion = document.getElementById('container_edit_box');
    seccion.scrollIntoView({ 
        behavior: 'smooth' // Desplazamiento suave
    });
})

btn_to_circuit.addEventListener("click", function() {
    
    const seccion = document.getElementById('container_circuit');
    seccion.scrollIntoView({ 
        behavior: 'smooth' // Desplazamiento suave
    });
    }
)

/* CÓDIGO DEDICADO A SECCIÓN CIRCUITO */
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

updateCircuitSection();