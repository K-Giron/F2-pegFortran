import Visitor from './Visitor.js'

export default class Tokenizer extends Visitor{
    generateTokenizer(grammar){
        return `
module tokenizer
implicit none

contains
function nextSym(input, cursor) result(lexem)
    character(len=*), intent(in) :: input
    interger, intent(inout) :: cursor
    character(len=:), allocatable :: lexeme

    if (cursor > len(input)) then
        allowcate(character(len=3) :: lexeme)
        lexeme = "EOF"
        return
    end if

    ${grammar.map(produccion => produccion.accept(this)).join('\n')}
    
    print *, "Error lexico en la col: ",cursor,',"'//input(cursor:cursor)//'"'
    lexeme = "ERROR"
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
        if ("${node.val}" == input(cursor:cursor + ${node.val.length -1})) then !Foo
            allowcate(character(len=3) :: lexeme)
            lexeme = input(cursor:cursor + ${node.val.length -1})
            cursor = cursor + ${node.val.length}
            return
        end if
        `;
    }
}