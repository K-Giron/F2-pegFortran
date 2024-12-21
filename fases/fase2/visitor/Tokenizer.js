import Visitor from './Visitor.js'

export default class Tokenizer extends Visitor{
    generateTokenizer(grammar){
        const resultado = grammar
    .map(produccion => produccion.accept(this).trim()) // Aplica trim() a cada cadena
    .filter(result => result !== undefined && result !== '') // Filtra valores undefined o vacíos
    .join('\n'); // Une las cadenas con un salto de línea

console.log(resultado);
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

    ${grammar.map(produccion => produccion.accept(this)).filter(result => result !== undefined).join('\n')}
    
    ! Si no se encuentra un token válido, devolver un error léxico
    print *, "Error léxico en la columna: ", cursor, ', "', input(cursor:), '"'
    lexeme = "ERROR"  ! Devuelve "ERROR" si no se encuentra un token válido
end function nextSym
end module tokenizer
        `;
    }
    visitProducciones(node){
        return node.expr.accept(this);
    }
	visitOpciones(node){
        //console.log("Esta es una opcion",node)
        return node.exprs[0].accept(this);
    }
	visitUnion(node){
        //console.log(node.exprs.length);
        if(node.exprs.length <= 1){
            //console.log("Este es una Union:",node.exprs);
            return node.exprs[0].accept(this);
        }else{
            //console.log("Este es una Union:",node.exprs);
            //regla = "Hola"i "Mundo"
            return node.exprs.map(expr => expr.accept(this));
            //return node.exprs.join().accept(this);
        }
    }
	visitExpresion(node){
        //console.log("Esta es una expresion",node)
        return node.expr.accept(this);
    }
	visitString(node){
        //console.log("Este es un String:",node)
        if(node.isCase == null){
            return `
if (cursor + ${node.val.length -1} <= len(input) .and. input(cursor:cursor + ${node.val.length -1}) == "${node.val}") then
    lexeme = input(cursor:cursor + ${node.val.length -1})
    cursor = cursor + ${node.val.length}
    return
end if
                `;
        }else{
            return `
if (cursor + ${node.val.length -1} <= len(input) .and. upcase(input(cursor:cursor + ${node.val.length -1})) == "${node.val.toUpperCase()}") then
    lexeme = input(cursor:cursor + ${node.val.length -1})
    cursor = cursor + ${node.val.length}
    return
end if
                `;
        }
    }
}