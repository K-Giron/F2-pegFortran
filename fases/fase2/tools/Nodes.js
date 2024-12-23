//Plantilla de los nodos a recorrer para poder autogenerarlo
const nodes = {
  Producciones: ["id", "expr", "alias"],
  Opciones: ["exprs"],
  Union: ["exprs"],
  Expresion: ["expr", "label", "qty"],
  String: ["val", "isCase"],
  Identificador: ["id"],
  Clase: ["chars", "isCase"],
  Rango: ["bottom", "top"],
};

export default nodes;
