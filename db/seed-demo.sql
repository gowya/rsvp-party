-- Réponses d'exemple pour le site de démo (DEMO_MODE=1). Prénoms et réponses fictifs.
-- Une seule instruction : les réponses, puis leurs sons.

with r as (
  insert into responses (token, name, answer, brings, brings_others, is_seed, created_at) values
    ('seed-0001-ines-aaaaaaaaaaaaaaaa', 'Inès',   'oui',       '{softs,chips}',    '{}',                            true, now() - interval '9 days'),
    ('seed-0002-lucas-aaaaaaaaaaaaaaa', 'Lucas',  'oui',       '{alcool}',         '{"Une enceinte"}',              true, now() - interval '9 days'),
    ('seed-0003-jade-aaaaaaaaaaaaaaaa', 'Jade',   'oui',       '{bonbons}',        '{}',                            true, now() - interval '8 days'),
    ('seed-0004-nathan-aaaaaaaaaaaaaa', 'Nathan', 'oui',       '{pizza,gobelets}', '{}',                            true, now() - interval '8 days'),
    ('seed-0005-yanis-aaaaaaaaaaaaaaa', 'Yanis',  'peut-etre', '{alcool}',         '{}',                            true, now() - interval '7 days'),
    ('seed-0006-lea-aaaaaaaaaaaaaaaaa', 'Léa',    'oui',       '{softs}',          '{"Des guirlandes lumineuses"}', true, now() - interval '6 days'),
    ('seed-0007-sacha-aaaaaaaaaaaaaaa', 'Sacha',  'oui',       '{chips,bonbons}',  '{}',                            true, now() - interval '6 days'),
    ('seed-0008-manon-aaaaaaaaaaaaaaa', 'Manon',  'non',       '{}',               '{}',                            true, now() - interval '5 days'),
    ('seed-0009-hugo-aaaaaaaaaaaaaaaa', 'Hugo',   'oui',       '{alcool,pizza}',   '{}',                            true, now() - interval '4 days'),
    ('seed-0010-lina-aaaaaaaaaaaaaaaa', 'Lina',   'oui',       '{softs}',          '{"Un gâteau au chocolat"}',     true, now() - interval '3 days'),
    ('seed-0011-rayan-aaaaaaaaaaaaaaa', 'Rayan',  'peut-etre', '{}',               '{}',                            true, now() - interval '3 days'),
    ('seed-0012-zoe-aaaaaaaaaaaaaaaaa', 'Zoé',    'oui',       '{pizza}',          '{}',                            true, now() - interval '2 days'),
    ('seed-0013-malik-aaaaaaaaaaaaaaa', 'Malik',  'oui',       '{gobelets,chips}', '{}',                            true, now() - interval '1 day'),
    ('seed-0014-louise-aaaaaaaaaaaaaa', 'Louise', 'oui',       '{bonbons,softs}',  '{}',                            true, now() - interval '1 day')
  returning id, name
)
insert into songs (response_id, title)
select r.id, s.title
from r
join (values
  ('Inès',   'Dancing Queen, ABBA'),
  ('Lucas',  'One More Time, Daft Punk'),
  ('Jade',   'Espresso, Sabrina Carpenter'),
  ('Nathan', 'Freed from Desire, Gala'),
  ('Léa',    'Murder on the Dancefloor, Sophie Ellis-Bextor'),
  ('Sacha',  'Alors on danse, Stromae'),
  ('Hugo',   'Mr. Brightside, The Killers'),
  ('Lina',   'Padam Padam, Kylie Minogue'),
  ('Zoé',    'Djadja, Aya Nakamura'),
  ('Louise', 'Get Lucky, Daft Punk')
) as s(name, title) on s.name = r.name;
