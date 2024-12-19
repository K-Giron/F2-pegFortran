const mustache = require('mustache');
// Aquí requerimos los módulos sin tipo, usando `require` en vez de `import type`
const n = require('../interface/CST');  // Suponiendo que $lib/CST es un módulo de JavaScript
const Node = require('../interface/Node');  // Requiere el Node (si es una clase o estructura en JS)
const Visitor = require('../interface/Visitor');  // Requiere el Visitor (si es una clase o estructura en JS)

class TokenizerVisitor {
    generateTokenizer(grammar) {
        const template = `
module tokenizer
    implicit none

    contains
    function nextSym(input, cursor) result(lexeme)
        character(len=*), intent(in) :: input
        integer, intent(inout) :: cursor
        character(len=:), allocatable :: lexeme
        {{#rules}}
        {{.}}
        {{/rules}}
        print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
    end function nextSym
end module tokenizer
        `;

        // 'grammar' ya es un array de nodos en JS, por lo que ya no necesitamos los tipos
        return mustache.render(template, {
            rules: grammar.map((rule) => rule.accept(this)),
        });
    }

    visitRule(node) {
        return node.expression.accept(this);
    }
    
    visitChoice(node) {
        return node.expressions.map((expr) => expr.accept(this)).join('\n');
    }
    
    visitConcatenation(node) {
        return node.expressions.map((expr) => expr.accept(this)).join('\n');
    }

    visitPluck(node) {
        return node.expression.accept(this);
    }
    
    visitLabel(node) {
        return node.expression.accept(this);
    }

    visitExpression(node) {
        return node.expression.accept(this);
    }

    visitParsingExpression(node) {
        return node.expression.accept(this);
    }

    visitQuantifier(node) {
        throw new Error('Method not implemented.');
    }

    visitGroup(node) {
        throw new Error('Method not implemented.');
    }

    visitString(node) {
        const template = `
        if ( "{{val}}" == input(cursor:cursor + {{offset}} )) then
            allocate( character(len={{length}}) :: lexeme)
            lexeme = input(cursor:cursor + {{offset}})
            cursor = cursor + {{length}}
            return
        end if
        `;

        return mustache.render(template, {
            val: node.value,
            offset: node.value.length - 1,
            length: node.value.length,
        });
    }

    visitRange(node) {
        throw new Error('Method not implemented.');
    }

    visitInputRange(node) {
        throw new Error('Method not implemented.');
    }

    visitIdentifier(node) {
        throw new Error('Method not implemented.');
    }

    visitNumber(node) {
        throw new Error('Method not implemented.');
    }
}

module.exports = TokenizerVisitor;
