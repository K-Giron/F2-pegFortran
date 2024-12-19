import Visitor from './Visitor.js'

export default class Tokenizer extends Visitor{
    generateTokenizer(grammar){
        return `
module tokenizer
implicit none

contains
function nextSym(input, cursor) result(lexeme)
    character(len=*), intent(in) :: input
    integer, intent(inout) :: cursor
    character(len=:), allocatable :: lexeme  ! Se usa para longitud variable

    ! Verificar si el cursor está fuera del rango
    if (cursor > len(input)) then
        lexeme = "EOF"  ! Devolver "EOF" si se llega al final de la cadena
        return
    end if

    ${grammar.map(produccion => produccion.accept(this)).join('\n')}
    
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
        return node.exprs[0].accept(this);
    }
	visitUnion(node){
        return node.exprs[0].accept(this);
    }
	visitExpresion(node){
        return node.expr.accept(this);
    }
	visitString(node){
        return `
    if (cursor + ${node.val.length -1} <= len(input) .and. input(cursor:cursor + ${node.val.length -1}) == "${node.val}") then
        lexeme = input(cursor:cursor + ${node.val.length -1})
        cursor = cursor + ${node.val.length}
        return
    end if
        `;
    }
}