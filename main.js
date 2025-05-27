/* IMPORTACIÓN DE FUNCIONES */

import {getCollectionOfRandomEvents} from "./backend/randomevents.js"
import {CustomSelector} from "./backend/selector.js"
import {getArrayObjectsKeyEvents, getArrayRacersObjects, getArrayTeamsObjects, getArrayTypeEventsObjects} from "./backend/staticdata.js"
import { getNextStage } from "./backend/staticdata.js"

console.log(getCollectionOfRandomEvents(5*5))

/* VARIABLES DEL DOCUMENTO */
let tab_main_matrix = document.getElementById("tab_main_matrix")
let btn_reload = document.getElementById("btn_reload")

let arr_events = getCollectionOfRandomEvents(5 * 5)



/* FUNCIONES DOCUMENT */
function updateTabMainMatrix(rows, cols) {
    
    //let arr_random_events = getCollectionOfRandomEvents(rows * cols)
    
    tab_main_matrix.innerHTML = ""; // Limpiar la tabla antes de llenarla
    
    // Crear la tabla con el número de filas y columnas especificado
    for (let i = 0; i < rows; i++) {
        
        const row = document.createElement("tr");
        
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("td");

            const containerBox = createContainerBox(arr_events.at(i * cols + j), "td", i * cols + j)
            cell.appendChild(containerBox); // Agregar el container_box a la celda

            //cell.textContent = arr_events.at(i * cols + j);
            row.appendChild(cell);
        }
        
        tab_main_matrix.appendChild(row);
    }
}

/* MAIN */
updateTabMainMatrix(5, 5) // Inicializar la tabla con 5 filas y 5 columnas

btn_reload.addEventListener("click", function(event) {
    arr_events = getCollectionOfRandomEvents(5 * 5)

    event.preventDefault(); // Prevenir el comportamiento por defecto del botón
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
            btn_edit_box_confirm.textContent = "Confirm Selection";
            edit_box_confirm_btn_area.appendChild(btn_edit_box_confirm);

            console.log('Event selected:', selection);
            console.log(getArrayTypeEventsObjects(selection.value));

            selector2.innerHTML = ""; // Limpiar el selector2 antes de llenarlo
            selector3.innerHTML = ""; // Limpiar el selector3 antes de llenarlo
            selector4.innerHTML = ""; // Limpiar el selector4 antes de llenarlo
            selector5.innerHTML = ""; // Limpiar el selector5 antes de llenarlo

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

        if (racer && event) {
            
            if (event === "P" && position === "") {
                console.log("Please select a position for the racer.");
                return;
            }
            else{
                //btn_edit_box_confirm.removeEventListener("click", sendSelectedData); // Eliminar el evento anterior para evitar duplicados
                console.log(racer+" "+event+position)
                arr_events[selectedCellForEdit] = racer+" "+event+position; // Actualizar el texto de la celda seleccionada
                updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

                const seccion = document.getElementById('table_container');
                seccion.scrollIntoView({ 
                    behavior: 'smooth' // Desplazamiento suave
                });
            }
        }
        else {
            console.log("Please select a racer and an event type.")
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
        if (racer1 && event && racer2) {
            console.log(racer1 + " " + event + " " + racer2);
            
            arr_events[selectedCellForEdit] = racer1 + " " + event + " " + racer2; // Actualizar el texto de la celda seleccionada
            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            const seccion = document.getElementById('table_container');
            seccion.scrollIntoView({ 
                behavior: 'smooth' // Desplazamiento suave
            });

        } else {
            console.log("Please select both racers and an event type.");
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

        if (team && event) {
            console.log(team + " " + event);

            arr_events[selectedCellForEdit] = team + " " + event // Actualizar el texto de la celda seleccionada
            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            const seccion = document.getElementById('table_container');
            seccion.scrollIntoView({ 
                behavior: 'smooth' // Desplazamiento suave
            });

        } else {
            console.log("Please select a team and an event type.");
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
        if (type && type_value && event) {
            console.log(type + " " + type_value + " " + event);

            arr_events[selectedCellForEdit] = type + " " + type_value + " " + event // Actualizar el texto de la celda seleccionada
            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            const seccion = document.getElementById('table_container');
            seccion.scrollIntoView({ 
                behavior: 'smooth' // Desplazamiento suave
            });

        } else {
            console.log("Please select a type, a value and an event type.");
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
        if (amount && event) {
            console.log(amount + " " + event);

            arr_events[selectedCellForEdit] = amount + " " + event // Actualizar el texto de la celda seleccionada
            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            const seccion = document.getElementById('table_container');
            seccion.scrollIntoView({ 
                behavior: 'smooth' // Desplazamiento suave
            });

        } else {
            console.log("Please select an amount and an event type.");
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
        if (event) {
            console.log(event);
            arr_events[selectedCellForEdit] = event // Actualizar el texto de la celda seleccionada
            updateTabMainMatrix(5, 5); // Actualizar la tabla para reflejar el cambio

            const seccion = document.getElementById('table_container');
            seccion.scrollIntoView({ 
                behavior: 'smooth' // Desplazamiento suave
            });
        } else {
            console.log("Please select an event.");
        }
    }

    btn_edit_box_confirm.addEventListener("click", function(e) {
        e.preventDefault()

        sendSelectedData();
    });
}

/* ################# FIN CÓDIGO DEDICADO A SELECTORES ################# */

/* ################# CÓDIGO DEDICADO BOX CELLS ################# */
let selectedCellForEdit = null;

// Contador para IDs únicos
let cellCounter = 0;

/* 
 * Función principal para crear una celda con container_box
 * @param {string} text - El texto principal a mostrar en la celda
 * @returns {HTMLElement} - El elemento container_box creado
 */

function createContainerBox(text,type_of_parent,cellId) {
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
    btnDelete.value = 'D';

    // Crear botón Edit
    const editBtnArea = document.createElement('div');
    editBtnArea.className = 'edit_btn_area';
    const btnEdit = document.createElement('input');
    btnEdit.type = 'button';
    btnEdit.className = 'btn';
    btnEdit.id = 'btn_edit';
    btnEdit.value = 'E';

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
    setupEventListeners(containerBox, cellId, type_of_parent);

    // OJO, CAMBIAR EL TIPO DE PARENT CELL!!! CUANDO TERMINE DE ANDAR ESTO!!
    // const parentCell = containerBox.closest('div');

    return containerBox;
}

/* 
 * Configura los event listeners para los botones del container
 * @param {HTMLElement} container - El contenedor box
 * @param {number} cellId - ID único de la celda
 */
function setupEventListeners(container, cellId, type_of_parent) {
    const btnCheck = container.querySelector('#btn_check');
    const btnDelete = container.querySelector('#btn_delete');
    const btnEdit = container.querySelector('#btn_edit');
    const textArea = container.querySelector('.box_text_area');
    const parentCell = container.closest("div");

    // Funcionalidad del botón Check
    btnCheck.addEventListener('click', function() {
        const currentState = this.getAttribute('data-state');
        
        if (currentState === 'default') {
            this.value = 'X'
            this.setAttribute('data-state', 'checked')
            //parentCell.className = 'checked'
            console.log("Setting state to checked after default...")
        }
        else if (currentState === 'checked') {
            this.value = '✓'
            this.setAttribute('data-state', 'unchecked')
            //parentCell.className = 'unchecked'
            console.log("Setting state to unchecked after checked...")
        }
        else if (currentState === 'unchecked') {
            this.value = 'X'
            this.setAttribute('data-state', 'checked')
            //parentCell.className = 'checked'
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
    });

    // Funcionalidad del botón Edit
    btnEdit.addEventListener('click', function() {
        
        selectedCellForEdit = cellId;

        // Destacar visualmente la celda seleccionada
        // document.querySelectorAll('td').forEach(cell => {
        //      cell.style.border = '2px solid #ddd';
        // });
        
        console.log(`Selected cell for edit: ${cellId}`);
        parentCell.style.border = '3px solid #FF9800';

        const seccion = document.getElementById('container_edit_box');
        seccion.scrollIntoView({ 
            behavior: 'smooth' // Desplazamiento suave
        });
    });
}
