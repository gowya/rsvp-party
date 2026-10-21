"use client";

import { useState, type FormEvent } from "react";
import { addSong, removeSong, useLive } from "@/lib/live";
import { MAX_SONGS_PER_GUEST } from "@/lib/poll";
import { CocktailMojito } from "../Cocktails";
import { EVENT } from "@/data/event";
import s from "./sections.module.css";

// La playlist proposée par les invités, sans dire qui a proposé quoi (visible seulement dans l'admin)
export default function Playlist() {
  const { songs, me } = useLive();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const mine = me?.songs ?? [];
  const full = mine.length >= MAX_SONGS_PER_GUEST;

  // La liste publique est anonyme : on retrouve ses propres sons par leur titre pour y mettre la poubelle
  const unclaimed = [...mine];
  const rows = songs.map((song) => {
    const i = unclaimed.findIndex((m) => m.title === song.title);
    const own = i >= 0 ? unclaimed.splice(i, 1)[0] : null;
    return { ...song, ownId: own?.id ?? null };
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const clean = title.trim();
    if (!clean || status === "sending" || full) return;
    setStatus("sending");
    try {
      await addSong(clean);
      setTitle("");
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className={`${s.section} ${s.sky6} ${s.dark}`} id="playlist">
      <div className={s.wrap}>
        <span className={s.kicker}>✦ Proposée par vous</span>
        <h2 className={s.title}>
          La
          <br />
          <span className={s.sunset}>playlist</span>
        </h2>

        <div className={s.deco} style={{ right: "4%", top: "-2%", width: "clamp(70px, 9vw, 120px)", rotate: "12deg" }}>
          <CocktailMojito />
        </div>

        <div className={s.playlist}>
          <div className={s.vinylWrap}>
            <div className={s.vinylGlow} />
            <div className={s.vinyl}>
              <div className={s.vinylLabel}>
                <span>
                  {EVENT.name.toUpperCase()}
                  <small>
                    {EVENT.dateShort} · {EVENT.age} ANS
                  </small>
                </span>
              </div>
            </div>
            <div className={s.vinylShine} />
          </div>

          <div>
            {songs.length > 0 ? (
              <ol className={s.tracks}>
                {rows.map((song, i) => (
                  <li key={song.id} className={s.track}>
                    <span className={s.trackNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={s.trackTitle}>{song.title}</span>
                    {song.ownId && (
                      <button
                        type="button"
                        className={s.trackDelete}
                        onClick={() => void removeSong(song.ownId as string)}
                        aria-label={`Retirer ${song.title}`}
                        title="Retirer mon son"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <p className={s.hand}>Pas encore de son proposé… lance la soirée avec le premier ↓</p>
            )}

            {/* Proposer un son : anonyme sur le site, seule l'admin voit qui l'a proposé */}
            <div className={s.songBox}>
              {me ? (
                <form className={s.songForm} onSubmit={onSubmit}>
                  <label className={s.field}>
                    <span className={s.label}>Un son à proposer</span>
                    <input
                      className={s.input}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Dancing Queen, ABBA"
                      maxLength={100}
                      disabled={full}
                    />
                  </label>
                  <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={!title.trim() || status === "sending" || full}>
                    {status === "sending" ? "Ajout…" : "Ajouter ♫"}
                  </button>
                  {status === "error" && <p className={s.formError}>Oups, ça n&apos;a pas marché. Réessaie.</p>}
                  {full && <p className={s.songHint}>Tu as proposé tes {MAX_SONGS_PER_GUEST} sons, merci DJ.</p>}
                </form>
              ) : (
                <p className={s.songHint}>
                  Réponds d&apos;abord au formulaire pour proposer un son. <a href="#rsvp">Je réponds ↑</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
