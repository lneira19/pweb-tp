/* IMPORTACIÓN DE INFORMACIÓN CONTENIDO EN ARCHIVOS .JSON */

import dataJSON from "../static/data.json" with { type: "json" }
import eventsJSON from "../static/events.json" with { type: "json" }

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

console.log(getArrayObjectsKeyEvents())