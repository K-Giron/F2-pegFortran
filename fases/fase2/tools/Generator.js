// Generar clases para CST
// Este archivo genera las clases necesarias para implementar el patrón visitante 

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import nodes from './Nodes.js';

const __dirname = import.meta.dirname;
const classesDestination = '../visitor/Cst.js';
const visitorDestination = '../visitor/Visitor.js';

let codeString = `
// Auto-generated

export default class Visitor {

`;
for (const node of Object.keys(nodes)) {
    codeString += `\tvisit${node}(node){}\n`;
}
codeString += `}`;

writeFileSync(path.join(__dirname, visitorDestination), codeString);
console.log('Generated visitor Interface');

function printArgs(args, separator) {
    const argKeys = Object.keys(args);
    return argKeys
        .map((arg) => {
            const parts = args[arg].split('?');
            return parts.length > 1
                ? `${arg}?: ${parts[1]}`
                : `${arg}: ${parts[0]}`;
        })
        .join(separator);
}

codeString = `
// Auto-generated
import Node from "./Node.js";
`;
for (const [name, args] of Object.entries(nodes)) {
    codeString += `
export class ${name} extends Node {
    constructor(${args.join(', ')}) {
        super();
        ${args.map((arg) => `this.${arg} = ${arg};`).join('\n\t\t')}
    }

    accept(visitor){
        return visitor.visit${name}(this);
    }
}
    `;
    console.log(`Generating ${name} node`);
}

writeFileSync(path.join(__dirname, classesDestination), codeString);
console.log('Done!');