import type { PracticeQuestion } from "@/domain/models/practice";

export const debuggingPractice: PracticeQuestion[] = [
  {
    id: "db-q1",
    type: "multiple-choice",
    prompt: "What term describes the original reason behind a recurring failure?",
    options: ["Root cause", "Fallback", "Patch note", "Release train"],
    correctAnswer: "Root cause",
    explanation: "Root cause identifies the underlying defect, not just symptoms.",
    support: {
      promptEs: "Que termino describe la razon original detras de una falla recurrente?",
      taskEs: "Elige el termino que apunta a la causa real del problema.",
      hintEs: "No busques el parche ni el plan B; busca el origen del fallo.",
      explanationEs: "Root cause identifica el defecto subyacente, no solo los sintomas visibles.",
      answerMeaningEs: "La respuesta correcta era 'Root cause'.",
      optionGlossary: {
        "Root cause": "causa raiz",
        Fallback: "alternativa de respaldo",
        "Patch note": "nota de parche",
        "Release train": "flujo programado de releases"
      }
    }
  },
  {
    id: "db-q2",
    type: "fill-in-the-blank",
    prompt: "Complete the sentence with the best debugging phrase.",
    sentence: "I can ______ the bug consistently in staging with the same request body.",
    correctAnswer: "reproduce",
    explanation: "Reproduce means triggering the same issue with repeatable steps.",
    support: {
      promptEs: "Completa la frase con la mejor expresion de debugging.",
      contextEs: "Puedo ______ el bug de forma consistente en staging con el mismo request body.",
      taskEs: "Completa con el verbo que indica repetir el bug siguiendo los mismos pasos.",
      hintEs: "La palabra expresa que puedes hacer que el error aparezca de nuevo.",
      explanationEs: "Reproduce significa disparar el mismo problema con pasos repetibles.",
      answerMeaningEs: "La frase correcta era: I can reproduce the bug consistently in staging with the same request body."
    }
  },
  {
    id: "db-q3",
    type: "sentence-correction",
    prompt: "Rewrite this sentence so it sounds natural in an incident channel.",
    incorrectSentence: "Bug appears random, we no know why now.",
    correctedSentence: "The bug appears intermittent, and we are still investigating the root cause.",
    explanation: "Use precise incident vocabulary and grammatically complete phrasing.",
    support: {
      promptEs: "Reescribe esta frase para que suene natural en un canal de incidentes.",
      contextEs: "La idea es decir que el bug aparece a veces y todavia investigan la causa raiz.",
      taskEs: "Redacta la actualizacion con vocabulario preciso y gramatica completa.",
      hintEs: "Usa palabras como 'intermittent' y 'investigating the root cause'.",
      explanationEs: "En incidentes conviene usar vocabulario preciso y frases completas para evitar ambiguedad.",
      answerMeaningEs: "Debias decir: The bug appears intermittent, and we are still investigating the root cause."
    }
  },
  {
    id: "db-q4",
    type: "scenario-selection",
    prompt: "Choose the best update for a production incident thread.",
    scenario: "You deployed a temporary mitigation while the permanent fix is in progress.",
    options: [
      "Maybe fixed now.",
      "We deployed a workaround to reduce impact while we prepare the permanent fix.",
      "All good trust me.",
      "I pushed something."
    ],
    correctAnswer: "We deployed a workaround to reduce impact while we prepare the permanent fix.",
    explanation: "The message communicates action, impact and next step clearly.",
    support: {
      promptEs: "Elige la mejor actualizacion para un hilo de incidente en produccion.",
      contextEs: "Desplegaste una mitigacion temporal mientras se prepara la solucion definitiva.",
      taskEs: "Selecciona el mensaje mas claro para explicar accion tomada e impacto.",
      hintEs: "La mejor opcion explica workaround, impacto y siguiente paso.",
      explanationEs: "El mensaje correcto comunica accion, impacto y proximo paso de forma clara.",
      answerMeaningEs: "La mejor actualizacion era: We deployed a workaround to reduce impact while we prepare the permanent fix.",
      optionGlossary: {
        "Maybe fixed now.": "tal vez ya esta arreglado",
        "We deployed a workaround to reduce impact while we prepare the permanent fix.": "desplegamos una mitigacion para reducir impacto mientras preparamos la solucion definitiva",
        "All good trust me.": "todo bien, confia en mi",
        "I pushed something.": "subi algo"
      }
    }
  }
];
