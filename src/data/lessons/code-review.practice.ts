import type { PracticeQuestion } from "@/domain/models/practice";

export const codeReviewPractice: PracticeQuestion[] = [
  {
    id: "cr-q1",
    type: "multiple-choice",
    prompt: "Which term refers to a non-blocking style suggestion in a PR?",
    options: ["Rollback", "Nitpick", "Hotfix", "Milestone"],
    correctAnswer: "Nitpick",
    explanation: "A nitpick is a minor readability or style suggestion that should not block merge.",
    support: {
      promptEs: "Que termino se refiere a una sugerencia de estilo que no bloquea un PR?",
      taskEs: "Elige el termino de code review correcto.",
      hintEs: "Debe ser una observacion menor, no un problema critico.",
      explanationEs: "Nitpick es una observacion pequena de estilo o legibilidad que no deberia bloquear el merge.",
      answerMeaningEs: "La respuesta correcta era 'Nitpick'.",
      optionGlossary: {
        Rollback: "reversion de una version",
        Nitpick: "detalle menor de estilo o prolijidad",
        Hotfix: "arreglo urgente",
        Milestone: "hito del proyecto"
      }
    }
  },
  {
    id: "cr-q2",
    type: "fill-in-the-blank",
    prompt: "Complete the sentence with the best review term.",
    sentence: "I left one ______ comment because the error handling can crash in production.",
    correctAnswer: "blocking",
    explanation: "Blocking comments identify issues that must be fixed before merge.",
    support: {
      promptEs: "Completa la frase con el mejor termino de revision.",
      contextEs: "Deje un comentario ______ porque el manejo de errores puede romper produccion.",
      taskEs: "Completa con la palabra usada cuando un comentario impide aprobar el merge.",
      hintEs: "No es una sugerencia menor; es algo que debe corregirse antes.",
      explanationEs: "Los comentarios blocking indican problemas que deben resolverse antes del merge.",
      answerMeaningEs: "La frase correcta era: I left one blocking comment because the error handling can crash in production."
    }
  },
  {
    id: "cr-q3",
    type: "sentence-correction",
    prompt: "Rewrite this sentence with natural review language.",
    incorrectSentence: "Please fix this now, your code is bad for merge.",
    correctedSentence: "Could you address this issue before merge so we keep the release stable?",
    explanation: "Professional reviews stay specific and respectful while asking for action.",
    support: {
      promptEs: "Reescribe esta frase con lenguaje natural de code review.",
      contextEs: "La idea es pedir un cambio antes del merge sin sonar agresivo.",
      taskEs: "Escribe la misma intencion con tono especifico y respetuoso.",
      hintEs: "Usa una peticion colaborativa como 'Could you address...'.",
      explanationEs: "Una review profesional pide accion concreta, pero mantiene respeto y contexto.",
      answerMeaningEs: "Debias decir: Could you address this issue before merge so we keep the release stable?"
    }
  },
  {
    id: "cr-q4",
    type: "scenario-selection",
    prompt: "Choose the most professional response after the author fixes your comments.",
    scenario: "The pull request author updated all requested changes and asked for re-review.",
    options: [
      "Ok done.",
      "Looks clean now, approved. Thanks for the quick update.",
      "Maybe maybe fine.",
      "This is whatever."
    ],
    correctAnswer: "Looks clean now, approved. Thanks for the quick update.",
    explanation: "It confirms status and acknowledges collaboration in a professional tone.",
    support: {
      promptEs: "Elige la respuesta mas profesional despues de que el autor corrige tus comentarios.",
      contextEs: "El autor del pull request actualizo todos los cambios pedidos y solicito nueva revision.",
      taskEs: "Selecciona una respuesta clara, profesional y colaborativa.",
      hintEs: "La mejor opcion confirma aprobacion y agradece la rapidez.",
      explanationEs: "La respuesta correcta confirma estado y reconoce la colaboracion de forma profesional.",
      answerMeaningEs: "La mejor respuesta era: Looks clean now, approved. Thanks for the quick update.",
      optionGlossary: {
        "Ok done.": "ok, hecho",
        "Looks clean now, approved. Thanks for the quick update.": "ahora se ve limpio, aprobado. Gracias por la actualizacion rapida",
        "Maybe maybe fine.": "tal vez esta bien",
        "This is whatever.": "esto da igual"
      }
    }
  }
];
