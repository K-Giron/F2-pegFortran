{{
    
    // let identificadores = []

    // import { identificadores } from '../index.js'

    import { ids, usos} from '../index.js'
    import { ErrorReglas } from './error.js';
    import { errores } from '../index.js'
    import * as n from '../../fase2/visitor/Cst.js'
}}

gramatica = _ prods:producciones+ _ {

    let duplicados = ids.filter((item, index) => ids.indexOf(item) !== index);
    if (duplicados.length > 0) {
        errores.push(new ErrorReglas("Regla duplicada: " + duplicados[0]));
    }

    // Validar que todos los usos están en ids
    let noEncontrados = usos.filter(item => !ids.includes(item));
    if (noEncontrados.length > 0) {
        errores.push(new ErrorReglas("Regla no encontrada: " + noEncontrados[0]));
    }
    
    return prods;
}

producciones = _ id:identificador _ alias:(literales)? _ "=" _ expr:opciones (_";")? {
    ids.push(id);
    return new n.Producciones(id, expr, alias);
}

opciones = expr:union rest:(_ "/" _ @union)* {
    return new n.Opciones([expr, ...rest]);
}

union = expr:expresion rest:(_ @expresion !(_ literales? _ "=") )* {
    return new n.Union([expr, ...rest]);
}

expresion = ("@")? _ id:(identificador _ ":")?_ varios? _ expr:expresiones _ qty:([?+*]/conteo)?
{
    return new n.Expresion( expr, id, qty);
}

//etiqueta = ("@")? _ id:identificador _ ":" (varios)?

varios = ("!"/"&"/"$")

expresiones  =  id:identificador { usos.push(id)
                    return new n.Identificador(id);
                }
                / val:literales isCase:"i"? {
                    return new n.String(val, isCase);
                }
                / "(" _ op:opciones _ ")"{
                    return op
                }
                / chars:clase isCase:"i"? {
                    return new n.Clase(chars, isCase)
                }
                / "."
                / "!."

// conteo = "|" parteconteo _ (_ delimitador )? _ "|"

conteo = "|" _ (numero / id:identificador) _ "|"
        / "|" _ (numero / id:identificador)? _ ".." _ (numero / id2:identificador)? _ "|"
        / "|" _ (numero / id:identificador)? _ "," _ opciones _ "|"
        / "|" _ (numero / id:identificador)? _ ".." _ (numero / id2:identificador)? _ "," _ opciones _ "|"

// parteconteo = identificador
//             / [0-9]? _ ".." _ [0-9]?
// 			/ [0-9]

// delimitador =  "," _ expresion

// Regla principal que analiza corchetes con contenido
clase
  = "[" @contenidoClase+ "]"

// Regla para validar un rango como [A-Z]
contenidoClase
  = bottom:$[^\[\]] "-" top:$[^\[\]] {
    return new n.Rango(bottom, top);
  }
  / $[^\[\]]

// Regla para caracteres individuales
caracter
    = [a-zA-Z0-9_ ] { return text()}

// Coincide con cualquier contenido que no incluya "]"
contenido
    = (corchete / texto)+

corchete
    = "[" contenido "]"

texto
    = [^\[\]]+

literales = '"' val:$stringDobleComilla* '"' {
    return val;
}
            / "'" val:$stringSimpleComilla* "'" {
                return val;
            }

stringDobleComilla = !('"' / "\\" / finLinea) .
                    / "\\" escape
                    / continuacionLinea

stringSimpleComilla = !("'" / "\\" / finLinea) .
                    / "\\" escape
                    / continuacionLinea

continuacionLinea = "\\" secuenciaFinLinea

finLinea = [\n\r\u2028\u2029]

escape = "'"
        / '"'
        / "\\"
        / "b"
        / "f"
        / "n"
        / "r"
        / "t"
        / "v"
        / "u"

secuenciaFinLinea = "\r\n" / "\n" / "\r" / "\u2028" / "\u2029"

// literales = 
//     "\"" [^"]* "\""
//     / "'" [^']* "'"
    

numero = [0-9]+

identificador = [_a-z]i[_a-z0-9]i* { return text() }


_ = (Comentarios /[ \t\n\r])*


Comentarios = 
    "//" [^\n]* 
    / "/*" (!"*/" .)* "*/"
