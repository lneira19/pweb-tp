export function getRandomInt(min, max) {
    // El máximo es exclusivo y el mínimo es inclusivo
    
    let randint = Math.floor(Math.random()* (max - min)) + min;
    return randint
}