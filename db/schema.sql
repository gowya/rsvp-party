-- Schéma de la base (Postgres, testé sur Neon). À lancer une fois par événement.

create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  -- Identifiant aléatoire gardé par le téléphone de l'invité : une réponse par téléphone, modifiable
  token text not null unique check (char_length(token) between 16 and 64),
  name text not null check (char_length(name) between 1 and 40),
  answer text not null check (answer in ('oui', 'peut-etre', 'non')),
  -- Ce que la personne ramène (clés de POLL_ITEMS) et ses « autre chose » en texte libre
  brings text[] not null default '{}',
  brings_others text[] not null default '{}',
  -- Réponse d'exemple du mode démo (DEMO_MODE=1) : visible par tous, jamais effacée
  is_seed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists responses_created_idx on responses (created_at);

create table if not exists songs (
  id uuid primary key default gen_random_uuid(),
  response_id uuid not null references responses (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  created_at timestamptz not null default now()
);

create index if not exists songs_response_idx on songs (response_id);
