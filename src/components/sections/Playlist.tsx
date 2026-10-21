"use client";

import { THEME } from "@/themes";
import Title from "./Title";
import { skyClass, type Sky } from "@/lib/sky";
import { useState, type FormEvent } from "react";
import { addSong, removeSong, useLive } from "@/lib/live";
import { MAX_SONGS_PER_GUEST } from "@/lib/poll";
import DrawerTrigger from "../DrawerTrigger";
import { EVENT } from "@/data/event";
import s from "./sections.module.css";

// La playlist proposée par les invités, sans dire qui a proposé quoi (visible seulement dans l'admin)
const COPY = THEME.copy.playlist;
const Decor = THEME.decor.playlist;

export default function Playlist({ sky }: { sky: Sky }) {
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
    <section className={skyClass(s, sky)} style={sky.style} id="playlist">
      <div className={s.wrap}>
        <span className={s.kicker}>{COPY.kicker}</span>
        <Title lines={COPY.title} />

        {Decor && (
          <DrawerTrigger className={s.deco} style={{ right: "4%", top: "-2%", width: "clamp(70px, 9vw, 120px)", rotate: "12deg" }}>
            <Decor />
          </DrawerTrigger>
        )}

        <div className={s.playlist}>
          <div className={s.vinylWrap}>
            <div className={s.vinylGlow} />
            <div className={s.vinyl}>
              <div className={s.vinylLabel}>
                <span>
                  {EVENT.name.toUpperCase()}
                  <small>{EVENT.texts.vinyl}</small>
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
                        title={COPY.remove}
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
              <p className={s.hand}>{COPY.empty}</p>
            )}

            {/* Proposer un son : anonyme sur le site, seule l'admin voit qui l'a proposé */}
            <div className={s.songBox}>
              {me ? (
                <form className={s.songForm} onSubmit={onSubmit}>
                  <label className={s.field}>
                    <span className={s.label}>{COPY.label}</span>
                    <input
                      className={s.input}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={COPY.placeholder}
                      maxLength={100}
                      disabled={full}
                    />
                  </label>
                  <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={!title.trim() || status === "sending" || full}>
                    {status === "sending" ? COPY.adding : COPY.add}
                  </button>
                  {status === "error" && <p className={s.formError}>{COPY.error}</p>}
                  {full && <p className={s.songHint}>{COPY.full(MAX_SONGS_PER_GUEST)}</p>}
                </form>
              ) : (
                <p className={s.songHint}>
                  {COPY.answerFirst} <a href="#rsvp">{COPY.answerLink}</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
