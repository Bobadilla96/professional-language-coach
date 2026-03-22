import type { PracticeQuestion } from "@/domain/models/practice";

export const gitWorkflowPractice: PracticeQuestion[] = [
  {
    id: "q1",
    type: "multiple-choice",
    prompt: "Which term is used when Git cannot combine changes automatically?",
    options: ["Rollback", "Merge Conflict", "Branch", "Commit"],
    correctAnswer: "Merge Conflict",
    explanation: "A merge conflict happens when two changes collide and Git needs manual resolution.",
    support: {
      promptEs: "Que termino se usa cuando Git no puede combinar cambios automaticamente?",
      taskEs: "Elige el termino tecnico correcto.",
      hintEs: "Busca la opcion que describe un choque entre cambios de distintas ramas.",
      explanationEs: "Merge conflict ocurre cuando dos cambios colisionan y Git necesita resolucion manual.",
      answerMeaningEs: "Debias identificar 'Merge Conflict' como conflicto de fusion.",
      optionGlossary: {
        Rollback: "volver a una version anterior",
        "Merge Conflict": "conflicto de fusion",
        Branch: "rama de trabajo",
        Commit: "confirmacion de cambio"
      }
    }
  },
  {
    id: "q2",
    type: "fill-in-the-blank",
    prompt: "Complete the sentence with the correct term.",
    sentence: "Please review my ______ before we merge this feature.",
    correctAnswer: "pull request",
    explanation: "A pull request is the normal review step before merging.",
    support: {
      promptEs: "Completa la frase con el termino correcto.",
      contextEs: "Por favor revisa mi ______ antes de fusionar esta funcionalidad.",
      taskEs: "Completa con el termino usado para pedir revision antes del merge.",
      hintEs: "No es branch ni commit; es la solicitud formal de revision.",
      explanationEs: "Pull request es el paso normal de revision antes de fusionar cambios.",
      answerMeaningEs: "La frase correcta era: Please review my pull request before we merge this feature."
    }
  },
  {
    id: "q3",
    type: "sentence-correction",
    prompt: "Correct the sentence to sound more natural in a dev team context.",
    incorrectSentence: "I do a branch for fix bug in production.",
    correctedSentence: "I created a branch to fix a bug in production.",
    explanation: "Use created a branch and to fix a bug for natural professional English.",
    support: {
      promptEs: "Corrige la frase para que suene natural en un contexto de equipo de desarrollo.",
      contextEs: "La frase quiere decir: cree una rama para corregir un bug en produccion.",
      taskEs: "Reescribe la idea con mejor gramatica y vocabulario profesional.",
      hintEs: "Usa 'created a branch' y 'to fix a bug'.",
      explanationEs: "En ingles profesional suena natural decir 'created a branch' y 'to fix a bug'.",
      answerMeaningEs: "Debias decir: I created a branch to fix a bug in production."
    }
  },
  {
    id: "q4",
    type: "scenario-selection",
    prompt: "Choose the most natural sentence for this situation.",
    scenario: "You are writing in Slack to warn the team that the release may need to be reverted.",
    options: [
      "We maybe return the deploy later.",
      "We may need to rollback this deployment.",
      "I am back the version maybe.",
      "The code is undo now."
    ],
    correctAnswer: "We may need to rollback this deployment.",
    explanation: "That is the most natural and professional phrasing.",
    support: {
      promptEs: "Elige la frase mas natural para esta situacion.",
      contextEs: "Estas escribiendo en Slack para avisar al equipo que tal vez haya que revertir el release.",
      taskEs: "Selecciona la frase mas clara y profesional.",
      hintEs: "Busca una opcion con vocabulario real de despliegue y un tono directo.",
      explanationEs: "Esa opcion usa el verbo correcto, mantiene claridad y suena profesional.",
      answerMeaningEs: "La mejor forma de decirlo era: We may need to rollback this deployment.",
      optionGlossary: {
        "We maybe return the deploy later.": "tal vez devolvemos el deploy despues",
        "We may need to rollback this deployment.": "puede que necesitemos revertir este despliegue",
        "I am back the version maybe.": "yo vuelvo la version tal vez",
        "The code is undo now.": "el codigo esta deshecho ahora"
      }
    }
  }
];
