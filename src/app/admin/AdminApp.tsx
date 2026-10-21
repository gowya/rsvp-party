"use client";

import { useEffect, useState, type FormEvent } from "react";
import { EVENT } from "@/data/event";
import { POLL_ITEMS, type Answer } from "@/lib/poll";
import s from "./admin.module.css";

type Row = {
  id: string;
  name: string;
  answer: Answer;
  songs: string[];
  brings: string[];
  brings_others: string[];
  created_at: string;
  updated_at: string;
};

const ANSWER_LABEL: Record<Answer, string> = {
  oui: "Oui 🔥",
  "peut-etre": "Peut-être 🤔",
  non: "Non 😢",
};
const PASS_KEY = `${EVENT.storageKey}-admin`;

type Result = { kind: "ok"; rows: Row[]; demo: boolean } | { kind: "unauthorized" } | { kind: "error" };

async function fetchResponses(password: string): Promise<Result> {
  try {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.status === 401) return { kind: "unauthorized" };
    if (!res.ok) return { kind: "error" };
    const data = (await res.json()) as { responses: Row[]; demo?: boolean };
    return { kind: "ok", rows: data.responses, demo: Boolean(data.demo) };
  } catch {
    return { kind: "error" };
  }
}

const dateFr = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

// L'admin des organisateurs : toutes les réponses, qui ramène quoi, qui a proposé quel son
export default function AdminApp() {
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState(false);

  // Applique la réponse de l'API admin (appelé après la requête, jamais pendant le rendu)
  const apply = (pass: string, result: Result) => {
    setLoading(false);
    if (result.kind === "ok") {
      setRows(result.rows);
      setDemo(result.demo);
      setPassword(pass);
      setError(null);
      try {
        sessionStorage.setItem(PASS_KEY, pass);
      } catch {}
    } else {
      setError(result.kind === "unauthorized" ? "Mauvais mot de passe." : "Impossible de charger les réponses, réessaie.");
      if (result.kind === "unauthorized") setRows(null);
    }
  };

  const load = (pass: string) => {
    setLoading(true);
    void fetchResponses(pass).then((result) => apply(pass, result));
  };

  const onLogin = (e: FormEvent) => {
    e.preventDefault();
    load(password);
  };

  // Reprend la session si le mot de passe a déjà été donné dans cet onglet
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(PASS_KEY);
    } catch {}
    if (saved) void fetchResponses(saved).then((result) => apply(saved, result));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async (row: Row) => {
    if (!window.confirm(`Supprimer la réponse de ${row.name} ?`)) return;
    const res = await fetch("/api/admin", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, id: row.id }),
    });
    if (res.ok) setRows((r) => r?.filter((x) => x.id !== row.id) ?? null);
    else setError("La suppression n'a pas marché.");
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(PASS_KEY);
    } catch {}
    setRows(null);
    setPassword("");
  };

  if (!rows) {
    return (
      <main className={s.page}>
        <form className={s.login} onSubmit={onLogin}>
          <h1 className={s.title}>Admin</h1>
          <p className={s.muted}>{EVENT.title}</p>
          <input
            className={s.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            autoComplete="current-password"
            autoFocus
          />
          {error && <p className={s.error}>{error}</p>}
          <button className={s.btn} type="submit" disabled={!password || loading}>
            {loading ? "…" : "Entrer"}
          </button>
        </form>
      </main>
    );
  }

  const coming = rows.filter((r) => r.answer !== "non");
  const total = (a: Answer) => rows.filter((r) => r.answer === a).length;
  const songs = rows.flatMap((r) => r.songs.map((title, i) => ({ key: `${r.id}-${i}`, title, name: r.name })));

  return (
    <main className={s.page}>
      <header className={s.head}>
        <div>
          <h1 className={s.title}>Admin</h1>
          <p className={s.muted}>
            {EVENT.title} · {rows.length} réponse{rows.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className={s.headActions}>
          <button className={s.btnGhost} type="button" onClick={() => load(password)} disabled={loading}>
            {loading ? "…" : "Rafraîchir"}
          </button>
          <button className={s.btnGhost} type="button" onClick={logout}>
            Sortir
          </button>
        </div>
      </header>

      {error && <p className={s.error}>{error}</p>}
      {demo && (
        <p className={s.demo}>
          Démo en lecture seule : seules les réponses d&apos;exemple s&apos;affichent ici, et la suppression est désactivée.
        </p>
      )}

      <section className={s.stats}>
        {(["oui", "peut-etre", "non"] as Answer[]).map((a) => (
          <div key={a} className={s.stat}>
            <span className={s.statNum}>{total(a)}</span>
            <span className={s.muted}>{ANSWER_LABEL[a]}</span>
          </div>
        ))}
      </section>

      {EVENT.sections.poll && (
        <section className={s.block}>
          <h2 className={s.h2}>Qui ramène quoi</h2>
          <ul className={s.brings}>
            {POLL_ITEMS.map((it) => {
              const names = coming.filter((r) => r.brings.includes(it.key)).map((r) => r.name);
              return (
                <li key={it.key} className={s.bring}>
                  <span className={s.bringHead}>
                    {it.emoji} {it.label}{" "}
                    <strong>
                      {names.length}
                      {it.limit !== null ? `/${it.limit}` : ""}
                    </strong>
                  </span>
                  <span className={s.muted}>{names.length ? names.join(", ") : "Personne pour l'instant"}</span>
                </li>
              );
            })}
            <li className={s.bring}>
              <span className={s.bringHead}>
                ➕ Autre chose <strong>{coming.reduce((n, r) => n + r.brings_others.length, 0)}</strong>
              </span>
              <span className={s.muted}>
                {coming
                  .filter((r) => r.brings_others.length)
                  .map((r) => `${r.name} : ${r.brings_others.join(", ")}`)
                  .join(" · ") || "Personne pour l'instant"}
              </span>
            </li>
          </ul>
        </section>
      )}

      {EVENT.sections.playlist && (
        <section className={s.block}>
          <h2 className={s.h2}>La playlist</h2>
          {songs.length ? (
            <ol className={s.songs}>
              {songs.map((song) => (
                <li key={song.key}>
                  <strong>{song.title}</strong> <span className={s.muted}>proposé par {song.name}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className={s.muted}>Aucun son proposé pour l&apos;instant.</p>
          )}
        </section>
      )}

      <section className={s.block}>
        <h2 className={s.h2}>Toutes les réponses</h2>
        {rows.length === 0 ? (
          <p className={s.muted}>Personne n&apos;a encore répondu.</p>
        ) : (
          <ul className={s.rows}>
            {rows.map((r) => (
              <li key={r.id} className={s.row}>
                <div className={s.rowMain}>
                  <strong className={s.rowName}>{r.name}</strong>
                  <span className={`${s.badge} ${s[`badge_${r.answer.replace("-", "")}`]}`}>{ANSWER_LABEL[r.answer]}</span>
                </div>
                <div className={s.rowMeta}>
                  {r.songs.length > 0 && <span>♫ {r.songs.join(" · ")}</span>}
                  {(r.brings.length > 0 || r.brings_others.length > 0) && (
                    <span>
                      Ramène :{" "}
                      {r.brings
                        .map((b) => POLL_ITEMS.find((it) => it.key === b)?.label ?? b)
                        .concat(r.brings_others.map((o) => `➕ ${o}`))
                        .join(", ")}
                    </span>
                  )}
                  <span className={s.muted}>
                    Répondu le {dateFr(r.created_at)}
                    {r.updated_at !== r.created_at ? ` · modifié le ${dateFr(r.updated_at)}` : ""}
                  </span>
                </div>
                {!demo && (
                  <button
                    className={s.delete}
                    type="button"
                    onClick={() => void remove(r)}
                    aria-label={`Supprimer la réponse de ${r.name}`}
                  >
                    Supprimer
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
