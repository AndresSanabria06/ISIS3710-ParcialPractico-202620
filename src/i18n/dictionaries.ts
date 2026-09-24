// Textos de la aplicación en cada idioma soportado.
// Para agregar un texto nuevo se agrega primero en "es" y luego en "en"
// (TypeScript obliga a que ambos diccionarios tengan las mismas llaves).

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

// Nombre de la cookie donde se guarda el idioma elegido
export const LOCALE_COOKIE = "lang";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

const es = {
  meta: {
    title: "Planes",
    description: "Encuentra planes cerca de ti",
    numberLocale: "es-CO",
  },
  header: {
    brand: "Planes Parcial",
    home: "Ir al inicio",
    mainNav: "Navegación principal",
    explore: "Explorar Planes",
    login: "Iniciar sesión",
    register: "Registrarse",
    createPlan: "+ Crear Plan",
    logout: "Cerrar sesión",
    loggedAs: "Sesión iniciada como",
    switchLanguage: "EN",
    switchLanguageLabel: "Cambiar idioma a inglés",
  },
  home: {
    badge: "TU CIUDAD, HOY",
    title: "¿Buscas planes?",
    subtitle:
      "Encuentra eventos espontáneos, actividades con amigos y nuevas experiencias cerca de ti.",
    searchLabel: "Buscar planes",
    searchPlaceholder: "Conciertos, cenas, escapadas...",
    explore: "Explorar →",
    noStrings: "Sin reservas complicadas ni ataduras",
  },
  login: {
    title: "Inicia sesión",
    subtitle: "Qué bueno verte de nuevo. Ingresa para ver tus planes.",
    email: "Correo electrónico",
    password: "Contraseña",
    submit: "Iniciar sesión",
    error: "Correo o contraseña incorrectos",
  },
  register: {
    title: "Crea tu cuenta",
    subtitle: "Regístrate para descubrir y unirte a nuevos planes.",
    username: "Usuario",
    name: "Nombre",
    email: "Correo electrónico",
    password: "Contraseña",
    submit: "Crear cuenta",
    error: "No se pudo crear la cuenta, revisa los datos",
    free: "Es gratis y solo toma un minuto",
  },
  plans: {
    title: "Explorar planes",
    resultsFor: "Resultados para",
    empty: "No encontramos planes.",
    createdBy: "Creado por",
    approximate: "Aproximado:",
    likes: "me gusta",
  },
  planDetail: {
    loading: "Cargando plan...",
    notFound: "Este plan no existe.",
    back: "← Volver a planes",
    address: "Dirección:",
    organizedBy: "Organizado por",
    likes: "likes",
    description: "Descripción del plan",
    recommendations: "Recomendaciones",
    perPerson: "/ persona",
    duration: "Duración",
    minutes: "min aprox.",
    like: "Me gustó",
    likeError: "No se pudo dar me gusta a este plan",
    askHost: "Preguntar al anfitrión",
    cancellation: "Cancelación gratuita hasta 24 horas antes del inicio.",
    safeTitle: "Experiencia segura y garantizada",
    safeText:
      "Seguro de accidentes incluido para todos los participantes registrados.",
  },
  createPlan: {
    title: "Crear un nuevo plan",
    subtitle:
      "Organiza, invita a tus amigos o abre plazas para que otros miembros se sumen a vivir momentos únicos.",
    required: "obligatorio",
    image: "Foto de portada del plan",
    imageHint: "Copia el enlace de una imagen",
    imageText: "Haz que tu plan destaque a primera vista",
    imagePreview: "Vista previa de la foto de portada",
    name: "Nombre del plan",
    namePlaceholder: "Ej. Tarde de paddle surf y atardecer",
    address: "Dirección",
    addressPlaceholder: "Ej. Bahía de las Brisas • Muelle Norte",
    price: "Precio estimado",
    pricePlaceholder: "Ej. 25000",
    duration: "Duración (minutos)",
    durationPlaceholder: "Ej. 120",
    description: "Descripción del plan",
    descriptionPlaceholder:
      "Cuéntale a todos de qué va el plan, cuál es la vibra del grupo, el itinerario aproximado y qué lo hace especial...",
    recommendations: "Recomendaciones para los asistentes",
    recommendationsHelp:
      "Agrega tips clave como vestimenta recomendada, qué llevar o recordatorios puntuales.",
    recommendationsPlaceholder: "Ej. Llevar protector solar, toalla y agua",
    defaultRecommendations: "Sin recomendaciones adicionales.",
    cancel: "Cancelar",
    submit: "Publicar plan",
    submitting: "Publicando...",
    errors: {
      name: "El nombre debe tener entre 2 y 50 caracteres",
      address: "La dirección es obligatoria",
      price: "El precio estimado debe ser mayor a 0",
      duration: "La duración debe ser un número entero mayor a 0",
      descriptionRequired: "La descripción es obligatoria",
      descriptionLength: "La descripción debe tener menos de 600 caracteres",
      image: "Ingresa un enlace válido que empiece por http:// o https://",
      submit: "No se pudo publicar el plan. Inténtalo de nuevo.",
    },
  },
};

export type Dictionary = typeof es;

const en: Dictionary = {
  meta: {
    title: "Plans",
    description: "Find plans near you",
    numberLocale: "en-US",
  },
  header: {
    brand: "Planes Parcial",
    home: "Go to home page",
    mainNav: "Main navigation",
    explore: "Explore Plans",
    login: "Log in",
    register: "Sign up",
    createPlan: "+ Create Plan",
    logout: "Log out",
    loggedAs: "Logged in as",
    switchLanguage: "ES",
    switchLanguageLabel: "Switch language to Spanish",
  },
  home: {
    badge: "YOUR CITY, TODAY",
    title: "Looking for plans?",
    subtitle:
      "Find spontaneous events, activities with friends and new experiences near you.",
    searchLabel: "Search plans",
    searchPlaceholder: "Concerts, dinners, getaways...",
    explore: "Explore →",
    noStrings: "No complicated bookings, no strings attached",
  },
  login: {
    title: "Log in",
    subtitle: "Good to see you again. Log in to see your plans.",
    email: "Email",
    password: "Password",
    submit: "Log in",
    error: "Incorrect email or password",
  },
  register: {
    title: "Create your account",
    subtitle: "Sign up to discover and join new plans.",
    username: "Username",
    name: "Name",
    email: "Email",
    password: "Password",
    submit: "Create account",
    error: "The account could not be created, please check your data",
    free: "It's free and only takes a minute",
  },
  plans: {
    title: "Explore plans",
    resultsFor: "Results for",
    empty: "We couldn't find any plans.",
    createdBy: "Created by",
    approximate: "Approx.:",
    likes: "likes",
  },
  planDetail: {
    loading: "Loading plan...",
    notFound: "This plan does not exist.",
    back: "← Back to plans",
    address: "Address:",
    organizedBy: "Organized by",
    likes: "likes",
    description: "About this plan",
    recommendations: "Recommendations",
    perPerson: "/ person",
    duration: "Duration",
    minutes: "min approx.",
    like: "I like it",
    likeError: "Could not like this plan",
    askHost: "Ask the host",
    cancellation: "Free cancellation up to 24 hours before the start.",
    safeTitle: "Safe and guaranteed experience",
    safeText: "Accident insurance included for all registered participants.",
  },
  createPlan: {
    title: "Create a new plan",
    subtitle:
      "Organize, invite your friends or open spots so other members can join and live unique moments.",
    required: "required",
    image: "Plan cover photo",
    imageHint: "Paste an image link",
    imageText: "Make your plan stand out at first sight",
    imagePreview: "Cover photo preview",
    name: "Plan name",
    namePlaceholder: "E.g. Paddle surf and sunset afternoon",
    address: "Address",
    addressPlaceholder: "E.g. Brisas Bay • North Pier",
    price: "Estimated price",
    pricePlaceholder: "E.g. 25000",
    duration: "Duration (minutes)",
    durationPlaceholder: "E.g. 120",
    description: "Plan description",
    descriptionPlaceholder:
      "Tell everyone what the plan is about, the vibe of the group, the rough itinerary and what makes it special...",
    recommendations: "Recommendations for attendees",
    recommendationsHelp:
      "Add key tips such as recommended clothing, what to bring or specific reminders.",
    recommendationsPlaceholder: "E.g. Bring sunscreen, a towel and water",
    defaultRecommendations: "No additional recommendations.",
    cancel: "Cancel",
    submit: "Publish plan",
    submitting: "Publishing...",
    errors: {
      name: "The name must be between 2 and 50 characters",
      address: "The address is required",
      price: "The estimated price must be greater than 0",
      duration: "The duration must be a whole number greater than 0",
      descriptionRequired: "The description is required",
      descriptionLength: "The description must be shorter than 600 characters",
      image: "Enter a valid link starting with http:// or https://",
      submit: "The plan could not be published. Please try again.",
    },
  },
};

export const dictionaries: Record<Locale, Dictionary> = { es, en };
