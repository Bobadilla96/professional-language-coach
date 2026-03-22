import type { AuthRole } from "@/domain/models/auth";
import type { CourseStatus, LearningGoal, ProfessionalTrack } from "@/domain/models/course";
import type { LessonLevel, LessonTopic } from "@/domain/models/lesson";
import type { AppLanguage } from "@/lib/language.client";

const EN_TEXT = {
  project01: "Project 01",
  languageLabel: "Language",
  appName: "Professional Language Coach",
  dashboard: "Dashboard",
  courses: "Courses",
  bbcLibrary: "BBC Library",
  lessons: "Lessons",
  practice: "Practice",
  conversation: "Conversation",
  progress: "Progress",
  writingLab: "Writing Lab",
  lessonDetail: "Lesson Detail",
  courseDetail: "Course Detail",
  bbcUnitDetail: "BBC Unit",
  dark: "Dark",
  light: "Light",
  logout: "Logout",
  globalProgress: "Global progress",
  dashboardKicker: "Professional Language Coach",
  dashboardDescription: "Track your active routes, lesson completion and practical communication progress.",
  completedLessons: "Completed lessons",
  enrolledCourses: "Enrolled courses",
  currentLevel: "Current level",
  totalProgress: "Total progress",
  streak: "Streak",
  nextLesson: "Next lesson",
  recommendedCourse: "Recommended course",
  activeRoutes: "Active routes",
  noEnrolledCourses: "You have not enrolled in any course yet.",
  continue: "Continue",
  weakTopics: "Weak topics",
  noWeakTopics: "No weak topics yet",
  studyStreak: "Study streak",
  recentActivity: "Recent activity",
  noActivity: "No activity yet",
  progressByTopic: "Progress by topic",
  coursesDescription: "Explore structured routes by track, goal and lesson bundle.",
  bbcLibraryTitle: "BBC English local archive",
  bbcLibraryDescription: "Open your private local collection with embedded audio and PDF per unit, without extracting everything to disk.",
  openBbcLibrary: "Open BBC library",
  lessonsDescription: "Choose your technical English module and keep advancing.",
  searchLesson: "Search lesson...",
  allLevels: "All levels",
  completed: "Completed",
  pending: "Pending",
  openLesson: "Open lesson",
  lessonDetailKicker: "Lesson detail",
  vocabulary: "Vocabulary",
  vocabularyDescription: "Technical terms used in real developer workflows.",
  workplacePhrases: "Workplace phrases",
  workplacePhrasesDescription: "Useful sentences for PRs, standups and Slack.",
  speakingChallenge: "Speaking challenge",
  tip: "Tip",
  startPractice: "Start practice",
  lessonNotFound: "Lesson not found",
  lessonNotFoundDescription: "The selected lesson does not exist.",
  aiLessonAssistant: "AI Lesson Assistant",
  aiLessonAssistantDescription: "Ask specific doubts about this lesson content.",
  aiAskPlaceholder: "Example: How can I say this code review comment more professionally?",
  askAi: "Ask AI",
  thinking: "Thinking...",
  practiceDescription: "One question at a time. Validate, learn, and continue.",
  noPracticeFound: "No practice found for this lesson yet.",
  practiceCompleted: "Practice completed",
  practiceCompletedDescription: "Great work. Review your score and continue with another lesson.",
  helpInSpanish: "Help in Spanish",
  translatedInstruction: "Translated instruction",
  translatedContext: "Translated context",
  whatYouNeedToDo: "What you need to do",
  helpfulHint: "Helpful hint",
  whatYouShouldSay: "What you should say",
  finalScore: "Final score",
  lessonMarkedCompleted: "Lesson marked as completed.",
  retryToComplete: "Try again to reach 70% and complete the lesson.",
  explanation: "Explanation",
  nextQuestion: "Next question",
  finish: "Finish",
  validate: "Validate",
  yourAnswer: "Your answer",
  incorrect: "Incorrect",
  writeCorrectedSentence: "Write corrected sentence",
  question: "Question",
  progressDescription: "See your strengths, weak points and completion trend.",
  averageScore: "Average score",
  commonErrors: "Common errors",
  noRepeatedErrors: "No repeated errors registered.",
  masteredTopics: "Mastered topics",
  noMasteredTopics: "No mastered topic yet.",
  lessonCompletion: "Lesson completion",
  noLessonAttempts: "No lesson attempts yet.",
  attempts: "attempts",
  skillRadar: "Skill radar",
  writingLabDescription: "Write technical English and get instant correction + professional rewrite.",
  correctSentence: "Correct sentence",
  loadSample: "Load sample",
  correctionResult: "Correction result",
  original: "Original",
  corrected: "Corrected",
  professionalRewrite: "Professional rewrite",
  writeTechnicalSentence: "Write your technical sentence...",
  login: "Login",
  createAccount: "Create account",
  landingKicker: "Learning platform",
  landingTitle: "Build professional language skills for real work scenarios",
  landingDescription:
    "Move from isolated lessons to guided routes for developers, technical writing and conversation practice. Built for real workplace communication, not generic textbook English.",
  startFree: "Start free",
  continueLearning: "Continue learning",
  learningSetupKicker: "Learning setup",
  learningSetupTitle: "Tell us your native language and what you want to learn",
  learningSetupDescription:
    "Save your context so the platform can recommend the right route, first lesson and communication focus.",
  nativeLanguageField: "What is your native language?",
  targetLanguageField: "Which language do you want to learn?",
  professionalTrackField: "Which professional track fits you best?",
  learningGoalField: "What is your main learning goal?",
  targetCourseField: "Which route do you want to start with?",
  targetLessonField: "Which lesson should we open first?",
  selectedPathLabel: "Selected path",
  selectedCourseLabel: "Selected route",
  selectedLessonLabel: "First lesson",
  saveLearningPath: "Save learning path",
  goToSelectedLesson: "Go to selected lesson",
  goToSelectedCourse: "Open selected course",
  learningPathSaved: "Learning path saved for your profile.",
  personalSignatureLabel: "Personal approach",
  personalSignatureTitle: "Built with technical humility",
  personalSignatureDescription:
    "A calm workspace to improve step by step, ask better questions and keep learning without ego.",
  whatYouUnlock: "What you unlock",
  liveModulesReady: "4 modules live now and architecture ready for 12-class roadmap.",
  persistentProgressFeature: "Persistent progress, streaks, weak-topic tracking and lesson analytics.",
  aiAssistantFeature: "AI assistant endpoint via free model router for contextual Q&A by lesson.",
  valuesKicker: "What represents you",
  valuesTitle: "A product tone grounded in humility",
  valuesDescription:
    "Less noise, more intention: this interface prioritizes clarity, respect for the learning process and steady progress.",
  humilityValueTitle: "Humility",
  humilityValueDescription: "Accepting what you do not know yet and turning that gap into disciplined practice.",
  clarityValueTitle: "Clarity",
  clarityValueDescription: "Explaining ideas simply, without inflated wording or unnecessary complexity.",
  constancyValueTitle: "Constancy",
  constancyValueDescription: "Improving every session with small steps that compound over time.",
  highlightLessonsTitle: "Tech-first English lessons",
  highlightLessonsDescription:
    "Developer English, technical writing, incident communication and guided routes by professional objective.",
  highlightPracticeTitle: "Interactive practice",
  highlightPracticeDescription:
    "One-question flow with scoring, explanations and progress tracking by topic.",
  highlightWritingTitle: "Speaking and writing lab",
  highlightWritingDescription:
    "Pronunciation challenges plus correction feedback for professional technical writing.",
  highlightAiTitle: "AI lesson assistant",
  highlightAiDescription:
    "Ask doubts per lesson and receive concise coaching using a free AI model router.",
  openCourse: "Open course",
  enrollNow: "Enroll now",
  continueCourse: "Continue course",
  browseCourses: "Browse courses",
  modules: "Modules",
  lessonsCount: "Lessons",
  estimatedHours: "Estimated hours",
  track: "Track",
  goal: "Goal",
  courseOutcomes: "Outcomes",
  moduleOutcome: "Module outcome",
  routeProgress: "Route progress",
  published: "Published",
  comingSoon: "Coming soon",
  welcomeBack: "Welcome back",
  loginDescription: "Log in to continue your technical English track with lessons, practice drills, writing lab and progress analytics.",
  email: "Email",
  password: "Password",
  signIn: "Sign in",
  signingIn: "Signing in...",
  demoCredentials: "Demo credentials",
  createOwnAccountHint:
    "You can also create your own account and continue with the same dashboard and learning history.",
  cloudAuthEnabledTitle: "Cloud authentication enabled",
  cloudAuthEnabledDescription:
    "This project is connected to Supabase Auth. Sign in with your real account and your learning data will sync to the cloud.",
  backToLanding: "Back to landing",
  fullName: "Full name",
  createYourAccount: "Create your account",
  registerDescription: "Set your profile and start with practical technical English modules for real software teams.",
  role: "Role",
  creatingAccount: "Creating account...",
  whatAfterSignup: "What happens after signup?",
  afterSignupEnterDashboard: "You enter directly to your dashboard.",
  afterSignupLocalProgress: "Progress and preferences stay local by default and sync to Supabase when cloud auth is enabled.",
  afterSignupAskAi: "You can ask lesson questions to the AI assistant.",
  confirmEmailNotice: "Check your email to confirm your account before signing in.",
  alreadyHaveAccount: "Already have an account?",
  validEmailError: "Use a valid email address.",
  passwordMinError: "Password must have at least 6 characters.",
  nameMinError: "Name must have at least 2 characters.",
  invalidCredentials: "Invalid email or password.",
  emailAlreadyRegistered: "This email is already registered.",
  emailPlaceholder: "you@company.dev",
  securePasswordPlaceholder: "Your secure password",
  fullNamePlaceholder: "Your full name",
  passwordShortPlaceholder: "At least 6 chars",
  conversationDescription: "Role-play workplace conversations and synthesize responses with Microsoft VibeVoice.",
  conversationKicker: "Conversational Module",
  conversationTitle: "Tech English Conversation Coach",
  scenario: "Scenario",
  yourMessage: "Your message",
  yourMessagePlaceholder: "Example: I investigated the timeout and found a race condition in the queue worker.",
  sendToCoach: "Send to Coach",
  coaching: "Coaching...",
  speakMyMessage: "Speak my message",
  startConversationPrompt: "Start the conversation by sending your first message.",
  improvedSentence: "Improved sentence",
  coachLabel: "Coach",
  youLabel: "You",
  playWithVibeVoice: "Play with VibeVoice",
  vibevoiceEngine: "VibeVoice Engine",
  vibevoiceEngineDescription: "This module uses the Microsoft VibeVoice realtime websocket server.",
  serverUrl: "Server URL",
  voicePreset: "Voice preset",
  noVoicesAvailable: "No voices available",
  lastGeneratedAudio: "Last generated audio",
  coachUnavailable: "Coach service unavailable right now. Please try again.",
  networkErrorCoach: "Network error while generating coach response.",
  vibevoiceUnavailable: "VibeVoice is not available. Start VibeVoice web demo first.",
  generatingAudio: "Generating audio with VibeVoice...",
  audioReady: "Audio ready.",
  noAudioGenerated: "No audio generated. Check VibeVoice server logs.",
  couldNotGenerateVoice: "Could not generate voice.",
  demoDeveloperName: "Demo Developer"
};

type UiTextMap = typeof EN_TEXT;
type UiTextKey = keyof UiTextMap;

const UI_TEXT: Record<AppLanguage, UiTextMap> = {
  en: EN_TEXT,
  es: {
    ...EN_TEXT,
    project01: "Proyecto 01",
    languageLabel: "Idioma",
    appName: "Coach de Idiomas Profesionales",
    dashboard: "Panel",
    courses: "Cursos",
    bbcLibrary: "Biblioteca BBC",
    lessons: "Lecciones",
    practice: "Practica",
    conversation: "Conversacion",
    progress: "Progreso",
    writingLab: "Laboratorio",
    lessonDetail: "Detalle de leccion",
    courseDetail: "Detalle del curso",
    bbcUnitDetail: "Unidad BBC",
    dark: "Oscuro",
    light: "Claro",
    logout: "Salir",
    globalProgress: "Progreso global",
    dashboardKicker: "Coach de Idiomas Profesionales",
    dashboardDescription: "Sigue tus rutas activas, la completitud de lecciones y el progreso de comunicacion practica.",
    completedLessons: "Lecciones completadas",
    enrolledCourses: "Cursos inscritos",
    currentLevel: "Nivel actual",
    totalProgress: "Progreso total",
    streak: "Racha",
    nextLesson: "Siguiente leccion",
    recommendedCourse: "Curso recomendado",
    activeRoutes: "Rutas activas",
    noEnrolledCourses: "Aun no estas inscrito en ningun curso.",
    continue: "Continuar",
    weakTopics: "Temas debiles",
    noWeakTopics: "Aun no hay temas debiles",
    studyStreak: "Racha de estudio",
    recentActivity: "Actividad reciente",
    noActivity: "Aun no hay actividad",
    progressByTopic: "Progreso por tema",
    coursesDescription: "Explora rutas estructuradas por perfil, objetivo y conjunto de lecciones.",
    bbcLibraryTitle: "Archivo local BBC English",
    bbcLibraryDescription: "Abre tu coleccion privada local con audio y PDF embebidos por unidad, sin extraer todo al disco.",
    openBbcLibrary: "Abrir biblioteca BBC",
    lessonsDescription: "Elige tu modulo de ingles tecnico y sigue avanzando.",
    searchLesson: "Buscar leccion...",
    allLevels: "Todos los niveles",
    completed: "Completada",
    pending: "Pendiente",
    openLesson: "Abrir leccion",
    lessonDetailKicker: "Detalle de leccion",
    vocabulary: "Vocabulario",
    vocabularyDescription: "Terminos tecnicos usados en flujos reales de desarrollo.",
    workplacePhrases: "Frases laborales",
    workplacePhrasesDescription: "Frases utiles para PR, standups y Slack.",
    speakingChallenge: "Desafio oral",
    tip: "Tip",
    startPractice: "Iniciar practica",
    lessonNotFound: "Leccion no encontrada",
    lessonNotFoundDescription: "La leccion seleccionada no existe.",
    aiLessonAssistant: "Asistente IA de leccion",
    aiLessonAssistantDescription: "Pregunta dudas puntuales sobre el contenido de esta leccion.",
    aiAskPlaceholder: "Ejemplo: como digo este comentario de code review de forma mas profesional?",
    askAi: "Preguntar a IA",
    thinking: "Pensando...",
    practiceDescription: "Una pregunta a la vez. Valida, aprende y continua.",
    noPracticeFound: "Aun no hay practica para esta leccion.",
    practiceCompleted: "Practica completada",
    practiceCompletedDescription: "Buen trabajo. Revisa tu puntaje y continua con otra leccion.",
    helpInSpanish: "Ayuda en espanol",
    translatedInstruction: "Instruccion traducida",
    translatedContext: "Contexto traducido",
    whatYouNeedToDo: "Que debes hacer",
    helpfulHint: "Pista util",
    whatYouShouldSay: "Lo que debias decir",
    finalScore: "Puntaje final",
    lessonMarkedCompleted: "Leccion marcada como completada.",
    retryToComplete: "Intenta de nuevo hasta llegar al 70% para completarla.",
    explanation: "Explicacion",
    nextQuestion: "Siguiente pregunta",
    finish: "Finalizar",
    validate: "Validar",
    yourAnswer: "Tu respuesta",
    incorrect: "Incorrecta",
    writeCorrectedSentence: "Escribe la frase corregida",
    question: "Pregunta",
    progressDescription: "Mira tus fortalezas, puntos debiles y tendencia de avance.",
    averageScore: "Puntaje promedio",
    commonErrors: "Errores comunes",
    noRepeatedErrors: "No hay errores repetidos registrados.",
    masteredTopics: "Temas dominados",
    noMasteredTopics: "Aun no hay temas dominados.",
    lessonCompletion: "Avance por leccion",
    noLessonAttempts: "Aun no hay intentos de lecciones.",
    attempts: "intentos",
    skillRadar: "Radar de habilidades",
    writingLabDescription: "Escribe ingles tecnico y recibe correccion instantanea y version profesional.",
    correctSentence: "Corregir frase",
    loadSample: "Cargar ejemplo",
    correctionResult: "Resultado de correccion",
    original: "Original",
    corrected: "Corregida",
    professionalRewrite: "Reescritura profesional",
    writeTechnicalSentence: "Escribe tu frase tecnica...",
    login: "Ingresar",
    createAccount: "Crear cuenta",
    landingKicker: "Plataforma de aprendizaje",
    landingTitle: "Desarrolla idiomas profesionales para escenarios reales de trabajo",
    landingDescription:
      "Pasa de lecciones aisladas a rutas guiadas para developers, escritura tecnica y practica conversacional. Hecho para comunicacion laboral real, no para ingles generico de libro.",
    startFree: "Empezar gratis",
    continueLearning: "Seguir aprendiendo",
    learningSetupKicker: "Configuracion inicial",
    learningSetupTitle: "Dinos tu idioma nativo y lo que quieres aprender",
    learningSetupDescription:
      "Guarda tu contexto para que la plataforma recomiende la ruta correcta, la primera leccion y el foco de comunicacion.",
    nativeLanguageField: "Cual es tu idioma nativo?",
    targetLanguageField: "Que idioma quieres aprender?",
    professionalTrackField: "Que perfil profesional te representa mejor?",
    learningGoalField: "Cual es tu objetivo principal de aprendizaje?",
    targetCourseField: "Con que ruta quieres empezar?",
    targetLessonField: "Que leccion deberiamos abrir primero?",
    selectedPathLabel: "Ruta seleccionada",
    selectedCourseLabel: "Ruta elegida",
    selectedLessonLabel: "Primera leccion",
    saveLearningPath: "Guardar ruta de aprendizaje",
    goToSelectedLesson: "Ir a la leccion elegida",
    goToSelectedCourse: "Abrir curso elegido",
    learningPathSaved: "Ruta de aprendizaje guardada para tu perfil.",
    personalSignatureLabel: "Enfoque personal",
    personalSignatureTitle: "Construido con humildad tecnica",
    personalSignatureDescription:
      "Un espacio sereno para mejorar paso a paso, hacer mejores preguntas y seguir aprendiendo sin ego.",
    whatYouUnlock: "Lo que desbloqueas",
    liveModulesReady: "4 modulos activos y arquitectura lista para una hoja de ruta de 12 clases.",
    persistentProgressFeature: "Progreso persistente, rachas, seguimiento de temas debiles y analitica por leccion.",
    aiAssistantFeature: "Endpoint de asistente IA con router gratuito para preguntas contextualizadas por leccion.",
    valuesKicker: "Lo que te representa",
    valuesTitle: "Un tono de producto basado en humildad",
    valuesDescription:
      "Menos ruido, mas intencion: esta interfaz prioriza claridad, respeto por el proceso de aprendizaje y avance constante.",
    humilityValueTitle: "Humildad",
    humilityValueDescription: "Aceptar lo que aun no sabes y convertir esa brecha en practica disciplinada.",
    clarityValueTitle: "Claridad",
    clarityValueDescription: "Explicar ideas de forma simple, sin lenguaje inflado ni complejidad innecesaria.",
    constancyValueTitle: "Constancia",
    constancyValueDescription: "Mejorar en cada sesion con pasos pequenos que se acumulan con el tiempo.",
    highlightLessonsTitle: "Lecciones de ingles orientadas a tech",
    highlightLessonsDescription:
      "Ingles para developers, escritura tecnica, comunicacion de incidentes y rutas guiadas por objetivo profesional.",
    highlightPracticeTitle: "Practica interactiva",
    highlightPracticeDescription:
      "Flujo de una pregunta por vez con puntaje, explicaciones y seguimiento por tema.",
    highlightWritingTitle: "Laboratorio oral y escrito",
    highlightWritingDescription:
      "Desafios de pronunciacion y feedback de correccion para escritura tecnica profesional.",
    highlightAiTitle: "Asistente IA por leccion",
    highlightAiDescription:
      "Pregunta dudas por leccion y recibe ayuda concreta usando un router gratuito de modelos.",
    openCourse: "Abrir curso",
    enrollNow: "Inscribirme",
    continueCourse: "Continuar curso",
    browseCourses: "Ver cursos",
    modules: "Modulos",
    lessonsCount: "Lecciones",
    estimatedHours: "Horas estimadas",
    track: "Perfil",
    goal: "Objetivo",
    courseOutcomes: "Resultados esperados",
    moduleOutcome: "Resultado del modulo",
    routeProgress: "Progreso de la ruta",
    published: "Publicado",
    comingSoon: "Proximamente",
    welcomeBack: "Bienvenido de nuevo",
    loginDescription: "Inicia sesion para continuar tu ruta de ingles tecnico con lecciones, practicas, writing lab y analitica.",
    email: "Correo",
    password: "Contrasena",
    signIn: "Entrar",
    signingIn: "Ingresando...",
    demoCredentials: "Credenciales demo",
    createOwnAccountHint:
      "Tambien puedes crear tu propia cuenta y seguir con el mismo panel y el historial de aprendizaje.",
    cloudAuthEnabledTitle: "Autenticacion cloud activa",
    cloudAuthEnabledDescription:
      "Este proyecto ya esta conectado a Supabase Auth. Ingresa con tu cuenta real y tus datos de aprendizaje quedaran sincronizados en la nube.",
    backToLanding: "Volver al inicio",
    fullName: "Nombre completo",
    createYourAccount: "Crea tu cuenta",
    registerDescription: "Configura tu perfil y empieza con modulos practicos de ingles tecnico para equipos de software.",
    role: "Rol",
    creatingAccount: "Creando cuenta...",
    whatAfterSignup: "Que pasa despues del registro?",
    afterSignupEnterDashboard: "Entras directo a tu panel.",
    afterSignupLocalProgress: "El progreso y las preferencias se guardan localmente y se sincronizan con Supabase cuando la autenticacion cloud esta activa.",
    afterSignupAskAi: "Puedes hacer preguntas de lecciones al asistente IA.",
    confirmEmailNotice: "Revisa tu correo para confirmar la cuenta antes de iniciar sesion.",
    alreadyHaveAccount: "Ya tienes cuenta?",
    validEmailError: "Usa un correo valido.",
    passwordMinError: "La contrasena debe tener al menos 6 caracteres.",
    nameMinError: "El nombre debe tener al menos 2 caracteres.",
    invalidCredentials: "Correo o contrasena invalidos.",
    emailAlreadyRegistered: "Este correo ya esta registrado.",
    emailPlaceholder: "tu@empresa.dev",
    securePasswordPlaceholder: "Tu contrasena segura",
    fullNamePlaceholder: "Tu nombre completo",
    passwordShortPlaceholder: "Minimo 6 caracteres",
    conversationDescription: "Practica conversaciones de trabajo y sintetiza respuestas con Microsoft VibeVoice.",
    conversationKicker: "Modulo conversacional",
    conversationTitle: "Coach conversacional de ingles tech",
    scenario: "Escenario",
    yourMessage: "Tu mensaje",
    yourMessagePlaceholder: "Ejemplo: investigue el timeout y encontre una race condition en el worker de cola.",
    sendToCoach: "Enviar al coach",
    coaching: "Corrigiendo...",
    speakMyMessage: "Hablar mi mensaje",
    startConversationPrompt: "Empieza la conversacion enviando tu primer mensaje.",
    improvedSentence: "Frase mejorada",
    coachLabel: "Coach",
    youLabel: "Tu",
    playWithVibeVoice: "Reproducir con VibeVoice",
    vibevoiceEngine: "Motor VibeVoice",
    vibevoiceEngineDescription: "Este modulo usa el servidor realtime websocket de Microsoft VibeVoice.",
    serverUrl: "URL del servidor",
    voicePreset: "Preset de voz",
    noVoicesAvailable: "No hay voces disponibles",
    lastGeneratedAudio: "Ultimo audio generado",
    coachUnavailable: "El servicio del coach no esta disponible ahora. Intenta de nuevo.",
    networkErrorCoach: "Error de red al generar la respuesta del coach.",
    vibevoiceUnavailable: "VibeVoice no esta disponible. Primero inicia el demo web de VibeVoice.",
    generatingAudio: "Generando audio con VibeVoice...",
    audioReady: "Audio listo.",
    noAudioGenerated: "No se genero audio. Revisa los logs del servidor VibeVoice.",
    couldNotGenerateVoice: "No se pudo generar la voz.",
    demoDeveloperName: "Desarrollador Demo"
  },
  pt: EN_TEXT,
  fr: EN_TEXT
};

const LEVEL_LABELS: Record<AppLanguage, Record<LessonLevel, string>> = {
  en: {
    intermediate: "Intermediate",
    "upper-intermediate": "Upper-intermediate",
    advanced: "Advanced"
  },
  es: {
    intermediate: "Intermedio",
    "upper-intermediate": "Intermedio alto",
    advanced: "Avanzado"
  },
  pt: {
    intermediate: "Intermediate",
    "upper-intermediate": "Upper-intermediate",
    advanced: "Advanced"
  },
  fr: {
    intermediate: "Intermediate",
    "upper-intermediate": "Upper-intermediate",
    advanced: "Advanced"
  }
};

const TOPIC_LABELS: Record<AppLanguage, Record<LessonTopic, string>> = {
  en: {
    "git-workflow": "Git workflow",
    "code-review": "Code review",
    debugging: "Debugging",
    "technical-writing": "Technical writing",
    "incident-response": "Incident response",
    deployment: "Deployment",
    apis: "APIs",
    testing: "Testing",
    "frontend-collaboration": "Frontend collaboration",
    "backend-communication": "Backend communication",
    "cloud-architecture": "Cloud architecture"
  },
  es: {
    "git-workflow": "Flujo Git",
    "code-review": "Revision de codigo",
    debugging: "Depuracion",
    "technical-writing": "Escritura tecnica",
    "incident-response": "Respuesta a incidentes",
    deployment: "Despliegue",
    apis: "APIs",
    testing: "Testing",
    "frontend-collaboration": "Colaboracion frontend",
    "backend-communication": "Comunicacion backend",
    "cloud-architecture": "Arquitectura cloud"
  },
  pt: {
    "git-workflow": "Git workflow",
    "code-review": "Code review",
    debugging: "Debugging",
    "technical-writing": "Technical writing",
    "incident-response": "Incident response",
    deployment: "Deployment",
    apis: "APIs",
    testing: "Testing",
    "frontend-collaboration": "Frontend collaboration",
    "backend-communication": "Backend communication",
    "cloud-architecture": "Cloud architecture"
  },
  fr: {
    "git-workflow": "Git workflow",
    "code-review": "Code review",
    debugging: "Debugging",
    "technical-writing": "Technical writing",
    "incident-response": "Incident response",
    deployment: "Deployment",
    apis: "APIs",
    testing: "Testing",
    "frontend-collaboration": "Frontend collaboration",
    "backend-communication": "Backend communication",
    "cloud-architecture": "Cloud architecture"
  }
};

const TRACK_LABELS: Record<AppLanguage, Record<ProfessionalTrack, string>> = {
  en: {
    developer: "Developer",
    writing: "Technical writing",
    conversation: "Conversation"
  },
  es: {
    developer: "Developer",
    writing: "Escritura tecnica",
    conversation: "Conversacion"
  },
  pt: {
    developer: "Developer",
    writing: "Technical writing",
    conversation: "Conversation"
  },
  fr: {
    developer: "Developer",
    writing: "Technical writing",
    conversation: "Conversation"
  }
};

const GOAL_LABELS: Record<AppLanguage, Record<LearningGoal, string>> = {
  en: {
    "collaborate-at-work": "Collaborate at work",
    "write-professionally": "Write professionally",
    "speak-confidently": "Speak confidently",
    "understand-technical-docs": "Understand technical docs",
    "prepare-interviews": "Prepare interviews"
  },
  es: {
    "collaborate-at-work": "Colaborar en el trabajo",
    "write-professionally": "Escribir profesionalmente",
    "speak-confidently": "Hablar con confianza",
    "understand-technical-docs": "Entender documentacion tecnica",
    "prepare-interviews": "Preparar entrevistas"
  },
  pt: {
    "collaborate-at-work": "Collaborate at work",
    "write-professionally": "Write professionally",
    "speak-confidently": "Speak confidently",
    "understand-technical-docs": "Understand technical docs",
    "prepare-interviews": "Prepare interviews"
  },
  fr: {
    "collaborate-at-work": "Collaborate at work",
    "write-professionally": "Write professionally",
    "speak-confidently": "Speak confidently",
    "understand-technical-docs": "Understand technical docs",
    "prepare-interviews": "Prepare interviews"
  }
};

const COURSE_STATUS_LABELS: Record<AppLanguage, Record<CourseStatus, string>> = {
  en: { published: "Published", "coming-soon": "Coming soon" },
  es: { published: "Publicado", "coming-soon": "Proximamente" },
  pt: { published: "Published", "coming-soon": "Coming soon" },
  fr: { published: "Published", "coming-soon": "Coming soon" }
};

const ROLE_LABELS: Record<AppLanguage, Record<AuthRole, string>> = {
  en: { learner: "Learner", mentor: "Mentor", admin: "Admin" },
  es: { learner: "Estudiante", mentor: "Mentor", admin: "Admin" },
  pt: { learner: "Learner", mentor: "Mentor", admin: "Admin" },
  fr: { learner: "Learner", mentor: "Mentor", admin: "Admin" }
};

export function getUiText(language: AppLanguage, key: UiTextKey) {
  return UI_TEXT[language][key] ?? UI_TEXT.en[key];
}

export function getLevelLabel(language: AppLanguage, level: LessonLevel) {
  return LEVEL_LABELS[language][level] ?? LEVEL_LABELS.en[level];
}

export function getTopicLabel(language: AppLanguage, topic: LessonTopic) {
  return TOPIC_LABELS[language][topic] ?? TOPIC_LABELS.en[topic];
}

export function getRoleLabel(language: AppLanguage, role: AuthRole) {
  return ROLE_LABELS[language][role] ?? ROLE_LABELS.en[role];
}

export function getTrackLabel(language: AppLanguage, track: ProfessionalTrack) {
  return TRACK_LABELS[language][track] ?? TRACK_LABELS.en[track];
}

export function getGoalLabel(language: AppLanguage, goal: LearningGoal) {
  return GOAL_LABELS[language][goal] ?? GOAL_LABELS.en[goal];
}

export function getCourseStatusLabel(language: AppLanguage, status: CourseStatus) {
  return COURSE_STATUS_LABELS[language][status] ?? COURSE_STATUS_LABELS.en[status];
}

export function formatDays(language: AppLanguage, count: number) {
  if (language === "es") return `${count} dia(s)`;
  return `${count} day(s)`;
}

export function formatAttempts(language: AppLanguage, count: number) {
  return `${count} ${getUiText(language, "attempts")}`;
}



