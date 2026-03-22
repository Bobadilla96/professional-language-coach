import type { PracticeQuestion } from "@/domain/models/practice";

export const technicalWritingPractice: PracticeQuestion[] = [
  {
    id: "tw-q1",
    type: "multiple-choice",
    prompt: "Which word best describes a short message that still communicates the main point clearly?",
    options: ["Concise", "Noisy", "Delayed", "Casual"],
    correctAnswer: "Concise",
    explanation: "Concise means brief but still clear and useful.",
    support: {
      promptEs: "Que palabra describe mejor un mensaje corto que igual comunica bien la idea principal?",
      taskEs: "Elige el termino correcto de writing profesional.",
      hintEs: "No significa informal; significa breve y claro.",
      explanationEs: "Concise significa breve, claro y util.",
      answerMeaningEs: "Debias elegir 'Concise' como mensaje corto pero bien comunicado.",
      optionGlossary: {
        Concise: "breve y claro",
        Noisy: "ruidoso o confuso",
        Delayed: "demorado",
        Casual: "informal"
      }
    }
  },
  {
    id: "tw-q2",
    type: "fill-in-the-blank",
    prompt: "Complete the sentence with the best term.",
    sentence: "Please add more ______ so stakeholders can understand why we changed the rollout plan.",
    correctAnswer: "context",
    explanation: "Context explains the background and makes the decision easier to follow.",
    support: {
      promptEs: "Completa la frase con el mejor termino.",
      contextEs: "Agrega mas ______ para que los stakeholders entiendan por que cambiamos el plan de despliegue.",
      taskEs: "Completa con la palabra que agrega informacion de fondo.",
      hintEs: "No se trata de accion, sino de marco explicativo.",
      explanationEs: "Context aporta la informacion necesaria para entender la decision.",
      answerMeaningEs: "La frase correcta era: Please add more context so stakeholders can understand why we changed the rollout plan."
    }
  },
  {
    id: "tw-q3",
    type: "sentence-correction",
    prompt: "Rewrite the sentence so it sounds more professional.",
    incorrectSentence: "This note is short but people maybe not understand because no context.",
    correctedSentence: "This note is short, but people may not understand it because it lacks context.",
    explanation: "Use may not, add the object it, and replace no context with lacks context for a more natural tone.",
    support: {
      promptEs: "Reescribe la frase para que suene mas profesional.",
      contextEs: "Quieres decir que una nota es corta, pero aun asi puede ser confusa por falta de contexto.",
      taskEs: "Corrige gramatica y tono profesional.",
      hintEs: "Usa 'may not' y una expresion mas natural para falta de contexto.",
      explanationEs: "'May not' suena mas natural y 'lacks context' es mas profesional que 'no context'.",
      answerMeaningEs: "Debias decir: This note is short, but people may not understand it because it lacks context."
    }
  },
  {
    id: "tw-q4",
    type: "scenario-selection",
    prompt: "Choose the most professional sentence for a PR description.",
    scenario: "You want reviewers to quickly understand impact, risk and next step.",
    options: [
      "I changed many things, please review all.",
      "This PR updates several files. Hope it works.",
      "This PR updates the queue retry logic, reduces duplicate jobs and includes a rollback note.",
      "A lot was modified, ask me later if needed."
    ],
    correctAnswer: "This PR updates the queue retry logic, reduces duplicate jobs and includes a rollback note.",
    explanation: "That option is concrete, scannable and useful for reviewers.",
    support: {
      promptEs: "Elige la frase mas profesional para una descripcion de PR.",
      contextEs: "Quieres que el revisor entienda rapido impacto, riesgo y siguiente paso.",
      taskEs: "Selecciona la opcion mas concreta y util.",
      hintEs: "La mejor opcion nombra el cambio, el beneficio y la nota de rollback.",
      explanationEs: "Esa opcion es clara, concreta y accionable para el revisor.",
      answerMeaningEs: "La mejor respuesta era: This PR updates the queue retry logic, reduces duplicate jobs and includes a rollback note."
    }
  }
];
