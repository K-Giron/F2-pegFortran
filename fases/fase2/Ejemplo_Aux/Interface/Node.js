// Este archivo podría estar como 'Node.js' o el nombre que desees.

// Si estás usando módulos en JavaScript (por ejemplo, con Node.js o en un entorno moderno que soporte ES6)
const Visitor = require('./Visitor');  // Asegúrate de que el módulo 'Visitor' esté disponible

// En lugar de una interfaz, podrías usar una clase base o simplemente un objeto con un método.
// Aquí está una versión con una clase base Node:
class Node {
    // El método 'accept' puede ser una función normal que recibe un 'visitor' y lo pasa al método adecuado
    accept(visitor) {
        throw new Error("Método 'accept' debe ser implementado");
    }
}

module.exports = Node;