// Le format du fichier src/event.config.ts. Tout est documenté ici, champ par champ.

export type Answer = "oui" | "peut-etre" | "non";

export type PollItem = {
  // Identifiant stable (enregistré en base : ne pas le changer une fois les réponses arrivées)
  key: string;
  label: string;
  emoji: string;
  // Nombre de personnes max pour ce truc, null = pas de limite
  limit: number | null;
};

export type Photo = { src: string; alt: string };

export type EventConfig = {
  // Grand titre du hero, en capitales (« CAMILLE », « LÉA & TOM »)
  name: string;
  // Pastille au-dessus du titre (« 30 » + « ans »), null pour ne rien afficher
  badge: { big: string; small: string } | null;
  // Titre complet : onglet, agenda, admin, aperçu des liens
  title: string;
  // Phrase de description (aperçu des liens partagés, agenda)
  description: string;

  date: {
    // Heure locale avec son décalage (« +01:00 » en hiver, « +02:00 » en été)
    start: string;
    // Fin estimée, pour l'agenda
    end: string;
    timeZone: string;
  };

  place: {
    // Titre de la carte « Où » (« Chez moi », « Domaine des Oliviers »)
    label: string;
    // Ville, visible par tout le monde
    city: string;
    // L'adresse exacte vient de la variable EVENT_ADDRESS.
    // « after-rsvp » : seulement pour qui a répondu oui ou peut-être. « always » : visible par tous.
    revealAddress: "after-rsvp" | "always";
  };

  // Thème visuel (couleurs, polices, illustrations, animation signature)
  theme: "disco";

  // Photos dans /public (null : une illustration les remplace)
  photos: { hero: Photo | null; rsvp: Photo | null };

  // Sections affichées. guests, poll et playlist ont besoin de rsvp (on répond avant de participer).
  sections: {
    countdown: boolean;
    infos: boolean;
    rsvp: boolean;
    guests: boolean;
    poll: boolean;
    playlist: boolean;
  };

  // Carte « Dress code » dans les infos, null pour la masquer
  dresscode: { title: string; highlight: string; text: string } | null;

  poll: {
    items: PollItem[];
    // Propositions « autre chose » par personne (0 pour désactiver)
    maxOthersPerGuest: number;
  };

  playlist: { maxSongsPerGuest: number };

  // Tiroir caché qui s'ouvre au tap sur les illustrations, et pluie d'objets quand on secoue le téléphone
  easterEgg: { enabled: boolean };

  // Les textes propres à l'événement (le reste des textes vient du thème)
  texts: {
    // Sous le titre du hero (« On fête mes 30 ans. »)
    tagline: string;
    // Légende de la photo à côté du formulaire
    rsvpCaption: string;
    // Message après une réponse
    thanks: Record<Answer, string>;
    // Phrase manuscrite sous le titre du sondage
    pollIntro: string;
    // Petite ligne sous le prénom sur le vinyle de la playlist
    vinyl: string;
    // Grand titre de fin, une ligne par élément (« À », « samedi »)
    outro: string[];
  };

  // Préfixe des données gardées dans le navigateur (un par événement, sans espace)
  storageKey: string;
};

export const defineEvent = (config: EventConfig) => config;
