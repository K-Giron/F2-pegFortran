import Visitor from "./Visitor.js";
import { Rango } from "./Cst.js";
import { generateCaracteres } from "./utils.js";

export default class Tokenizer extends Visitor {
  visitProducciones(node) {
    return node.expr.accept(this);
  }
  visitOpciones(node) {
    // Verificar si solo hay una opción
    if (node.exprs.length <= 1) {
      return node.exprs[0].accept(this);
    } else {
      // Generar las condiciones combinadas con if-else
      const conditions = node.exprs.map((expr, index) => {
        const condition = expr.accept(this).replace(/\s*end if\s*$/, ""); // Eliminar `end if` de los nodos
        if (index === 0) {
          return condition; // El primer caso es un `if`
        } else {
          return `else ${condition.trim()}`; // Los casos posteriores son `else if`
        }
      });

      // Unir todas las condiciones en un único bloque con un solo cierre `end if`
      return `
  ${conditions.join("\n")}
else
    print *, "No se encontraron coincidencias en col ", cursor, ', "'//input(cursor:cursor)//'"'
    lexeme = "NO MATCH"
    cursor = cursor + 1
    return
end if`;
    }
  }
  visitUnion(node) {
    if (node.exprs.length <= 1) {
      return node.exprs[0].accept(this);
    } else {
      const results = node.exprs.map((expr) => expr.accept(this));
      //console.log("Union\n",results.join('\n'))
      // Generamos el código Fortran para la concatenación
      return `${results.join("\n")}`;
      //       return `
      // if (cursor + ${node.exprs
      //         .map((expr) => expr.expr.val.length - 1)
      //         .join(" + ")} <= len(input)) then
      //     ${results.join("\n")}
      // end if`;
      //       //regla = "Hola"i "Mundo"
      //       return node.exprs.map((expr) => expr.accept(this));
      //       // Aquí almacenamos los resultados de cada expresión
    }
  }
  visitExpresion(node) {
    //console.log("Esta es una expresion",node)
    return node.expr.accept(this);
  }
  visitString(node) {
    //console.log("Este es un String:",node)
    if (node.isCase == null) {
      return `
if (cursor + ${node.val.length - 1} <= len(input) .and. input(cursor:cursor + ${
        node.val.length - 1
      }) == "${node.val}") then
    lexeme = "String " // input(cursor:cursor + ${node.val.length - 1})
    cursor = cursor + ${node.val.length}
    return
end if`;
    } else {
      return `
if (cursor + ${
        node.val.length - 1
      } <= len(input) .and. upcase(input(cursor:cursor + ${
        node.val.length - 1
      })) == "${node.val.toUpperCase()}") then
    lexeme = "String " // input(cursor:cursor + ${node.val.length - 1})
    cursor = cursor + ${node.val.length}
    return
end if`;
    }
  }
  visitIdentificador(node) {
    return;
  }

  visitClase(node) {
    return `
i = cursor
${generateCaracteres(node.chars.filter((node) => typeof node === "string"))}
${node.chars
  .filter((node) => node instanceof Rango)
  .map((range) => range.accept(this))
  .join("\n")}
    `;
  }
  visitRango(node) {
    return `
if (i<= len(input) .and. input(i:i) >= "${node.bottom}" .and. input(i:i) <= "${node.top}") then
    lexeme = input(i:i)
    cursor = i + 1
    return
end if
    `;
  }
}
