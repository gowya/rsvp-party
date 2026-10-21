"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { EVENT } from "@/data/event";
import PhotoPlaceholder from "../PhotoPlaceholder";
import { flyToGuests } from "@/lib/celebrate";
import { burstConfetti } from "@/lib/confetti";
import { submitRsvp, useLive } from "@/lib/live";
import type { Answer } from "@/lib/poll";
import s from "./sections.module.css";

const ANSWERS: { key: Answer; label: string }[] = [
  { key: "oui", label: "Je viens 🔥" },
  { key: "peut-etre", label: "Peut-être 🤔" },
  { key: "non", label: "Je peux pas 😢" },
];

const THANKS: Record<Answer, string> = {
  oui: "Trop bien, j'ai hâte de te voir !",
  "peut-etre": "Ok, je garde une place au chaud. Dis-moi vite !",
  non: "Snif. On trinquera à ta santé quand même.",
};

type Draft = { name: string; answer: Answer | null };

export default function Rsvp() {
  const { me } = useLive();
  // null : pas en train de modifier (on affiche la réponse enregistrée s'il y en a une)
  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const submitBtn = useRef<HTMLButtonElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  const form = draft ?? { name: "", answer: null };
  const editing = draft !== null || !me;
  const update = (patch: Partial<Draft>) => setDraft({ ...form, ...patch });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name || !form.answer || status === "sending") return;
    const answer = form.answer;
    const from = submitBtn.current?.getBoundingClientRect();
    const wasComing = me?.answer === "oui";

    // Les confettis partent tout de suite, sans attendre le serveur
    if (answer === "oui" && from) burstConfetti(from.left + from.width / 2, from.top + from.height / 2);

    setStatus("sending");
    try {
      await submitRsvp({ name, answer, website: honeypot.current?.value ?? "" });
      setDraft(null);
      setStatus("idle");
      // Le voyage jusqu'à « Ils seront là », seulement quand on vient de dire oui
      if (answer === "oui" && !wasComing && from) void flyToGuests(name, from, s.pill);
    } catch {
      setStatus("error");
    }
  };

  const startEditing = () => {
    if (me) setDraft({ name: me.name, answer: me.answer });
  };

  return (
    <section className={`${s.section} ${s.sky3}`} id="rsvp">
      <div className={`${s.wrap} ${s.rsvp}`}>
        <div>
          <span className={s.kicker}>✦ Réponds-moi</span>
          <h2 className={s.title}>
            Alors,
            <br />
            tu viens&nbsp;?
          </h2>
          <figure className={s.polaroid}>
            <div className={s.polaroidImg}>
              {EVENT.photos.rsvp ? (
                <Image src={EVENT.photos.rsvp.src} alt={EVENT.photos.rsvp.alt} fill sizes="(max-width: 800px) 60vw, 280px" />
              ) : (
                <PhotoPlaceholder variant="yay" />
              )}
            </div>
            <figcaption className={s.hand}>moi quand tu dis oui</figcaption>
          </figure>
        </div>

        <div className={s.card} data-land="">
          {!editing && me ? (
            <div className={s.thanks}>
              <p className={s.thanksBig}>C&apos;est noté, {me.name} !</p>
              <p className={s.hand}>{THANKS[me.answer]}</p>
              <button type="button" className={s.btn} onClick={startEditing}>
                Modifier ma réponse
              </button>
            </div>
          ) : (
            <form className={s.form} onSubmit={onSubmit}>
              <label className={s.field}>
                <span className={s.label}>Ton prénom</span>
                <input
                  className={s.input}
                  value={form.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="Beyoncé"
                  autoComplete="given-name"
                  maxLength={40}
                  required
                />
              </label>

              <div className={s.field} role="group" aria-label="Ta réponse">
                <span className={s.label}>Ta réponse</span>
                <div className={s.choices}>
                  {ANSWERS.map((a) => (
                    <button
                      key={a.key}
                      type="button"
                      className={s.choice}
                      aria-pressed={form.answer === a.key}
                      onClick={() => update({ answer: a.key })}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Champ piège pour les robots, invisible pour les humains */}
              <input ref={honeypot} name="website" className={s.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" />

              {status === "error" && <p className={s.formError}>Oups, ça n&apos;a pas marché. Réessaie dans un instant.</p>}

              <button
                ref={submitBtn}
                type="submit"
                className={`${s.btn} ${s.btnPrimary} ${s.submit}`}
                disabled={!form.name.trim() || !form.answer || status === "sending"}
              >
                {status === "sending" ? "Envoi…" : "Envoyer ma réponse →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
