# rsvp-party

Un site d'invitation animé pour une fête : compte à rebours, réponses en direct, « qui ramène quoi », playlist collaborative et page admin. Pensé pour le téléphone (le lien circule sur WhatsApp).

> Projet en cours de construction. Le README complet (démo, captures, guide « créer ton événement ») arrive bientôt.

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis remplir les variables
npm run dev
```

- La base se crée avec `db/schema.sql`.

## Configurer son événement

Tout se règle dans un seul fichier : [`src/event.config.ts`](src/event.config.ts). Chaque champ est documenté dans [`src/config/schema.ts`](src/config/schema.ts).

| Réglage | Ce qu'il fait |
|---|---|
| `name`, `badge`, `title`, `description` | Le grand titre, la pastille (« 30 ans »), le titre de l'onglet et de l'agenda |
| `date` | Début, fin et fuseau : le compte à rebours, l'agenda et toutes les dates affichées en découlent |
| `place` | Le lieu et la ville. L'adresse exacte vit dans la variable `EVENT_ADDRESS` et s'affiche après une réponse (`after-rsvp`) ou tout de suite (`always`) |
| `sections` | Les blocs affichés : compte à rebours, infos, réponse, invités, sondage, playlist |
| `dresscode` | La carte « Dress code », ou `null` pour la masquer |
| `poll` | Ce que les invités ramènent, avec une limite par truc, et le nombre de propositions « autre chose » |
| `playlist` | Le nombre de sons proposés par personne |
| `easterEgg` | Le tiroir caché qui s'ouvre au tap sur les illustrations |
| `texts` | Les phrases propres à l'événement (accroche, remerciements, fin…) |

Les sections invités, sondage et playlist ont besoin de la section réponse. Sans réponse, le site n'a pas besoin de base de données.

## Stack

Next.js, GSAP, Three.js, Postgres (Neon), Vercel.

## Licence

MIT
