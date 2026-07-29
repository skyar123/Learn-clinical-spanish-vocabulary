import { useState, useEffect, useRef, useMemo } from "react";

/*
  SENDERO CLINICO
  A Duolingo-style trainer for clinical Spanish, built from the
  PASEO Salud Mental workbook (Kohrt, 2022). Vocabulary and phrases
  are drawn from the workbook's "Vocabulario util" sections.
*/

// ---------- DATA ----------

const UNITS = [
  {
    id: "roles",
    title: "Roles y servicios",
    subtitle: "Who's who in mental health care",
    icon: "🧭",
    color: "#3FA65C",
    dark: "#2E7D45",
    items: [
      { es: "el terapeuta", en: "therapist", alt: ["la terapeuta", "terapeuta"] },
      { es: "el consejero", en: "counselor", alt: ["la consejera", "consejero", "consejera"] },
      { es: "el trabajador social", en: "social worker", alt: ["la trabajadora social", "trabajador social", "trabajadora social"] },
      { es: "el psicólogo", en: "psychologist", alt: ["la psicóloga", "psicologo", "psicologa"] },
      { es: "el coordinador de casos", en: "case manager", alt: ["la coordinadora de casos", "coordinador de casos"] },
      { es: "el consejero escolar", en: "school counselor", alt: ["la consejera escolar", "consejero escolar"] },
      { es: "la entrevista inicial", en: "intake", alt: ["entrevista inicial"] },
      { es: "la terapia familiar", en: "family therapy", alt: ["terapia familiar"] },
      { es: "la terapia de juego", en: "play therapy", alt: ["terapia de juego"] },
      { es: "la historia clínica", en: "clinical history", alt: ["historia clinica"] },
      { es: "la terapia de pareja", en: "couples therapy", alt: ["terapia de pareja"] },
      { es: "el manejo de medicamentos", en: "medication management", alt: ["manejo de medicamentos"] },
    ],
  },
  {
    id: "sistemas",
    title: "Sistemas y protección",
    subtitle: "Child protection and allied systems",
    icon: "🛡️",
    color: "#2E7DD1",
    dark: "#1F5C9E",
    items: [
      { es: "la protección de menores", en: "child protection", alt: ["proteccion de menores"] },
      { es: "la negligencia", en: "neglect", alt: ["negligencia", "el descuido", "descuido"] },
      { es: "el abuso", en: "abuse", alt: ["abuso"] },
      { es: "el cuidado de crianza", en: "foster care", alt: ["cuidado de crianza", "cuidado de crianza temporal"] },
      { es: "la familia de crianza", en: "foster family", alt: ["familia de crianza", "familia sustituta"] },
      { es: "el tutor", en: "guardian", alt: ["la tutora", "tutor", "tutora", "el guardián", "guardian"] },
      { es: "la corte", en: "court", alt: ["corte"] },
      { es: "el juez", en: "judge", alt: ["la jueza", "juez", "jueza"] },
      { es: "obligado a reportar", en: "mandated reporter", alt: ["obligada a reportar", "obligado a informar"] },
      { es: "los servicios de apoyo familiar", en: "family support services", alt: ["servicios de apoyo familiar"] },
      { es: "la defensoría", en: "advocacy", alt: ["defensoria"] },
      { es: "la investigación", en: "investigation", alt: ["investigacion"] },
    ],
  },
  {
    id: "confi",
    title: "La confidencialidad",
    subtitle: "Consent and privacy, word by word",
    icon: "🔐",
    color: "#8B5CB8",
    dark: "#6B4291",
    items: [
      { es: "la privacidad", en: "privacy", alt: ["privacidad"] },
      { es: "la confidencialidad", en: "confidentiality", alt: ["confidencialidad"] },
      { es: "los derechos del paciente", en: "patient rights", alt: ["derechos del paciente"] },
      { es: "el permiso", en: "permission", alt: ["permiso", "la autorización", "autorizacion"] },
      { es: "la divulgación", en: "disclosure", alt: ["divulgacion"] },
      { es: "el consentimiento", en: "consent", alt: ["consentimiento"] },
      { es: "Todo lo que usted dice aquí es confidencial.", en: "Everything you say here is confidential.", phrase: true },
      { es: "Las leyes protegen su privacidad.", en: "The laws protect your privacy.", phrase: true },
      { es: "Hay unas excepciones a la confidencialidad.", en: "There are some exceptions to confidentiality.", phrase: true },
      { es: "Estas reglas son para protegerlo a usted.", en: "These rules are there to protect you.", phrase: true },
      { es: "Tengo que buscar asistencia.", en: "I have to seek assistance.", phrase: true },
      { es: "No puedo divulgar nada sin su permiso.", en: "I cannot disclose anything without your permission.", phrase: true },
    ],
  },
  {
    id: "sentimientos",
    title: "Los sentimientos",
    subtitle: "The feelings families bring you",
    icon: "💛",
    color: "#F2A93B",
    dark: "#C4821F",
    items: [
      { es: "la alegría", en: "joy", alt: ["alegria"] },
      { es: "la tristeza", en: "sadness", alt: ["tristeza"] },
      { es: "el enojo", en: "anger", alt: ["enojo", "la ira", "ira"] },
      { es: "el miedo", en: "fear", alt: ["miedo"] },
      { es: "la culpa", en: "guilt", alt: ["culpa"] },
      { es: "la vergüenza", en: "shame", alt: ["verguenza"] },
      { es: "la esperanza", en: "hope", alt: ["esperanza"] },
      { es: "la soledad", en: "loneliness", alt: ["soledad"] },
      { es: "la preocupación", en: "worry", alt: ["preocupacion"] },
      { es: "el cariño", en: "affection", alt: ["carino", "el afecto", "afecto"] },
      { es: "la frustración", en: "frustration", alt: ["frustracion"] },
      { es: "la ternura", en: "tenderness", alt: ["ternura"] },
    ],
  },
  {
    id: "empatia",
    title: "Frases de empatía",
    subtitle: "Active listening, out loud",
    icon: "🫶",
    color: "#E0704A",
    dark: "#B4512F",
    items: [
      { es: "Cuénteme más.", en: "Tell me more.", phrase: true },
      { es: "Ya veo.", en: "I see.", phrase: true },
      { es: "Siga, por favor.", en: "Please continue.", phrase: true },
      { es: "Lo lamento mucho.", en: "I am very sorry.", phrase: true },
      { es: "Ayúdeme a entender.", en: "Help me understand.", phrase: true },
      { es: "¿Me lo podría repetir?", en: "Could you repeat that for me?", phrase: true },
      { es: "¿Me puede aclarar eso, por favor?", en: "Can you clarify that for me, please?", phrase: true },
      { es: "¿Podría hablar más despacio?", en: "Could you speak more slowly?", phrase: true },
      { es: "Me imagino que habrá sido difícil para usted.", en: "I imagine that must have been hard for you.", phrase: true },
      { es: "Eso debe de haberle conmovido bastante.", en: "That must have really affected you.", phrase: true },
      { es: "Parece que esa persona era muy importante para usted.", en: "It sounds like that person was very important to you.", phrase: true },
      { es: "¿Me explico?", en: "Am I making sense?", phrase: true },
    ],
  },
  {
    id: "riesgo",
    title: "Evaluación de riesgo",
    subtitle: "Safety language you must not fumble",
    icon: "🧯",
    color: "#D14D57",
    dark: "#A83641",
    items: [
      { es: "la crisis", en: "crisis", alt: ["crisis"] },
      { es: "los pensamientos suicidas", en: "suicidal thoughts", alt: ["pensamientos suicidas"] },
      { es: "lastimarse", en: "to hurt oneself", alt: ["hacerse daño"] },
      { es: "el intento de suicidio", en: "suicide attempt", alt: ["intento de suicidio"] },
      { es: "escuchar voces", en: "to hear voices", alt: ["oír voces", "oir voces"] },
      { es: "lastimar a otros", en: "to hurt others", alt: [] },
      { es: "el peligro a sí mismo", en: "danger to self", alt: ["peligro a si mismo"] },
      { es: "el plan de crisis", en: "crisis plan", alt: ["plan de crisis"] },
      { es: "la valentía", en: "courage", alt: ["valentia"] },
      { es: "Gracias por compartir esto conmigo.", en: "Thank you for sharing this with me.", phrase: true },
      { es: "Estoy aquí para ayudarle.", en: "I am here to help you.", phrase: true },
      { es: "Vamos a mirar este formulario juntos.", en: "We are going to look at this form together.", phrase: true },
    ],
  },
  {
    id: "depresion",
    title: "La depresión",
    subtitle: "Mood, symptoms, and thought styles",
    icon: "🌧️",
    color: "#5B6ABF",
    dark: "#3F4C99",
    items: [
      { es: "la depresión", en: "depression", alt: ["depresion"] },
      { es: "el estado de ánimo", en: "mood", alt: ["estado de animo"] },
      { es: "deprimido", en: "depressed", alt: ["deprimida"] },
      { es: "la pérdida de interés", en: "loss of interest", alt: ["perdida de interes"] },
      { es: "sin esperanza", en: "hopeless", alt: [] },
      { es: "el apetito", en: "appetite", alt: ["apetito"] },
      { es: "los pensamientos negativos", en: "negative thoughts", alt: ["pensamientos negativos"] },
      { es: "los pensamientos positivos", en: "positive thoughts", alt: ["pensamientos positivos"] },
      { es: "todo o nada", en: "all or nothing", alt: [] },
      { es: "el filtro mental", en: "mental filter", alt: ["filtro mental"] },
      { es: "sentirse mejor", en: "to feel better", alt: [] },
      { es: "mejorar", en: "to improve", alt: [] },
    ],
  },
  {
    id: "ansiedad",
    title: "La ansiedad",
    subtitle: "Worry and the body's alarms",
    icon: "🌀",
    color: "#2FA3A0",
    dark: "#1F7B79",
    items: [
      { es: "la ansiedad", en: "anxiety", alt: ["ansiedad"] },
      { es: "preocuparse", en: "to worry", alt: [] },
      { es: "la ansiedad por separación", en: "separation anxiety", alt: ["ansiedad por separacion"] },
      { es: "el ataque de pánico", en: "panic attack", alt: ["ataque de panico"] },
      { es: "la fobia", en: "phobia", alt: ["fobia"] },
      { es: "el dolor de estómago", en: "stomachache", alt: ["dolor de estomago"] },
      { es: "el dolor de cabeza", en: "headache", alt: ["dolor de cabeza"] },
      { es: "las pesadillas", en: "nightmares", alt: ["pesadillas"] },
      { es: "la tensión muscular", en: "muscle tension", alt: ["tension muscular"] },
      { es: "la respiración", en: "breathing", alt: ["respiracion"] },
      { es: "relajarse", en: "to relax", alt: [] },
      { es: "la exposición", en: "exposure", alt: ["exposicion"] },
    ],
  },
  {
    id: "trauma",
    title: "El trauma",
    subtitle: "TF-CBT and nervous system words",
    icon: "🌊",
    color: "#4B77BE",
    dark: "#345A96",
    items: [
      { es: "el trauma", en: "trauma", alt: ["trauma"] },
      { es: "el desencadenante", en: "trigger", alt: ["desencadenante", "el disparador", "disparador"] },
      { es: "la evitación", en: "avoidance", alt: ["evitacion"] },
      { es: "la hipervigilancia", en: "hypervigilance", alt: ["hipervigilancia"] },
      { es: "los recuerdos súbitos", en: "flashbacks", alt: ["recuerdos subitos"] },
      { es: "la disociación", en: "dissociation", alt: ["disociacion"] },
      { es: "las estrategias de anclaje", en: "grounding strategies", alt: ["estrategias de anclaje"] },
      { es: "la ventana de tolerancia", en: "window of tolerance", alt: ["ventana de tolerancia"] },
      { es: "la seguridad", en: "safety", alt: ["seguridad"] },
      { es: "la narrativa del trauma", en: "trauma narrative", alt: ["narrativa del trauma", "la historia del trauma"] },
      { es: "sentirse seguro", en: "to feel safe", alt: ["sentirse segura"] },
      { es: "las pesadillas", en: "nightmares", alt: ["pesadillas", "los sueños malos"] },
    ],
  },
  {
    id: "crianza",
    title: "Crianza positiva",
    subtitle: "Parent coaching, en español",
    icon: "🌱",
    color: "#6FA83C",
    dark: "#527E29",
    items: [
      { es: "el tiempo de calidad", en: "quality time", alt: ["tiempo de calidad"] },
      { es: "elogiar", en: "to praise", alt: [] },
      { es: "el elogio", en: "praise", alt: ["elogio"] },
      { es: "los reforzadores", en: "reinforcers", alt: ["reforzadores"] },
      { es: "las consecuencias positivas", en: "positive consequences", alt: ["consecuencias positivas"] },
      { es: "el sistema de puntos", en: "point system", alt: ["sistema de puntos"] },
      { es: "la autoestima", en: "self-esteem", alt: ["autoestima"] },
      { es: "las habilidades de afrontamiento", en: "coping skills", alt: ["habilidades de afrontamiento"] },
      { es: "la confianza", en: "trust", alt: ["confianza"] },
      { es: "portarse bien", en: "to behave well", alt: [] },
      { es: "las rutinas", en: "routines", alt: ["rutinas"] },
      { es: "jugar con sus niños", en: "to play with your children", alt: [] },
    ],
  },
  {
    id: "llamada",
    title: "La primera llamada",
    subtitle: "The first phone call, line by line",
    icon: "📞",
    color: "#C75B8A",
    dark: "#9E3F6B",
    items: [
      { es: "Yo me llamo Skylar.", en: "My name is Skylar.", phrase: true },
      { es: "Estoy llamando de la clínica.", en: "I am calling from the clinic.", phrase: true },
      { es: "Recibí una referencia para usted.", en: "I received a referral for you.", phrase: true },
      { es: "¿Para qué busca terapia?", en: "What are you seeking therapy for?", phrase: true },
      { es: "¿Cuándo puede venir usted?", en: "When are you able to come in?", phrase: true },
      { es: "Estoy en la oficina los martes.", en: "I am in the office on Tuesdays.", phrase: true },
      { es: "Tengo disponible a las diez.", en: "I have an opening at ten.", phrase: true },
      { es: "Le veo el jueves.", en: "I will see you on Thursday.", phrase: true },
      { es: "Favor de llamarme lo más pronto posible.", en: "Please call me as soon as possible.", phrase: true },
      { es: "¿Tiene que cancelar la cita?", en: "Do you have to cancel the appointment?", phrase: true },
      { es: "Le puedo ayudar a encontrar un lugar apropiado.", en: "I can help you find an appropriate place.", phrase: true },
      { es: "¿Me podría dar su correo electrónico?", en: "Could you give me your email?", phrase: true },
    ],
  },
  {
    id: "terapias",
    title: "Terapias y servicios",
    subtitle: "Therapy types and treatment settings",
    icon: "🧩",
    color: "#2C8C99",
    dark: "#1E6873",
    items: [
      { es: "la terapia grupal", en: "group therapy", alt: ["terapia grupal"] },
      { es: "la terapia cognitivo conductual", en: "cognitive behavioral therapy", alt: ["terapia cognitivo conductual", "terapia cognitiva conductual"] },
      { es: "la terapia conductual dialéctica", en: "dialectical behavior therapy", alt: ["terapia conductual dialectica"] },
      { es: "la terapia narrativa", en: "narrative therapy", alt: ["terapia narrativa"] },
      { es: "la terapia interpersonal", en: "interpersonal therapy", alt: ["terapia interpersonal"] },
      { es: "la entrevista motivacional", en: "motivational interviewing", alt: ["entrevista motivacional"] },
      { es: "la terapia centrada en la solución", en: "solution-focused therapy", alt: ["terapia centrada en la solucion"] },
      { es: "la evaluación psicológica", en: "psychological evaluation", alt: ["evaluacion psicologica"] },
      { es: "la evaluación psiquiátrica", en: "psychiatric evaluation", alt: ["evaluacion psiquiatrica"] },
      { es: "la clínica ambulatoria", en: "outpatient clinic", alt: ["clinica ambulatoria"] },
      { es: "el centro residencial", en: "residential center", alt: ["centro residencial", "el programa residencial"] },
      { es: "la escuela terapéutica", en: "therapeutic day school", alt: ["escuela terapeutica"] },
    ],
  },
  {
    id: "diagnosticos",
    title: "Los diagnósticos",
    subtitle: "Diagnoses you will read on a chart",
    icon: "📋",
    color: "#B5843A",
    dark: "#8A6326",
    items: [
      { es: "el trastorno de adaptación", en: "adjustment disorder", alt: ["trastorno de adaptacion"] },
      { es: "el trastorno de ansiedad social", en: "social anxiety disorder", alt: ["trastorno de ansiedad social"] },
      { es: "el mutismo selectivo", en: "selective mutism", alt: ["mutismo selectivo"] },
      { es: "el trastorno de pánico", en: "panic disorder", alt: ["trastorno de panico"] },
      { es: "el trastorno del espectro autista", en: "autism spectrum disorder", alt: ["trastorno del espectro autista", "trastorno del espectro del autismo"] },
      { es: "el trastorno bipolar", en: "bipolar disorder", alt: ["trastorno bipolar"] },
      { es: "el trastorno obsesivo compulsivo", en: "obsessive compulsive disorder", alt: ["trastorno obsesivo compulsivo"] },
      { es: "el trastorno de estrés postraumático", en: "post-traumatic stress disorder", alt: ["trastorno de estres postraumatico"] },
      { es: "el trastorno de apego reactivo", en: "reactive attachment disorder", alt: ["trastorno de apego reactivo"] },
      { es: "la discapacidad intelectual", en: "intellectual disability", alt: ["discapacidad intelectual"] },
      { es: "el trastorno negativista desafiante", en: "oppositional defiant disorder", alt: ["trastorno negativista desafiante"] },
      { es: "el trastorno de la conducta", en: "conduct disorder", alt: ["trastorno de la conducta"] },
    ],
  },
  {
    id: "conducta",
    title: "La conducta",
    subtitle: "Agitation and behavior words",
    icon: "⚡",
    color: "#C0553E",
    dark: "#973E2C",
    items: [
      { es: "la agresión", en: "aggression", alt: ["agresion"] },
      { es: "agitado", en: "agitated", alt: ["agitada"] },
      { es: "desafiante", en: "defiant", alt: [] },
      { es: "hiperactivo", en: "hyperactive", alt: ["hiperactiva"] },
      { es: "la hiperactividad", en: "hyperactivity", alt: ["hiperactividad"] },
      { es: "impulsivo", en: "impulsive", alt: ["impulsiva"] },
      { es: "letárgico", en: "lethargic", alt: ["letargica", "letargico"] },
      { es: "fuera de control", en: "out of control", alt: [] },
      { es: "el berrinche", en: "tantrum", alt: ["berrinche", "la rabieta", "rabieta"] },
      { es: "reactivo", en: "reactive", alt: ["reactiva"] },
      { es: "alterado", en: "upset", alt: ["alterada", "disgustado", "disgustada"] },
      { es: "estancado", en: "stuck", alt: ["estancada"] },
    ],
  },
  {
    id: "coordinacion",
    title: "Coordinación de cuidado",
    subtitle: "Care coordination language",
    icon: "🔗",
    color: "#3F8F7A",
    dark: "#2C6858",
    items: [
      { es: "la atención primaria", en: "primary care", alt: ["atencion primaria"] },
      { es: "el equipo multidisciplinario", en: "multidisciplinary team", alt: ["equipo multidisciplinario"] },
      { es: "la coordinación de servicios", en: "care coordination", alt: ["coordinacion de servicios"] },
      { es: "el equipo de salud", en: "care team", alt: ["equipo de salud"] },
      { es: "la admisión", en: "admission", alt: ["admision"] },
      { es: "la consulta", en: "consultation", alt: ["consulta"] },
      { es: "el triaje", en: "triage", alt: ["triaje"] },
      { es: "la cita de seguimiento", en: "follow-up appointment", alt: ["cita de seguimiento"] },
      { es: "dar de alta", en: "to discharge", alt: [] },
      { es: "la atención hospitalaria", en: "inpatient care", alt: ["atencion hospitalaria"] },
      { es: "la atención ambulatoria", en: "outpatient care", alt: ["atencion ambulatoria"] },
      { es: "el colega", en: "colleague", alt: ["la colega", "colega"] },
    ],
  },
  {
    id: "educacion",
    title: "Educación especial",
    subtitle: "Special education and disability categories",
    icon: "🎒",
    color: "#7E5AA6",
    dark: "#5E3F80",
    items: [
      { es: "el autismo", en: "autism", alt: ["autismo"] },
      { es: "el impedimento auditivo", en: "auditory impairment", alt: ["impedimento auditivo", "la discapacidad auditiva"] },
      { es: "el impedimento visual", en: "visual impairment", alt: ["impedimento visual"] },
      { es: "el impedimento ortopédico", en: "orthopedic impairment", alt: ["impedimento ortopedico"] },
      { es: "la lesión cerebral traumática", en: "traumatic brain injury", alt: ["lesion cerebral traumatica"] },
      { es: "el impedimento del habla o lenguaje", en: "speech or language impairment", alt: ["impedimento del habla o lenguaje"] },
      { es: "la sordera", en: "deafness", alt: ["sordera"] },
      { es: "la sordoceguera", en: "deaf-blindness", alt: ["sordoceguera"] },
      { es: "el trastorno emocional", en: "emotional disturbance", alt: ["trastorno emocional"] },
      { es: "el retraso general del desarrollo", en: "global developmental delay", alt: ["retraso general del desarrollo"] },
      { es: "el trastorno del lenguaje", en: "language disorder", alt: ["trastorno del lenguaje"] },
      { es: "el trastorno específico del aprendizaje", en: "specific learning disability", alt: ["trastorno especifico del aprendizaje"] },
    ],
  },
  {
    id: "acoso",
    title: "El acoso escolar",
    subtitle: "Bullying and peer harassment",
    icon: "🚸",
    color: "#57708A",
    dark: "#3E566E",
    items: [
      { es: "el acoso escolar", en: "bullying", alt: ["acoso escolar", "el bullying"] },
      { es: "maltratar", en: "to mistreat", alt: [] },
      { es: "los pares", en: "peers", alt: ["los compañeros", "pares"] },
      { es: "hostigar", en: "to harass", alt: ["acosar"] },
      { es: "ridiculizar", en: "to ridicule", alt: [] },
      { es: "el menosprecio", en: "belittling", alt: ["menosprecio", "los menosprecios"] },
      { es: "los chismes", en: "gossip", alt: ["el chisme", "chismes"] },
      { es: "los agresores pasivos", en: "passive aggressors", alt: ["agresores pasivos"] },
      { es: "los cómplices", en: "accomplices", alt: ["el cómplice", "complices"] },
      { es: "los secuaces", en: "followers", alt: ["secuaces"] },
      { es: "denigrar", en: "to denigrate", alt: [] },
      { es: "las destrezas de seguridad", en: "safety skills", alt: ["destrezas de seguridad"] },
    ],
  },
];

const BUILD_DISTRACTORS = [
  "muy", "casa", "hoy", "gracias", "poco", "tiempo", "siempre",
  "nada", "bien", "niño", "agua", "luego", "cosa", "grande",
];

// ---------- HELPERS ----------

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const sample = (arr, n, excludeFn) => {
  const pool = excludeFn ? arr.filter((x) => !excludeFn(x)) : [...arr];
  return shuffle(pool).slice(0, n);
};

const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:'"()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const stripArticle = (s) =>
  s.replace(/^(el|la|los|las|un|una|unos|unas)\s+/i, "");

const answerMatches = (input, item) => {
  const guess = normalize(input);
  if (!guess) return false;
  const accepted = [item.es, ...(item.alt || [])];
  return accepted.some((a) => {
    const na = normalize(a);
    return guess === na || guess === normalize(stripArticle(a)) || stripArticle(guess) === normalize(stripArticle(a));
  });
};

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const isYesterday = (key) => {
  if (!key) return false;
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return key === y;
};

// Speech: pronounce Spanish text if a voice exists. Fails silently.
let cachedVoice = null;
const speak = (text) => {
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (!cachedVoice) {
      const voices = window.speechSynthesis.getVoices() || [];
      cachedVoice =
        voices.find((v) => /^es[-_](MX|US|419)/i.test(v.lang)) ||
        voices.find((v) => /^es/i.test(v.lang)) ||
        null;
    }
    if (cachedVoice) u.voice = cachedVoice;
    u.lang = cachedVoice ? cachedVoice.lang : "es-MX";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  } catch (e) {
    /* no audio available */
  }
};

// Tiny synth for feedback sounds. Fails silently.
let audioCtx = null;
const tone = (freqs, dur = 0.12, type = "sine", gainVal = 0.08) => {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.setValueAtTime(gainVal, audioCtx.currentTime + i * dur);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (i + 1) * dur + 0.05);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start(audioCtx.currentTime + i * dur);
      o.stop(audioCtx.currentTime + (i + 1) * dur + 0.06);
    });
  } catch (e) {
    /* silent */
  }
};
const playCorrect = () => tone([523.25, 659.25, 783.99], 0.09, "sine", 0.07);
const playWrong = () => tone([196, 155.56], 0.16, "triangle", 0.06);
const playFinish = () => tone([523.25, 659.25, 783.99, 1046.5], 0.11, "sine", 0.07);

// ---------- EXERCISE GENERATION ----------

const ALL_ITEMS = UNITS.flatMap((u) => u.items.map((it) => ({ ...it, unitId: u.id })));

const mcqOptions = (item, key, unit) => {
  const poolLocal = unit.items.filter((x) => x.en !== item.en);
  const poolGlobal = ALL_ITEMS.filter((x) => x.en !== item.en && (key === "es" ? !x.phrase === !item.phrase : true));
  let opts = sample(poolLocal, 3);
  if (opts.length < 3) opts = [...opts, ...sample(poolGlobal, 3 - opts.length, (x) => opts.some((o) => o.en === x.en))];
  return shuffle([item, ...opts]);
};

const makeBuild = (item) => {
  const tokens = item.es.split(" ");
  const extra = sample(BUILD_DISTRACTORS, Math.min(3, Math.max(2, 8 - tokens.length)), (w) =>
    tokens.some((t) => normalize(t) === normalize(w))
  );
  return {
    type: "build",
    item,
    target: tokens,
    tiles: shuffle([...tokens, ...extra].map((w, i) => ({ id: i + "-" + w, word: w }))),
  };
};

const makeExercise = (item, unit, idx) => {
  if (item.phrase) {
    return idx % 2 === 0 ? makeBuild(item) : { type: "mcq_es_en", item, options: mcqOptions(item, "en", unit) };
  }
  const cycle = ["mcq_en_es", "listen_pick", "mcq_es_en", "type_es"];
  const type = cycle[idx % 4];
  if (type === "type_es") return { type, item };
  if (type === "listen_pick") return { type, item, options: mcqOptions(item, "en", unit) };
  return { type, item, options: mcqOptions(item, type === "mcq_en_es" ? "es" : "en", unit) };
};

const makeMatch = (items) => {
  const seen = new Set();
  const unique = items.filter((x) => {
    if (x.phrase || seen.has(x.en)) return false;
    seen.add(x.en);
    return true;
  });
  const pairs = sample(unique, 5);
  if (pairs.length < 4) return null;
  return {
    type: "match",
    pairs,
    left: shuffle(pairs.map((p) => ({ key: p.en, label: p.es }))),
    right: shuffle(pairs.map((p) => ({ key: p.en, label: p.en }))),
  };
};

const buildLessonQueue = (unit, lessonIdx) => {
  let slice;
  if (lessonIdx === 0) slice = unit.items.slice(0, 6);
  else if (lessonIdx === 1) slice = unit.items.slice(6, 12);
  else slice = sample(unit.items, 8);
  const q = shuffle(slice).map((item, i) => makeExercise(item, unit, i));
  const match = makeMatch(slice);
  if (match) q.splice(Math.min(3, q.length), 0, match);
  return q;
};

const buildPracticeQueue = (unlockedUnits) => {
  const pool = unlockedUnits.flatMap((u) => u.items.map((it) => ({ it, u })));
  const picked = sample(pool, 8);
  const q = picked.map(({ it, u }, i) => makeExercise(it, u, i));
  const match = makeMatch(picked.map((p) => p.it));
  if (match) q.splice(4, 0, match);
  return q;
};

// ---------- PERSISTENCE ----------

const STORAGE_KEY = "sendero-clinico-v1";
const DEFAULT_PROGRESS = { xp: 0, streak: 0, lastDay: null, freeMode: false, units: {} };

const loadProgress = async () => {
  try {
    const res = await window.storage.get(STORAGE_KEY);
    if (res && res.value) return { ...DEFAULT_PROGRESS, ...JSON.parse(res.value) };
  } catch (e) {
    /* first visit or storage unavailable */
  }
  return { ...DEFAULT_PROGRESS };
};

const saveProgress = async (p) => {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(p));
  } catch (e) {
    /* keep going in memory */
  }
};

// ---------- SMALL COMPONENTS ----------

function SpeakBtn({ text, color }) {
  return (
    <button className="speak-btn" style={{ color: color || "#2E7DD1" }} onClick={() => speak(text)} aria-label="Listen">
      🔊
    </button>
  );
}

function Chunky({ children, onClick, color = "#3FA65C", dark = "#2E7D45", disabled, ghost, full, small }) {
  return (
    <button
      className={"chunky" + (ghost ? " ghost" : "") + (full ? " full" : "") + (small ? " small" : "")}
      style={
        ghost
          ? { color: color, borderColor: "#E3E8E0" }
          : { background: color, boxShadow: `0 4px 0 ${dark}`, color: "#fff" }
      }
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function TopBar({ progress, total, hearts, onQuit }) {
  const pct = total ? Math.round((progress / total) * 100) : 0;
  return (
    <div className="lesson-top">
      <button className="quit" onClick={onQuit} aria-label="Exit lesson">✕</button>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: pct + "%" }} />
      </div>
      <div className="hearts">❤️ <b>{hearts}</b></div>
    </div>
  );
}

// ---------- EXERCISE RENDERERS ----------

function McqExercise({ ex, selected, onSelect, locked, esToEn }) {
  return (
    <div className="ex-wrap">
      <div className="ex-prompt-label">{esToEn ? "What does this mean?" : "¿Cómo se dice en español?"}</div>
      <div className="ex-prompt">
        {esToEn && <SpeakBtn text={ex.item.es} />}
        <span>{esToEn ? ex.item.es : ex.item.en}</span>
      </div>
      <div className="opt-list">
        {ex.options.map((opt, i) => (
          <button
            key={i}
            className={"opt" + (selected === i ? " sel" : "")}
            disabled={locked}
            onClick={() => {
              onSelect(i);
              if (esToEn === false) speak(opt.es);
            }}
          >
            <span className="opt-num">{i + 1}</span>
            {esToEn ? opt.en : opt.es}
          </button>
        ))}
      </div>
    </div>
  );
}

function ListenExercise({ ex, selected, onSelect, locked }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { speak(ex.item.es); }, []);
  return (
    <div className="ex-wrap">
      <div className="ex-prompt-label">Listen, then choose the meaning</div>
      <div className="listen-row">
        <button className="listen-btn" onClick={() => speak(ex.item.es)} aria-label="Play audio">🔊</button>
        {revealed ? (
          <div className="listen-reveal">{ex.item.es}</div>
        ) : (
          <button className="listen-cant" onClick={() => setRevealed(true)}>No puedo escuchar ahora</button>
        )}
      </div>
      <div className="opt-list">
        {ex.options.map((opt, i) => (
          <button
            key={i}
            className={"opt" + (selected === i ? " sel" : "")}
            disabled={locked}
            onClick={() => onSelect(i)}
          >
            <span className="opt-num">{i + 1}</span>
            {opt.en}
          </button>
        ))}
      </div>
    </div>
  );
}

function TypeExercise({ ex, value, onChange, locked }) {
  return (
    <div className="ex-wrap">
      <div className="ex-prompt-label">Type it in Spanish</div>
      <div className="ex-prompt"><span>{ex.item.en}</span></div>
      <textarea
        className="type-box"
        placeholder="Escribe en español..."
        value={value}
        disabled={locked}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
      />
      <div className="hint">Accents optional. The article (el / la) is too.</div>
    </div>
  );
}

function BuildExercise({ ex, picked, setPicked, locked }) {
  const pickedIds = new Set(picked.map((t) => t.id));
  return (
    <div className="ex-wrap">
      <div className="ex-prompt-label">Build the sentence in Spanish</div>
      <div className="ex-prompt small"><span>{ex.item.en}</span></div>
      <div className="build-line">
        {picked.length === 0 && <span className="build-placeholder">Tap the words below in order</span>}
        {picked.map((t) => (
          <button key={t.id} className="tile placed" disabled={locked}
            onClick={() => setPicked(picked.filter((p) => p.id !== t.id))}>
            {t.word}
          </button>
        ))}
      </div>
      <div className="tile-bank">
        {ex.tiles.map((t) => (
          <button key={t.id} className={"tile" + (pickedIds.has(t.id) ? " used" : "")}
            disabled={locked || pickedIds.has(t.id)}
            onClick={() => { setPicked([...picked, t]); speak(t.word); }}>
            {t.word}
          </button>
        ))}
      </div>
    </div>
  );
}

function MatchExercise({ ex, onMistake, onDone }) {
  const [selL, setSelL] = useState(null);
  const [selR, setSelR] = useState(null);
  const [matched, setMatched] = useState([]);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (selL !== null && selR !== null) {
      if (selL === selR) {
        const next = [...matched, selL];
        setMatched(next);
        playCorrect();
        setSelL(null); setSelR(null);
        if (next.length === ex.pairs.length) setTimeout(onDone, 450);
      } else {
        setFlash({ l: selL, r: selR });
        playWrong();
        onMistake();
        setTimeout(() => { setFlash(null); setSelL(null); setSelR(null); }, 550);
      }
    }
  }, [selL, selR]);

  const cls = (side, key) => {
    let c = "match-btn";
    if (matched.includes(key)) c += " done";
    if ((side === "l" ? selL : selR) === key) c += " sel";
    if (flash && flash[side] === key) c += " bad";
    return c;
  };

  return (
    <div className="ex-wrap">
      <div className="ex-prompt-label">Tap the matching pairs</div>
      <div className="match-grid">
        <div className="match-col">
          {ex.left.map((o) => (
            <button key={o.key} className={cls("l", o.key)} disabled={matched.includes(o.key)}
              onClick={() => { setSelL(o.key); speak(o.label); }}>{o.label}</button>
          ))}
        </div>
        <div className="match-col">
          {ex.right.map((o) => (
            <button key={o.key} className={cls("r", o.key)} disabled={matched.includes(o.key)}
              onClick={() => setSelR(o.key)}>{o.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- LESSON SCREEN ----------

function LessonScreen({ title, color, dark, initialQueue, onFinish, onQuit }) {
  const [items, setItems] = useState(initialQueue);
  const [idx, setIdx] = useState(0);
  const [solved, setSolved] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [mistakes, setMistakes] = useState(0);
  const [phase, setPhase] = useState("answer"); // answer | good | bad
  const [selected, setSelected] = useState(null);
  const [typed, setTyped] = useState("");
  const [picked, setPicked] = useState([]);

  const ex = items[idx];
  const total = items.length;

  const resetInputs = () => { setSelected(null); setTyped(""); setPicked([]); setPhase("answer"); };

  const loseHeart = () => { setHearts((h) => Math.max(0, h - 1)); setMistakes((m) => m + 1); };

  const check = () => {
    let ok = false;
    if (ex.type === "mcq_es_en" || ex.type === "mcq_en_es" || ex.type === "listen_pick") {
      ok = selected !== null && ex.options[selected].en === ex.item.en;
    } else if (ex.type === "type_es") {
      ok = answerMatches(typed, ex.item);
    } else if (ex.type === "build") {
      ok = picked.map((t) => t.word).join(" ") === ex.target.join(" ");
    }
    if (ok) {
      playCorrect();
      setSolved((s) => s + 1);
      setPhase("good");
      if (ex.type !== "mcq_es_en") speak(ex.item.es);
    } else {
      playWrong();
      loseHeart();
      // Ask it again later. Typing falls back to multiple choice, and a
      // listening item comes back as visible text so a missing voice can't trap it.
      let retry;
      if (ex.type === "type_es") {
        retry = { type: "mcq_en_es", item: ex.item, options: mcqOptions(ex.item, "es", { items: ALL_ITEMS }) };
      } else if (ex.type === "listen_pick") {
        retry = { type: "mcq_es_en", item: ex.item, options: mcqOptions(ex.item, "en", { items: ALL_ITEMS }) };
      } else {
        retry = { ...ex, tiles: ex.tiles ? shuffle(ex.tiles) : undefined, options: ex.options ? shuffle(ex.options) : undefined };
      }
      setItems((arr) => [...arr, retry]);
      setPhase("bad");
    }
  };

  const advance = () => {
    const next = idx + 1;
    if (next >= items.length) {
      onFinish({ mistakes, total: items.length });
    } else {
      setIdx(next);
      resetInputs();
    }
  };

  const matchDone = () => { setSolved((s) => s + 1); setPhase("good"); };

  const canCheck =
    ex && (((ex.type.startsWith("mcq") || ex.type === "listen_pick") && selected !== null) ||
      (ex.type === "type_es" && typed.trim().length > 0) ||
      (ex.type === "build" && picked.length > 0));

  if (!ex) return null;

  return (
    <div className="screen lesson-screen">
      <TopBar progress={solved} total={total} hearts={hearts} onQuit={onQuit} />
      <div className="lesson-body">
        <div className="lesson-title" style={{ color: dark }}>{title}</div>
        {ex.type === "mcq_es_en" && <McqExercise ex={ex} selected={selected} onSelect={setSelected} locked={phase !== "answer"} esToEn={true} />}
        {ex.type === "mcq_en_es" && <McqExercise ex={ex} selected={selected} onSelect={setSelected} locked={phase !== "answer"} esToEn={false} />}
        {ex.type === "listen_pick" && <ListenExercise key={idx} ex={ex} selected={selected} onSelect={setSelected} locked={phase !== "answer"} />}
        {ex.type === "type_es" && <TypeExercise ex={ex} value={typed} onChange={setTyped} locked={phase !== "answer"} />}
        {ex.type === "build" && <BuildExercise ex={ex} picked={picked} setPicked={setPicked} locked={phase !== "answer"} />}
        {ex.type === "match" && <MatchExercise key={idx} ex={ex} onMistake={loseHeart} onDone={matchDone} />}
      </div>

      {phase === "answer" && ex.type !== "match" && (
        <div className="lesson-footer">
          <Chunky full color={color} dark={dark} disabled={!canCheck} onClick={check}>COMPROBAR</Chunky>
        </div>
      )}

      {phase !== "answer" && (
        <div className={"feedback " + phase}>
          <div className="fb-text">
            <div className="fb-head">{phase === "good" ? "¡Muy bien!" : "Casi. La respuesta:"}</div>
            {phase === "bad" && (
              <div className="fb-answer">
                {ex.type === "match" ? "" : ex.item.es}
                {ex.type !== "match" && <SpeakBtn text={ex.item.es} color="#fff" />}
              </div>
            )}
            {phase === "good" && ex.type !== "match" && ex.type !== "mcq_en_es" && (
              <div className="fb-answer light">{ex.item.es} · {ex.item.en}</div>
            )}
          </div>
          <Chunky full color={phase === "good" ? "#3FA65C" : "#D14D57"} dark={phase === "good" ? "#2E7D45" : "#A83641"} onClick={advance}>
            CONTINUAR
          </Chunky>
        </div>
      )}
    </div>
  );
}

// ---------- COMPLETE SCREEN ----------

function CompleteScreen({ result, onContinue }) {
  const acc = Math.max(0, Math.round(((result.total - result.mistakes) / result.total) * 100));
  return (
    <div className="screen complete-screen">
      <div className="confetti" aria-hidden="true">
        <span>🎉</span><span>⭐</span><span>🌟</span><span>🎊</span><span>✨</span>
      </div>
      <div className="complete-badge">✓</div>
      <h2 className="complete-title">¡Lección completa!</h2>
      <div className="stat-row">
        <div className="stat-card gold">
          <div className="stat-label">XP ganado</div>
          <div className="stat-val">⚡ {result.xp}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Precisión</div>
          <div className="stat-val">🎯 {acc}%</div>
        </div>
      </div>
      {result.streakUp && <div className="streak-note">🔥 ¡Racha de {result.streak} {result.streak === 1 ? "día" : "días"}!</div>}
      <div className="complete-footer">
        <Chunky full onClick={onContinue}>CONTINUAR</Chunky>
      </div>
    </div>
  );
}

// ---------- TRAIL (HOME) ----------

function Trail({ progress, onStart }) {
  const isUnitUnlocked = (i) => {
    if (progress.freeMode || i === 0) return true;
    const prev = UNITS[i - 1];
    return (progress.units[prev.id]?.done || 0) >= 3;
  };
  const offsets = [0, 46, -46];
  return (
    <div className="trail">
      {UNITS.map((u, ui) => {
        const unlocked = isUnitUnlocked(ui);
        const done = progress.units[u.id]?.done || 0;
        return (
          <section key={u.id} className="etapa">
            <div className="milepost" style={{ background: unlocked ? u.color : "#B9C2BB", boxShadow: `0 4px 0 ${unlocked ? u.dark : "#96A099"}` }}>
              <div className="mile-num">ETAPA {ui + 1}</div>
              <div className="mile-title">{u.icon} {u.title}</div>
              <div className="mile-sub">{u.subtitle}</div>
              {done === 3 && <div className="crown">👑</div>}
            </div>
            <div className="stones">
              {[0, 1, 2].map((li) => {
                const state = !unlocked || li > done ? "locked" : li < done ? "done" : "next";
                return (
                  <div className="stone-row" key={li} style={{ transform: `translateX(${offsets[li % 3]}px)` }}>
                    <button
                      className={"stone " + state}
                      style={state === "next" ? { background: u.color, boxShadow: `0 6px 0 ${u.dark}` } : {}}
                      disabled={state === "locked"}
                      onClick={() => onStart(u, li)}
                      aria-label={`${u.title} lesson ${li + 1}`}
                    >
                      {state === "locked" ? "🔒" : state === "done" ? "✓" : li === 2 ? "★" : li + 1}
                    </button>
                    <div className="stone-tag">{li === 2 ? "Repaso" : `Lección ${li + 1}`}</div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
      <div className="trail-end">🏔️ Fin del sendero... por ahora</div>
    </div>
  );
}

// ---------- PRACTICE + PROFILE ----------

function PracticeTab({ progress, onStart }) {
  const unlocked = UNITS.filter((u) => (progress.units[u.id]?.done || 0) > 0);
  const wordCount = unlocked.reduce((n, u) => {
    const d = progress.units[u.id].done;
    return n + (d >= 2 ? u.items.length : 6);
  }, 0);
  return (
    <div className="pad-screen">
      <h2 className="tab-title">Práctica</h2>
      {unlocked.length === 0 ? (
        <div className="empty-card">
          <div className="empty-emoji">🥾</div>
          <p>Complete a lesson on the trail first, then come back here for mixed review.</p>
        </div>
      ) : (
        <div className="practice-card">
          <div className="empty-emoji">🎒</div>
          <p><b>{wordCount}</b> words and phrases in your pack, from <b>{unlocked.length}</b> {unlocked.length === 1 ? "unit" : "units"}.</p>
          <p className="muted">A quick mixed session. Wrong answers come back around until you get them.</p>
          <Chunky full color="#2E7DD1" dark="#1F5C9E" onClick={() => onStart(unlocked)}>EMPEZAR PRÁCTICA · +10 XP</Chunky>
        </div>
      )}
    </div>
  );
}

function GlossaryTab({ progress }) {
  const shown = UNITS.filter((u) => progress.freeMode || (progress.units[u.id]?.done || 0) > 0);
  return (
    <div className="pad-screen">
      <h2 className="tab-title">Palabras</h2>
      {shown.length === 0 ? (
        <div className="empty-card">
          <div className="empty-emoji">📖</div>
          <p>Complete a lesson on the trail first, then everything you have learned shows up here to review.</p>
        </div>
      ) : (
        shown.map((u) => {
          const done = progress.units[u.id]?.done || 0;
          const count = done >= 2 ? u.items.length : 6;
          const items = u.items.slice(0, count);
          return (
            <section key={u.id} className="gloss-unit">
              <div className="gloss-head">{u.icon} {u.title}</div>
              {items.map((it) => (
                <div key={u.id + "|" + it.es} className="gloss-row">
                  <div className="gloss-text">
                    <div className="gloss-es">{it.es}</div>
                    <div className="gloss-en">{it.en}</div>
                  </div>
                  <SpeakBtn text={it.es} color={u.dark} />
                </div>
              ))}
            </section>
          );
        })
      )}
    </div>
  );
}

function ProfileTab({ progress, onToggleFree, onReset }) {
  const crowns = UNITS.filter((u) => (progress.units[u.id]?.done || 0) === 3).length;
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="pad-screen">
      <h2 className="tab-title">Perfil</h2>
      <div className="stat-row">
        <div className="stat-card gold"><div className="stat-label">XP total</div><div className="stat-val">⚡ {progress.xp}</div></div>
        <div className="stat-card fire"><div className="stat-label">Racha</div><div className="stat-val">🔥 {progress.streak}</div></div>
        <div className="stat-card green"><div className="stat-label">Coronas</div><div className="stat-val">👑 {crowns}</div></div>
      </div>
      <div className="setting-card">
        <div>
          <b>Modo libre</b>
          <div className="muted">Unlock every unit so you can jump straight to what a visit calls for.</div>
        </div>
        <button className={"toggle" + (progress.freeMode ? " on" : "")} onClick={onToggleFree} aria-label="Toggle free mode">
          <span className="knob" />
        </button>
      </div>
      <div className="setting-card">
        <div>
          <b>Fuente</b>
          <div className="muted">PASEO Salud Mental, Clinical Spanish for Mental Health workbook (Kohrt, 2022). Vocabulary drawn from its Vocabulario útil sections.</div>
        </div>
      </div>
      {!confirming ? (
        <button className="danger-link" onClick={() => setConfirming(true)}>Borrar progreso</button>
      ) : (
        <div className="setting-card danger">
          <div><b>¿Seguro?</b><div className="muted">This clears XP, streak, and all trail progress.</div></div>
          <div className="row-btns">
            <Chunky small ghost color="#6B7A70" onClick={() => setConfirming(false)}>No</Chunky>
            <Chunky small color="#D14D57" dark="#A83641" onClick={() => { setConfirming(false); onReset(); }}>Sí, borrar</Chunky>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- APP ----------

export default function App() {
  const [progress, setProgress] = useState(null);
  const [tab, setTab] = useState("trail");
  const [session, setSession] = useState(null); // {title,color,dark,queue,unitId,lessonIdx,isPractice}
  const [result, setResult] = useState(null);

  useEffect(() => {
    let live = true;
    loadProgress().then((p) => { if (live) setProgress(p); });
    // warm the voice list
    try { window.speechSynthesis && window.speechSynthesis.getVoices(); } catch (e) {}
    return () => { live = false; };
  }, []);

  const startLesson = (unit, lessonIdx) => {
    setSession({
      title: unit.title,
      color: unit.color,
      dark: unit.dark,
      queue: buildLessonQueue(unit, lessonIdx),
      unitId: unit.id,
      lessonIdx,
      isPractice: false,
    });
  };

  const startPractice = (unlockedUnits) => {
    setSession({
      title: "Práctica mixta",
      color: "#2E7DD1",
      dark: "#1F5C9E",
      queue: buildPracticeQueue(unlockedUnits),
      isPractice: true,
    });
  };

  const finishLesson = ({ mistakes, total }) => {
    playFinish();
    const perfect = mistakes === 0;
    const xpEarned = 10 + (perfect ? 5 : 0);
    const p = { ...progress, units: { ...progress.units } };
    p.xp += xpEarned;

    let streakUp = false;
    const today = todayKey();
    if (p.lastDay !== today) {
      p.streak = isYesterday(p.lastDay) ? p.streak + 1 : 1;
      p.lastDay = today;
      streakUp = true;
    }

    if (!session.isPractice) {
      const cur = p.units[session.unitId]?.done || 0;
      if (session.lessonIdx === cur && cur < 3) p.units[session.unitId] = { done: cur + 1 };
    }

    setProgress(p);
    saveProgress(p);
    setResult({ xp: xpEarned, mistakes, total, streak: p.streak, streakUp });
    setSession(null);
  };

  if (!progress) {
    return (
      <div className="app"><Style />
        <div className="loading">🥾<br />Preparando el sendero...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <Style />
      {session ? (
        <LessonScreen
          title={session.title}
          color={session.color}
          dark={session.dark}
          initialQueue={session.queue}
          onFinish={finishLesson}
          onQuit={() => setSession(null)}
        />
      ) : result ? (
        <CompleteScreen result={result} onContinue={() => setResult(null)} />
      ) : (
        <>
          <header className="app-header">
            <div className="brand">
              <div className="brand-name">Sendero Clínico</div>
              <div className="brand-sub">Spanish for the work you do</div>
            </div>
            <div className="header-stats">
              <span className="pill fire">🔥 {progress.streak}</span>
              <span className="pill gold">⚡ {progress.xp}</span>
            </div>
          </header>
          <main className="main-scroll">
            {tab === "trail" && <Trail progress={progress} onStart={startLesson} />}
            {tab === "practice" && <PracticeTab progress={progress} onStart={startPractice} />}
            {tab === "words" && <GlossaryTab progress={progress} />}
            {tab === "profile" && (
              <ProfileTab
                progress={progress}
                onToggleFree={() => { const p = { ...progress, freeMode: !progress.freeMode }; setProgress(p); saveProgress(p); }}
                onReset={() => { const p = { ...DEFAULT_PROGRESS, units: {} }; setProgress(p); saveProgress(p); }}
              />
            )}
          </main>
          <nav className="tabbar">
            <button className={tab === "trail" ? "on" : ""} onClick={() => setTab("trail")}><span>🥾</span>Sendero</button>
            <button className={tab === "practice" ? "on" : ""} onClick={() => setTab("practice")}><span>🎒</span>Práctica</button>
            <button className={tab === "words" ? "on" : ""} onClick={() => setTab("words")}><span>📖</span>Palabras</button>
            <button className={tab === "profile" ? "on" : ""} onClick={() => setTab("profile")}><span>🌻</span>Perfil</button>
          </nav>
        </>
      )}
    </div>
  );
}

// ---------- STYLES ----------

function Style() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Karla:wght@400;600;700&display=swap');

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html, body { margin: 0; padding: 0; background: #EDF1EA; }

.app {
  max-width: 430px; margin: 0 auto; min-height: 100vh;
  background: #F7F9F4; color: #24312A;
  font-family: 'Karla', -apple-system, 'Segoe UI', sans-serif;
  display: flex; flex-direction: column; position: relative;
}
button { font-family: inherit; cursor: pointer; }

.loading {
  margin: auto; text-align: center; font-family: 'Baloo 2', sans-serif;
  font-size: 22px; color: #6B7A70; padding: 80px 20px; line-height: 1.8;
}

/* Header */
.app-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px 10px; position: sticky; top: 0; z-index: 5;
  background: #F7F9F4E6; backdrop-filter: blur(6px);
  border-bottom: 2px solid #E3E8E0;
}
.brand-name { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 21px; color: #2E7D45; line-height: 1.1; }
.brand-sub { font-size: 12px; color: #6B7A70; font-weight: 600; }
.header-stats { display: flex; gap: 8px; }
.pill {
  font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 14px;
  padding: 4px 10px; border-radius: 999px; background: #fff; border: 2px solid #E3E8E0;
}
.pill.fire { color: #D97316; }
.pill.gold { color: #B8860B; }

.main-scroll { flex: 1; overflow-y: auto; padding-bottom: 84px; }

/* Trail */
.trail { padding: 18px 18px 30px; }
.etapa { margin-bottom: 10px; }
.milepost {
  border-radius: 18px; color: #fff; padding: 14px 16px; position: relative;
  margin-bottom: 20px;
}
.mile-num { font-size: 11px; letter-spacing: 1.5px; font-weight: 700; opacity: .85; }
.mile-title { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 19px; }
.mile-sub { font-size: 13px; opacity: .92; }
.crown { position: absolute; top: -12px; right: 12px; font-size: 26px; filter: drop-shadow(0 2px 0 rgba(0,0,0,.15)); }

.stones {
  display: flex; flex-direction: column; align-items: center; gap: 22px;
  padding: 4px 0 26px;
  background-image: linear-gradient(#C9D4C6 33%, transparent 0);
  background-size: 3px 12px; background-repeat: repeat-y; background-position: center top;
}
.stone-row { display: flex; flex-direction: column; align-items: center; }
.stone {
  width: 70px; height: 70px; border-radius: 50%; border: none;
  font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 26px; color: #fff;
  transition: transform .08s ease;
}
.stone:active:not(:disabled) { transform: translateY(4px); }
.stone.locked { background: #D7DED4; color: #A6B0A6; box-shadow: 0 6px 0 #BFC9BC; cursor: default; font-size: 20px; }
.stone.done { background: #F2C94C; color: #7A5A00; box-shadow: 0 6px 0 #C9A227; }
.stone-tag { margin-top: 7px; font-size: 12px; font-weight: 700; color: #6B7A70; background: #F7F9F4; padding: 0 6px; border-radius: 6px; }
.trail-end { text-align: center; color: #6B7A70; font-family: 'Baloo 2', sans-serif; font-weight: 700; padding: 10px 0 26px; }

/* Chunky buttons */
.chunky {
  border: none; border-radius: 14px; padding: 13px 18px;
  font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 15px; letter-spacing: .8px;
  transition: transform .07s ease, box-shadow .07s ease, filter .1s;
}
.chunky:active:not(:disabled) { transform: translateY(3px); box-shadow: 0 1px 0 rgba(0,0,0,.25) !important; }
.chunky:disabled { background: #D7DED4 !important; box-shadow: 0 4px 0 #BFC9BC !important; color: #A6B0A6 !important; cursor: default; }
.chunky.ghost { background: #fff; border: 2px solid #E3E8E0; box-shadow: none; }
.chunky.full { width: 100%; }
.chunky.small { padding: 9px 14px; font-size: 13px; }

/* Lesson */
.screen { flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
.lesson-top { display: flex; align-items: center; gap: 12px; padding: 16px 16px 8px; }
.quit { background: none; border: none; font-size: 20px; color: #97A59B; padding: 4px; }
.bar-track { flex: 1; height: 14px; background: #E3E8E0; border-radius: 999px; overflow: hidden; }
.bar-fill { height: 100%; background: #F2C94C; border-radius: 999px; transition: width .35s ease; }
.hearts { font-family: 'Baloo 2', sans-serif; font-size: 15px; color: #D14D57; }

.lesson-body { flex: 1; padding: 6px 20px 20px; overflow-y: auto; }
.lesson-title { font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin: 4px 0 14px; }
.ex-prompt-label { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 22px; margin-bottom: 14px; line-height: 1.25; }
.ex-prompt {
  display: flex; align-items: center; gap: 10px; background: #fff;
  border: 2px solid #E3E8E0; border-radius: 14px; padding: 14px 16px;
  font-size: 19px; font-weight: 700; margin-bottom: 18px;
}
.ex-prompt.small { font-size: 16px; }
.speak-btn { border: none; background: none; font-size: 22px; padding: 2px; }

.opt-list { display: flex; flex-direction: column; gap: 10px; }
.opt {
  display: flex; align-items: center; gap: 12px; text-align: left;
  background: #fff; border: 2px solid #E3E8E0; border-radius: 14px;
  box-shadow: 0 3px 0 #E3E8E0; padding: 13px 14px; font-size: 16px; font-weight: 600; color: #24312A;
}
.opt.sel { border-color: #2E7DD1; box-shadow: 0 3px 0 #2E7DD1; background: #EAF3FC; color: #1F5C9E; }
.opt:disabled { opacity: .8; }
.opt-num {
  width: 24px; height: 24px; border-radius: 8px; border: 2px solid #E3E8E0;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #97A59B; flex-shrink: 0;
}
.opt.sel .opt-num { border-color: #2E7DD1; color: #1F5C9E; }

.listen-row { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.listen-btn {
  width: 76px; height: 76px; border-radius: 50%; border: none; flex-shrink: 0;
  background: #2E7DD1; color: #fff; font-size: 32px;
  box-shadow: 0 5px 0 #1F5C9E; transition: transform .08s ease;
}
.listen-btn:active { transform: translateY(4px); box-shadow: 0 1px 0 #1F5C9E; }
.listen-cant { background: none; border: none; color: #6B7A70; font-weight: 700; font-size: 14px; text-decoration: underline; text-align: left; }
.listen-reveal {
  font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 18px; color: #24312A;
  background: #EAF3FC; border: 2px solid #CFE3F6; border-radius: 12px; padding: 8px 12px;
}

.type-box {
  width: 100%; border: 2px solid #E3E8E0; border-radius: 14px; padding: 14px;
  font-family: inherit; font-size: 18px; background: #fff; resize: none; color: #24312A;
}
.type-box:focus { outline: none; border-color: #2E7DD1; }
.hint { font-size: 12px; color: #97A59B; margin-top: 8px; font-weight: 600; }

.build-line {
  min-height: 58px; border-bottom: 2px dashed #C9D4C6; display: flex; flex-wrap: wrap;
  gap: 8px; align-items: flex-start; padding: 4px 0 12px; margin-bottom: 18px;
}
.build-placeholder { color: #A6B0A6; font-size: 14px; font-weight: 600; padding-top: 10px; }
.tile-bank { display: flex; flex-wrap: wrap; gap: 8px; }
.tile {
  border: 2px solid #E3E8E0; background: #fff; border-radius: 12px;
  box-shadow: 0 3px 0 #E3E8E0; padding: 9px 13px; font-size: 16px; font-weight: 700; color: #24312A;
}
.tile.placed { border-color: #BFD9C6; background: #F0F7F1; }
.tile.used { opacity: 0; pointer-events: none; }

.match-grid { display: flex; gap: 12px; }
.match-col { flex: 1; display: flex; flex-direction: column; gap: 10px; }
.match-btn {
  border: 2px solid #E3E8E0; background: #fff; border-radius: 12px; box-shadow: 0 3px 0 #E3E8E0;
  padding: 12px 8px; font-size: 14px; font-weight: 700; color: #24312A; min-height: 54px;
}
.match-btn.sel { border-color: #2E7DD1; background: #EAF3FC; box-shadow: 0 3px 0 #2E7DD1; }
.match-btn.bad { border-color: #D14D57; background: #FBEBEC; animation: shake .35s; }
.match-btn.done { border-color: #BFD9C6; background: #F0F7F1; color: #A6B0A6; box-shadow: none; }
@keyframes shake { 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }

.lesson-footer { padding: 14px 20px 22px; border-top: 2px solid #E3E8E0; background: #F7F9F4; }
.feedback { padding: 16px 20px 22px; animation: rise .22s ease; }
.feedback.good { background: #DDF4E1; }
.feedback.bad { background: #FBDDE0; }
.fb-text { margin-bottom: 12px; }
.fb-head { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 20px; }
.feedback.good .fb-head { color: #2E7D45; }
.feedback.bad .fb-head { color: #A83641; }
.fb-answer { font-size: 17px; font-weight: 700; margin-top: 4px; color: #A83641; display: flex; align-items: center; gap: 8px; }
.feedback.bad .fb-answer .speak-btn { color: #A83641 !important; }
.fb-answer.light { color: #2E7D45; }
@keyframes rise { from { transform: translateY(24px); opacity: 0; } to { transform: none; opacity: 1; } }

/* Complete */
.complete-screen { align-items: center; justify-content: center; padding: 30px 24px; text-align: center; position: relative; }
.complete-badge {
  width: 96px; height: 96px; border-radius: 50%; background: #3FA65C; color: #fff;
  font-size: 48px; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 0 #2E7D45; font-family: 'Baloo 2', sans-serif; animation: pop .4s ease;
}
@keyframes pop { 0% { transform: scale(.4); } 70% { transform: scale(1.12); } 100% { transform: scale(1); } }
.complete-title { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 28px; margin: 18px 0 20px; color: #24312A; }
.stat-row { display: flex; gap: 10px; width: 100%; max-width: 340px; margin: 0 auto; }
.stat-card { flex: 1; border-radius: 14px; padding: 12px 8px; border: 2px solid; background: #fff; }
.stat-card.gold { border-color: #F2C94C; }
.stat-card.green { border-color: #3FA65C; }
.stat-card.fire { border-color: #E0704A; }
.stat-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #6B7A70; }
.stat-val { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 20px; margin-top: 2px; }
.streak-note { margin-top: 18px; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 18px; color: #D97316; }
.complete-footer { width: 100%; max-width: 340px; margin: 28px auto 0; }
.confetti span { position: absolute; top: -10px; font-size: 24px; animation: fall 2.6s ease-in forwards; }
.confetti span:nth-child(1) { left: 12%; animation-delay: 0s; }
.confetti span:nth-child(2) { left: 32%; animation-delay: .3s; }
.confetti span:nth-child(3) { left: 52%; animation-delay: .15s; }
.confetti span:nth-child(4) { left: 72%; animation-delay: .45s; }
.confetti span:nth-child(5) { left: 88%; animation-delay: .2s; }
@keyframes fall { to { transform: translateY(105vh) rotate(300deg); opacity: .2; } }

/* Tabs */
.tabbar {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 430px; display: flex; background: #fff;
  border-top: 2px solid #E3E8E0; padding: 6px 0 10px; z-index: 10;
}
.tabbar button {
  flex: 1; background: none; border: none; display: flex; flex-direction: column; align-items: center; gap: 2px;
  font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 12px; color: #97A59B; padding: 6px 0;
}
.tabbar button span { font-size: 22px; }
.tabbar button.on { color: #2E7D45; }

/* Practice + Profile */
.pad-screen { padding: 20px 18px 30px; }
.tab-title { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 24px; margin: 0 0 16px; }
.empty-card, .practice-card {
  background: #fff; border: 2px solid #E3E8E0; border-radius: 16px; padding: 22px 18px; text-align: center;
}
.practice-card p { margin: 8px 0 14px; font-size: 16px; }
.empty-emoji { font-size: 40px; margin-bottom: 6px; }
.muted { color: #6B7A70; font-size: 13px; font-weight: 600; }
.setting-card {
  background: #fff; border: 2px solid #E3E8E0; border-radius: 16px; padding: 16px;
  display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 14px;
}
.setting-card.danger { border-color: #F1B8BD; flex-direction: column; align-items: stretch; }
.row-btns { display: flex; gap: 10px; justify-content: flex-end; }
.toggle {
  width: 52px; height: 30px; border-radius: 999px; border: none; background: #D7DED4;
  position: relative; flex-shrink: 0; transition: background .2s;
}
.toggle .knob {
  position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.25); transition: left .2s;
}
.toggle.on { background: #3FA65C; }
.toggle.on .knob { left: 25px; }
.danger-link { background: none; border: none; color: #D14D57; font-weight: 700; margin-top: 18px; font-size: 14px; text-decoration: underline; }

/* Glossary */
.gloss-unit { margin-bottom: 20px; }
.gloss-head { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 17px; color: #24312A; margin: 4px 2px 10px; }
.gloss-row {
  background: #fff; border: 2px solid #E3E8E0; border-radius: 14px; padding: 11px 14px;
  display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px;
}
.gloss-text { min-width: 0; }
.gloss-es { font-weight: 700; font-size: 16px; color: #24312A; }
.gloss-en { color: #6B7A70; font-size: 13px; font-weight: 600; margin-top: 1px; }

button:focus-visible { outline: 3px solid #2E7DD1; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
    `}</style>
  );
}
