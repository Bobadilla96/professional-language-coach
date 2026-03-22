import type { PracticeQuestion } from "@/domain/models/practice";

export const incidentResponsePractice: PracticeQuestion[] = [
  {
    id: "ir-q1",
    type: "multiple-choice",
    prompt: "Which term refers to the action taken to reduce the problem before the final fix is deployed?",
    options: ["Recovery", "Follow-up", "Mitigation", "Impact"],
    correctAnswer: "Mitigation",
    explanation: "Mitigation reduces the severity or scope of the incident while a full solution is prepared.",
    support: {
      promptEs: "Que termino se refiere a la accion tomada para reducir el problema antes de desplegar la solucion final?",
      taskEs: "Elige el termino correcto de incident response.",
      hintEs: "No es el resultado final ni el analisis posterior; es la accion temporal que contiene el dano.",
      explanationEs: "Mitigation reduce la severidad o el alcance del incidente mientras se prepara la solucion completa.",
      answerMeaningEs: "Debias elegir 'Mitigation' como accion temporal para contener el incidente."
    }
  },
  {
    id: "ir-q2",
    type: "fill-in-the-blank",
    prompt: "Complete the sentence with the best term.",
    sentence: "The service is stable again, but we still need a ______ to prevent recurrence.",
    correctAnswer: "follow-up",
    explanation: "A follow-up is the work that happens after recovery to reduce future risk.",
    support: {
      promptEs: "Completa la frase con el mejor termino.",
      contextEs: "El servicio ya esta estable otra vez, pero aun falta un ______ para evitar que vuelva a pasar.",
      taskEs: "Completa con la palabra que describe el trabajo posterior al incidente.",
      hintEs: "No es la causa raiz; es la accion posterior de mejora.",
      explanationEs: "Follow-up es el trabajo posterior al incidente para reducir riesgo futuro.",
      answerMeaningEs: "La frase correcta era: The service is stable again, but we still need a follow-up to prevent recurrence."
    }
  },
  {
    id: "ir-q3",
    type: "sentence-correction",
    prompt: "Rewrite the update so it sounds more professional.",
    incorrectSentence: "Users are bad impacted but we are doing things and later we tell more.",
    correctedSentence: "Users are affected, but mitigation is in progress and we will share another update soon.",
    explanation: "Use affected instead of bad impacted, and state the mitigation plus next communication clearly.",
    support: {
      promptEs: "Reescribe el update para que suene mas profesional.",
      contextEs: "Quieres comunicar impacto a usuarios, mitigacion en curso y proximo update.",
      taskEs: "Mejora gramatica, claridad y tono profesional.",
      hintEs: "Usa 'affected', menciona mitigation y deja claro que habra otro update.",
      explanationEs: "'Affected' es el termino natural y la frase mejora mucho al mencionar mitigacion y siguiente comunicacion.",
      answerMeaningEs: "Debias decir: Users are affected, but mitigation is in progress and we will share another update soon."
    }
  },
  {
    id: "ir-q4",
    type: "scenario-selection",
    prompt: "Choose the best incident update.",
    scenario: "You need to communicate current impact and the next step to stakeholders.",
    options: [
      "System is broken, we are checking.",
      "There is an issue and maybe later we know more.",
      "The impact is limited to checkout in mobile, mitigation is in progress and the next update will be shared in 20 minutes.",
      "We have problems everywhere right now."
    ],
    correctAnswer: "The impact is limited to checkout in mobile, mitigation is in progress and the next update will be shared in 20 minutes.",
    explanation: "The best update scopes impact, states action and commits to a communication timebox.",
    support: {
      promptEs: "Elige el mejor update de incidente.",
      contextEs: "Necesitas comunicar impacto actual y siguiente paso a stakeholders.",
      taskEs: "Selecciona la opcion mas profesional y concreta.",
      hintEs: "La mejor opcion delimita impacto, menciona mitigacion y promete un nuevo update con tiempo.",
      explanationEs: "La mejor comunicacion delimita impacto, indica accion y da una referencia clara del proximo update.",
      answerMeaningEs: "La mejor respuesta era: The impact is limited to checkout in mobile, mitigation is in progress and the next update will be shared in 20 minutes."
    }
  }
];
