
// Auto-generated
import type Node from './Interfaces/Node';
import type Visitor from './Interfaces/Visitor';

export class Rule implements Node {
    id
	expression
	alias /* opcional */

    constructor(id, expression, alias /* opcional */) {
        this.id = id;
		this.expression = expression;
		this.alias = alias;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitRule(this);
    }
}
    
export class Choice implements Node {
    expressions

    constructor(expressions) {
        this.expressions = expressions;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitChoice(this);
    }
}
    
export class Concatenation implements Node {
    expressions

    constructor(expressions) {
        this.expressions = expressions;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitConcatenation(this);
    }
}
    
export class Pluck implements Node {
    expression
	pluck /* opcional */

    constructor(expression, pluck /* opcional */) {
        this.expression = expression;
		this.pluck = pluck;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitPluck(this);
    }
}
    
export class Label implements Node {
    expression
	identifier /* opcional */

    constructor(expression, identifier /* opcional */) {
        this.expression = expression;
		this.identifier = identifier;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitLabel(this);
    }
}
    
export class Expression implements Node {
    expression
	quantifier /* opcional */
	text /* opcional */

    constructor(expression, quantifier /* opcional */, text /* opcional */) {
        this.expression = expression;
		this.quantifier = quantifier;
		this.text = text;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitExpression(this);
    }
}
    
export class Quantifier implements Node {
    value

    constructor(value) {
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitQuantifier(this);
    }
}
    
export class ParsingExpression implements Node {
    expression

    constructor(expression) {
        this.expression = expression;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitParsingExpression(this);
    }
}
    
export class Group implements Node {
    expression

    constructor(expression) {
        this.expression = expression;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitGroup(this);
    }
}
    
export class String implements Node {
    value

    constructor(value) {
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitString(this);
    }
}
    
export class Range implements Node {
    characters

    constructor(characters) {
        this.characters = characters;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitRange(this);
    }
}
    
export class InputRange implements Node {
    value

    constructor(value) {
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitInputRange(this);
    }
}
    
export class Identifier implements Node {
    value

    constructor(value) {
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitIdentifier(this);
    }
}
    
export class Number implements Node {
    value

    constructor(value) {
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitNumber(this);
    }
}
    