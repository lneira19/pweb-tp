/* IMPORTACIÓN DE INFORMACIÓN CONTENIDO EN ARCHIVOS .JSON */

import dataJSON from "../static/data.json" with { type: "json" }
import eventsJSON from "../static/events.json" with { type: "json" }

// Función para obtener la siguiente etapa de la competencia

export function getNextStage(){
    // Esta función obtiene la siguiente etapa de la competencia
    // La etapa se obtiene a partir de la fecha de inicio y la fecha de fin
    // La fecha de fin es 4 días después de la fecha de inicio

    let obj_stages = dataJSON["stages"]

    let arr_enddates = obj_stages.map((stage) => 
        Date.parse(stage["startdate"]) + 4*24*60*60*1000
    )

    let arr_diff_dates = arr_enddates.map((enddate) => {
        
        let diff = enddate - Date.now()
        
        if (diff < 0){
            diff = 0
        }

        return diff
    })

    let stage_index = arr_diff_dates.findIndex((diff) => diff > 0)

    let obj_next_stage = obj_stages.at(stage_index)

    return obj_next_stage
}

// FUNCIONES PARA OBTENER EL ARRAY DE OBJETOS PARA LOS SELECTORES

// Array de objetos de tipos de eventos
export function getArrayObjectsKeyEvents() {
    
    let eventKeys = Object.keys(eventsJSON);

    let arrayObjectsKeyEvents = [];
    for (const key of eventKeys) {
        arrayObjectsKeyEvents.push({
            value: key,
            text: key.slice(0, 1).toUpperCase() + key.slice(1).replace(/-/g, " ")
        });
    }

    return arrayObjectsKeyEvents;
}

// Array de objetos de corredores
export function getArrayRacersObjects() {
    let racers = dataJSON["racers"]

    let arrayObjectsRacers = [];
    for (const racer of racers) {
        arrayObjectsRacers.push({
            value: racer.id,
            text: racer.name +" "+ racer.lastname
        });
    }

    return arrayObjectsRacers;
}

// Array de objetos de equipos
export function getArrayTeamsObjects() {
    let teams = dataJSON["teams"]

    let arrayObjectsTeams = [];
    for (const team of teams) {
        arrayObjectsTeams.push({
            value: team.id,
            text: team.name
        });
    }

    return arrayObjectsTeams;
}

// Array de objetos de eventos
export function getArrayTypeEventsObjects(event_key) {
    let events = eventsJSON[event_key];

    let arrayObjectsEvents = [];
    for (const event of events) {
        arrayObjectsEvents.push({
            value: event.id,
            text: event.event
        });
    }

    return arrayObjectsEvents;
}
