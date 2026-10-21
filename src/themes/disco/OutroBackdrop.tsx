import s from "./OutroBackdrop.module.css";

// Tirage pseudo-aléatoire stable, pour placer les étoiles pareil au rendu serveur et dans le navigateur
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}
const rand = seeded(1912);
const STARS = Array.from({ length: 42 }, () => ({
  left: rand() * 100,
  top: rand() * 58,
  size: 5 + rand() * 11,
  delay: rand() * 2.4,
}));

// La nuit de la fin : des étoiles qui s'allument et une lune qui se lève (animées par Scenes.tsx)
export default function OutroBackdrop() {
  return (
    <>
      <div className={s.night} data-outro-night="">
        {STARS.map((star, i) => (
          <span
            key={i}
            className={s.star}
            style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, animationDelay: `${star.delay}s` }}
          />
        ))}
      </div>
      <div className={s.moon} data-outro-moon="" />
    </>
  );
}
