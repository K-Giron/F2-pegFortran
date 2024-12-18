// Generar clases para CST
// Este archivo genera las clases necesarias para implementar el patrón visitante con Typescript

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import nodes from './Nodes.js';

const __dirname = import.meta.dirname;
const classesDestination = '../Interface/CST.js';
const visitorDestination = '../Interface/Visitor.js';

let codeString = `
// Auto-generated
// Asegúrate de que el módulo 'Node' esté disponible en tu entorno
const Node = require('./Node');

// Declaración de la interfaz Visitor eliminada, ya que JavaScript no tiene interfaces.
`;

// Generamos los métodos visit para cada nodo
for (const node of Object.keys(nodes)) {
    codeString += `\tvisit${node}(node) {\n`;
    codeString += `\t\t// Lógica para visitar un ${node}\n`;
    codeString += `\t}\n`;
}

writeFileSync(path.join(__dirname, visitorDestination), codeString);
console.log('Generated visitor in JavaScript');

function printArgs(args, separator) {
    const argKeys = Object.keys(args);
    return argKeys
        .map((arg) => {
            const parts = args[arg].split('?');
            return parts.length > 1
                ? `${arg} /* opcional */` // En JS no necesitas tipado
                : `${arg}`; // Solo el nombre del argumento
        })
        .join(separator);
}

codeString = `
// Auto-generated
const Node = require('./Interface/Node');
const Visitor = require('./Interface/Visitor');
`;

for (const [name, args] of Object.entries(nodes)) {
    const argKeys = Object.keys(args);
    codeString += `
class ${name} {
    ${printArgs(args, '\n\t')}

    constructor(${printArgs(args, ', ')}) {
        ${argKeys.map((arg) => `this.${arg} = ${arg};`).join('\n\t\t')}
    }

    accept(visitor) {
        return visitor.visit${name}(this);
    }
}

module.exports.${name} = ${name};
    `;
    console.log(`Generating ${name} node`);
}

writeFileSync(path.join(__dirname, classesDestination), codeString);
console.log('Done!');