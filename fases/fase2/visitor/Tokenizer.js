import Visitor from "./Visitor.js";
import { Rango } from "./Cst.js";
import { generateCaracteres } from "./utils.js";

export default class Tokenizer extends Visitor {
  constructor() {
    super();
    this.isCursorInitialized = false; // Control para evitar múltiples `i = cursor`
  }

  visitProducciones(node) {
    return node.expr.accept(this);
  }

  visitOpciones(node) {
    if (node.exprs.length <= 1) {
      return node.exprs[0].accept(this);
    } else {
      const conditions = node.exprs.map((expr, index) => {
        const condition = expr.accept(this).replace(/\s*end if\s*$/, "");
        if (index === 0) {
          return condition;
        } else {
          return `else ${condition.trim()}`;
        }
      });

      return `
${conditions.join("\n")}

end if`;
    }
  }

  visitUnion(node) {
    if (node.exprs.length <= 1) {
      return node.exprs[0].accept(this);
    } else {
      const results = node.exprs.map((expr) => expr.accept(this));
      return `${results.join("\n")}`;
    }
  }

  visitExpresion(node) {
    return node.expr.accept(this);
  }

  visitString(node) {
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
    let initialization = "";
    if (!this.isCursorInitialized) {
      initialization = "i = cursor\n";
      this.isCursorInitialized = true; // Asegurar que `i = cursor` solo se genera una vez
    }

    return `
${initialization}${generateCaracteres(
      node.chars.filter((node) => typeof node === "string")
    )}
${node.chars
  .filter((node) => node instanceof Rango)
  .map((range) => range.accept(this))
  .join("\n")}`;
  }

  visitRango(node) {
    return `
if (i<= len(input) .and. input(i:i) >= "${node.bottom}" .and. input(i:i) <= "${node.top}") then
    lexeme = input(i:i)
    cursor = i + 1
    return
end if`;
  }
}
