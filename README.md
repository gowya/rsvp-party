# rsvp-party

Un site d'invitation animé pour une fête : compte à rebours, réponses en direct, « qui ramène quoi », playlist collaborative et page admin. Pensé pour le téléphone (le lien circule sur WhatsApp).

> Projet en cours de construction. Le README complet (démo, captures, guide « créer ton événement ») arrive bientôt.

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis remplir les variables
npm run dev
```

- L'événement se configure dans `src/data/event.ts`.
- La base se crée avec `db/schema.sql`.

## Stack

Next.js, GSAP, Three.js, Postgres (Neon), Vercel.

## Licence

MIT
