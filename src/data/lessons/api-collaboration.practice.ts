import type { PracticeQuestion } from "@/domain/models/practice";

export const apiCollaborationPractice: PracticeQuestion[] = [
  {
    id: "api-q1",
    type: "multiple-choice",
    prompt: "Which HTTP status code best fits invalid request payload validation?",
    options: ["200", "301", "422", "503"],
    correctAnswer: "422",
    explanation: "422 is commonly used when the server understands request format but semantic validation fails.",
    support: {
      promptEs: "Que codigo HTTP encaja mejor para validacion fallida del payload?",
      taskEs: "Elige el status code correcto para un request bien formado pero semantica invalida.",
      hintEs: "No es redireccion ni error temporal del servidor; es problema de validacion.",
      explanationEs: "422 se usa cuando el servidor entiende el formato del request, pero falla la validacion semantica.",
      answerMeaningEs: "La respuesta correcta era 422.",
      optionGlossary: {
        "200": "ok",
        "301": "redireccion permanente",
        "422": "entidad no procesable / error de validacion",
        "503": "servicio no disponible"
      }
    }
  },
  {
    id: "api-q2",
    type: "fill-in-the-blank",
    prompt: "Complete the sentence with the right API term.",
    sentence: "Please update the OpenAPI ______ so frontend can generate accurate client types.",
    correctAnswer: "schema",
    explanation: "Schema defines shape and constraints required for client generation.",
    support: {
      promptEs: "Completa la frase con el termino correcto de API.",
      contextEs: "Por favor actualiza el ______ de OpenAPI para que frontend genere tipos correctos.",
      taskEs: "Completa con el artefacto que define forma y restricciones del payload.",
      hintEs: "No es endpoint ni token; es la estructura declarada en OpenAPI.",
      explanationEs: "Schema define la forma y las restricciones necesarias para generar clientes correctamente.",
      answerMeaningEs: "La frase correcta era: Please update the OpenAPI schema so frontend can generate accurate client types."
    }
  },
  {
    id: "api-q3",
    type: "sentence-correction",
    prompt: "Rewrite this message in professional API collaboration English.",
    incorrectSentence: "This endpoint break old app, change fast.",
    correctedSentence: "This endpoint breaks the current mobile app, so we need a backward compatible update.",
    explanation: "Clear grammar plus explicit backward compatibility request improves team communication.",
    support: {
      promptEs: "Reescribe este mensaje con ingles profesional de colaboracion API.",
      contextEs: "La idea es avisar que el endpoint rompe la app actual y pedir compatibilidad hacia atras.",
      taskEs: "Redacta el mensaje con gramatica clara y una solicitud tecnica precisa.",
      hintEs: "Usa 'breaks the current mobile app' y 'backward compatible update'.",
      explanationEs: "Una comunicacion clara sobre APIs necesita buena gramatica y un pedido explicito de compatibilidad.",
      answerMeaningEs: "Debias decir: This endpoint breaks the current mobile app, so we need a backward compatible update."
    }
  },
  {
    id: "api-q4",
    type: "scenario-selection",
    prompt: "Choose the best message for cross-team API alignment.",
    scenario: "Backend changed response shape and frontend team needs confirmation before release.",
    options: [
      "You changed stuff, frontend broken.",
      "Can we confirm the new payload contract and update the schema before release?",
      "I think api maybe wrong.",
      "Do whatever with endpoint."
    ],
    correctAnswer: "Can we confirm the new payload contract and update the schema before release?",
    explanation: "Professional API communication is concrete, collaborative and release-aware.",
    support: {
      promptEs: "Elige el mejor mensaje para alinear la API entre equipos.",
      contextEs: "Backend cambio la forma de la respuesta y frontend necesita confirmacion antes del release.",
      taskEs: "Selecciona el mensaje mas concreto, colaborativo y orientado al release.",
      hintEs: "La mejor opcion pide confirmar contrato y actualizar schema.",
      explanationEs: "La comunicacion profesional sobre APIs debe ser concreta, colaborativa y consciente del release.",
      answerMeaningEs: "La mejor opcion era: Can we confirm the new payload contract and update the schema before release?",
      optionGlossary: {
        "You changed stuff, frontend broken.": "cambiaron cosas y frontend se rompio",
        "Can we confirm the new payload contract and update the schema before release?": "podemos confirmar el nuevo contrato del payload y actualizar el schema antes del release?",
        "I think api maybe wrong.": "creo que la api tal vez esta mal",
        "Do whatever with endpoint.": "haz lo que quieras con el endpoint"
      }
    }
  }
];
