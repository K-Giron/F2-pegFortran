import Visitor from "./Visitor.js";
import { Rango } from "./Cst.js";
import { generateCaracteres } from "./utils.js";

export default class Tokenizer extends Visitor {
  generateTokenizer(grammar) {
    //console.log("G",grammar.map(produccion => produccion.accept(this)));
    return `
module tokenizer
implicit none

contains
function upcase(s) result(upper)
    character(len=*), intent(in) :: s
    character(len=len(s)) :: upper
    integer :: i

    ! Convertir la cadena a mayúsculas
    do i = 1, len(s)
        upper(i:i) = char(iachar(s(i:i)) - iachar('a') + iachar('A'))  ! Convertir a mayúscula
        if (iachar(s(i:i)) < iachar('a') .or. iachar(s(i:i)) > iachar('z')) then
            upper(i:i) = s(i:i)  ! Si no es una letra minúscula, dejarla igual
        end if
    end do
end function upcase

function nextSym(input, cursor) result(lexeme)
    character(len=*), intent(in) :: input
    integer, intent(inout) :: cursor
    character(len=:), allocatable :: lexeme  ! Se usa para longitud variable

    ! Verificar si el cursor está fuera del rango
    if (cursor > len(input)) then
        lexeme = "EOF"  ! Devolver "EOF" si se llega al final de la cadena
        return
    end if

    ${grammar
      .map((produccion) => produccion.accept(this))
      .flat()
      .filter((result) => result !== undefined)
      .join("\n")}
    
    ! Si no se encuentra un token válido, devolver un error léxico
    print *, "Error léxico en la columna: ", cursor, ', "', input(cursor:), '"'
    lexeme = "ERROR"  ! Devuelve "ERROR" si no se encuentra un token válido
end function nextSym
end module tokenizer
        `;
  }
  visitProducciones(node) {
    return node.expr.accept(this);
  }
  visitOpciones(node) {
    //console.log("Esta es una opcion",node)
    if (node.exprs.length <= 1) {
      return node.exprs[0].accept(this);
    } else {
      //regla = "Hola"i "Mundo"
      return node.exprs.map((expr) => expr.accept(this));
    }
    //return node.exprs[0].accept(this);
  }
  visitUnion(node) {
    if (node.exprs.length <= 1) {
      return node.exprs[0].accept(this);
    } else {
      const results = node.exprs.map((expr) => expr.accept(this));
      //console.log("Union\n",results.join('\n'))
      // Generamos el código Fortran para la concatenación
      return `
if (cursor + ${node.exprs
        .map((expr) => expr.expr.val.length - 1)
        .join(" + ")} <= len(input)) then
    ${results.join("\n")}
end if`;
      //regla = "Hola"i "Mundo"
      return node.exprs.map((expr) => expr.accept(this));
      // Aquí almacenamos los resultados de cada expresión
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
    !return
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
    !return
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
if (input(i:i) >= "${node.bottom}" .and. input(i:i) <= "${node.top}") then
    lexeme = input(cursor:i)
    cursor = i + 1
    return
end if
    `;
  }
}
