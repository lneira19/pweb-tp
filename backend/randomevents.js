/* IMPORTACIÓN DE INFORMACIÓN CONTENIDO EN ARCHIVOS .JSON */

import dataJSON from "../static/data.json" with { type: "json" }
import eventsJSON from "../static/events.json" with { type: "json" }


/* IMPORTACNIÓN DE FUNCIONES EXTERNAS */

import { getRandomInt } from "./myutils.js"
import { getNextStage } from "./staticdata.js"


/* FUNCIONES PARA CONSTRUIR STRING PARA CADA EVENTO ESPECÍFCO*/

function constructorRandomRacerEvent(){
    // Esta función construye un bloque de evento de corredor aleatorio
    // El bloque contiene un corredor y un evento

    let obj_racer = dataJSON["racers"].at(getRandomInt(0, dataJSON["racers"].length))
    let obj_event = eventsJSON["racer-event"].at(getRandomInt(0, eventsJSON["racer-event"].length))
    
    // Obtengo los valores almacenados en cada objeto particular
    let racer_name = obj_racer["name"]+" "+obj_racer["lastname"]
    let event_description = obj_event["event"]

    if (obj_event["id"] == 6){
        let position = getRandomInt(2, 21)
        return racer_name+" "+event_description+position
    }
    else{
        return racer_name+" "+event_description
    }
}

function constructorRandomRacerEventRacer(){

    let racer1_id = getRandomInt(0, dataJSON["racers"].length)
    let racer2_id = 0
    
    while (true){
        racer2_id = getRandomInt(0, dataJSON["racers"].length)
        if (racer1_id !== racer2_id){
            break
        }
    }

    let obj_racer1 = dataJSON["racers"].at(racer1_id)
    let obj_racer2 = dataJSON["racers"].at(racer2_id)
    let obj_event = eventsJSON["racer-event-racer"].at(getRandomInt(0, eventsJSON["racer-event-racer"].length))

    // Obtengo los valores almacenados en cada objeto particular
    let racer1_name = obj_racer1["name"]+" "+obj_racer1["lastname"]
    let racer2_name = obj_racer2["name"]+" "+obj_racer2["lastname"]
    let event_description = obj_event["event"]

    return racer1_name+" "+event_description+" "+racer2_name
}

function constructorRandomTeamEvent(){
    // Esta función construye un bloque de evento de equipo aleatorio

    let obj_team = dataJSON["teams"].at(getRandomInt(0, dataJSON["teams"].length))
    let obj_event = eventsJSON["team-event"].at(getRandomInt(0, eventsJSON["team-event"].length))

    // Obtengo los valores almacenados en cada objeto particular
    let team_name = obj_team["name"]
    let event_description = obj_event["event"]

    return team_name+" "+event_description
}

function constructorRandomLapEvent(){
    // Esta función construye un bloque de evento de vuelta aleatorio

    let obj_next_stage = getNextStage()
    let obj_event = eventsJSON["lap-or-turn-event"].at(getRandomInt(0, eventsJSON["lap-or-turn-event"].length))

    // Obtengo los valores almacenados en cada objeto particular
    let stage_laps = obj_next_stage["laps"]
    let event_description = obj_event["event"]

    // Se determina un número aleatorio de vuelta
    let lap_number = getRandomInt(1, stage_laps+1)
    
    return "Lap "+lap_number+" "+event_description
}

function constructorRandomLapTurn(){
    // Esta función construye un bloque de evento de curva aleatorio

    let obj_next_stage = getNextStage()
    let obj_event = eventsJSON["lap-or-turn-event"].at(getRandomInt(0, eventsJSON["lap-or-turn-event"].length))

    // Obtengo los valores almacenados en cada objeto particular
    let stage_turns = obj_next_stage["turns"]
    let event_description = obj_event["event"]

    // Se determina un número aleatorio de vuelta
    let turn_number = getRandomInt(1, stage_turns+1)
    
    return "Turn "+turn_number+" "+event_description
}

function constructorAmountEvent(){
    // Esta función construye un bloque de evento de cantidad aleatorio

    let obj_event = eventsJSON["amount-event"].at(getRandomInt(0, eventsJSON["amount-event"].length))

    // Obtengo los valores almacenados en cada objeto particular
    let event_id = obj_event["id"]
    let event_description = obj_event["event"]
    
    switch (event_id) {
        case 0:
            let amount1 = getRandomInt(1, 6)
            return amount1+" "+event_description
        case 1:
            let amount2 = getRandomInt(1, 4)
            return amount2+" "+event_description
        case 2:
            let amount3 = getRandomInt(1, 4)
            return amount3+" "+event_description
        case 3:
            let amount4 = getRandomInt(1, 30)
            return "+"+amount4+" "+event_description
    }
}

function constructorRandomRandomEvent(){
    // Esta función construye un bloque de evento aleatorio
    // El bloque contiene un evento aleatorio

    let obj_event = eventsJSON["random-event"].at(getRandomInt(0, eventsJSON["random-event"].length))

    // Obtengo los valores almacenados en cada objeto particular
    let event_description = obj_event["event"]

    return event_description
}

/* FUNCIÓN PARA CONSTUIR UN EVENTO ALEATORIO */
function randomEventGenerator(){
    // Esta función construye un bloque de evento aleatorio
    // El bloque contiene un evento aleatorio

    let event_id = getRandomInt(0, 7)

    switch (event_id) {
        case 0:
            return constructorRandomRacerEvent()
        case 1:
            return constructorRandomRacerEventRacer()
        case 2:
            return constructorRandomTeamEvent()
        case 3:
            return constructorRandomLapEvent()
        case 4:
            return constructorRandomLapTurn()
        case 5:
            return constructorAmountEvent()
        case 6:
            return constructorRandomRandomEvent()
    }
}
/* FUNCIÓN PARA GENERAR UNA COLECCIÓN DE EVENTOS ALEATORIOS */
export function getCollectionOfRandomEvents(n){
    // Esta función construye una colección de eventos aleatorios
    // La colección contiene n eventos aleatorios

    let arr_random_events = []

    for (let i = 0; i < n; i++){
        arr_random_events.push(randomEventGenerator())
    }

    return arr_random_events
}
