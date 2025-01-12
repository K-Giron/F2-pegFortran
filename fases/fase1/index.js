import * as monaco from "https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/+esm";
import { parse } from "./parser/gramatica.js";
import Tokenizer from "../fase2/visitor/Tokenizer.js";
import { ErrorReglas } from "./parser/error.js";
import { generateTokenizer } from "../fase2/visitor/utils.js";

export let ids = [];
export let usos = [];
export let errores = [];

// Crear el editor principal
const editor = monaco.editor.create(document.getElementById("editor"), {
  value: "",
  language: "java",
  theme: "tema",
  automaticLayout: true,
});

// Crear el editor para la salida
const salida = monaco.editor.create(document.getElementById("salida"), {
  value: "",
  language: "java",
  readOnly: true,
  automaticLayout: true,
});

let decorations = [];
var cstGlobal = null;

// Analizar contenido del editor
const analizar = () => {
  const entrada = editor.getValue();
  ids.length = 0;
  usos.length = 0;
  errores.length = 0;
  try {
    const cst = parse(entrada);
    cstGlobal = cst;

    if (errores.length > 0) {
      salida.setValue(`Error: ${errores[0].message}`);
      return;
    } else {
      salida.setValue("Análisis Exitoso");
    }

    // salida.setValue("Análisis Exitoso");
    // Limpiar decoraciones previas si la validación es exitosa
    decorations = editor.deltaDecorations(decorations, []);

    // const tokenizer = new Tokenizer();
    // const fileContents = tokenizer.generateTokenizer(cst);
    // console.log(fileContents);
    // const blob = new Blob([fileContents], { type: "text/plain" });
    // const url = URL.createObjectURL(blob);
    // const button = document.getElementById("botonDescarga");
    // button.href = url;
  } catch (e) {
    if (e.location === undefined) {
      salida.setValue(`Error: ${e.message}`);
    } else {
      // Mostrar mensaje de error en el editor de salida
      salida.setValue(
        `Error: ${e.message}\nEn línea ${e.location.start.line} columna ${e.location.start.column}`
      );

      // Resaltar el error en el editor de entrada
      decorations = editor.deltaDecorations(decorations, [
        {
          range: new monaco.Range(
            e.location.start.line,
            e.location.start.column,
            e.location.start.line,
            e.location.start.column + 1
          ),
          options: {
            inlineClassName: "errorHighlight", // Clase CSS personalizada para cambiar color de letra
          },
        },
        {
          range: new monaco.Range(
            e.location.start.line,
            e.location.start.column,
            e.location.start.line,
            e.location.start.column
          ),
          options: {
            glyphMarginClassName: "warningGlyph", // Clase CSS para mostrar un warning en el margen
          },
        },
      ]);
    }
  }
};

// Escuchar cambios en el contenido del editor
editor.onDidChangeModelContent(() => {
  analizar();
});

let downloadHappening = false;
const button = document.getElementById("botonDescarga");
button.addEventListener("click", () => {
  if (downloadHappening) return;
  if (!cstGlobal) {
    alert("Escribe una gramatica valida");
    return;
  }

  let url;
  console.log(cstGlobal);
  console.log("Generando Tokenizer...");
  generateTokenizer(cstGlobal).then((fileContents) => {
    console.log(fileContents); // Verifica el contenido generado
    const blob = new Blob([fileContents], { type: "text/plain" });
    url = URL.createObjectURL(blob);
    button.href = url;
    downloadHappening = true;
    button.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      downloadHappening = false;
    }, 1000);
  });
});

// CSS personalizado para resaltar el error y agregar un warning
const style = document.createElement("style");
style.innerHTML = `
    .errorHighlight {
        color: red !important;
        font-weight: bold;
    }
    .warningGlyph {
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="orange" d="M8 1l7 14H1L8 1z"/></svg>') no-repeat center center;
        background-size: contain;
    }
`;
document.head.appendChild(style);
