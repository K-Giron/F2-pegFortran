
// Auto-generated
const Node = require('./Interface/Node');
const Visitor = require('./Interface/Visitor');

class Rule {
    id
	expression
	alias /* opcional */

    constructor(id, expression, alias /* opcional */) {
        this.id = id;
		this.expression = expression;
		this.alias = alias;
    }

    accept(visitor) {
        return visitor.visitRule(this);
    }
}

module.exports.Rule = Rule;
    
class Choice {
    expressions

    constructor(expressions) {
        this.expressions = expressions;
    }

    accept(visitor) {
        return visitor.visitChoice(this);
    }
}

module.exports.Choice = Choice;
    
class Concatenation {
    expressions

    constructor(expressions) {
        this.expressions = expressions;
    }

    accept(visitor) {
        return visitor.visitConcatenation(this);
    }
}

module.exports.Concatenation = Concatenation;
    
class Pluck {
    expression
	pluck /* opcional */

    constructor(expression, pluck /* opcional */) {
        this.expression = expression;
		this.pluck = pluck;
    }

    accept(visitor) {
        return visitor.visitPluck(this);
    }
}

module.exports.Pluck = Pluck;
    
class Label {
    expression
	identifier /* opcional */

    constructor(expression, identifier /* opcional */) {
        this.expression = expression;
		this.identifier = identifier;
    }

    accept(visitor) {
        return visitor.visitLabel(this);
    }
}

module.exports.Label = Label;
    
class Expression {
    expression
	quantifier /* opcional */
	text /* opcional */

    constructor(expression, quantifier /* opcional */, text /* opcional */) {
        this.expression = expression;
		this.quantifier = quantifier;
		this.text = text;
    }

    accept(visitor) {
        return visitor.visitExpression(this);
    }
}

module.exports.Expression = Expression;
    
class Quantifier {
    value

    constructor(value) {
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitQuantifier(this);
    }
}

module.exports.Quantifier = Quantifier;
    
class ParsingExpression {
    expression

    constructor(expression) {
        this.expression = expression;
    }

    accept(visitor) {
        return visitor.visitParsingExpression(this);
    }
}

module.exports.ParsingExpression = ParsingExpression;
    
class Group {
    expression

    constructor(expression) {
        this.expression = expression;
    }

    accept(visitor) {
        return visitor.visitGroup(this);
    }
}

module.exports.Group = Group;
    
class String {
    value

    constructor(value) {
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitString(this);
    }
}

module.exports.String = String;
    
class Range {
    characters

    constructor(characters) {
        this.characters = characters;
    }

    accept(visitor) {
        return visitor.visitRange(this);
    }
}

module.exports.Range = Range;
    
class InputRange {
    value

    constructor(value) {
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitInputRange(this);
    }
}

module.exports.InputRange = InputRange;
    
class Identifier {
    value

    constructor(value) {
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitIdentifier(this);
    }
}

module.exports.Identifier = Identifier;
    
class Number {
    value

    constructor(value) {
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitNumber(this);
    }
}

module.exports.Number = Number;
    