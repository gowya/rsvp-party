"use client";

import { THEME } from "@/themes";
import Title from "./Title";
import { skyClass, type Sky } from "@/lib/sky";
import { useState } from "react";
import { EVENT } from "@/data/event";
import { saveBrings, useLive } from "@/lib/live";
import { MAX_OTHERS_PER_GUEST, OTHER_MAX, POLL_ITEMS } from "@/lib/poll";
import DrawerTrigger from "../DrawerTrigger";
import s from "./sections.module.css";

// Qui ramène quoi : on coche après avoir répondu, les prénoms ne sont visibles que dans l'admin
const COPY = THEME.copy.poll;
const Decor = THEME.decor.poll;

export default function Poll({ sky }: { sky: Sky }) {
  const { me, counts, others } = useLive();
  const picked = me?.brings ?? [];
  const canPick = Boolean(me && me.answer !== "non");
  // Saisie d'un « autre chose » (null : champ fermé)
  const [otherDraft, setOtherDraft] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const mineOthers = me?.bringsOthers ?? [];

  const save = async (brings: string[], others: string[]) => {
    const full = await saveBrings(brings, others);
    if (full) {
      const label = POLL_ITEMS.find((it) => it.key === full)?.label ?? full;
      setNotice(COPY.tooLate(label));
    } else setNotice(null);
  };

  const toggle = (key: string, isFull: boolean) => {
    if (!canPick) return;
    const on = picked.includes(key);
    if (!on && isFull) return;
    const next = on ? picked.filter((k) => k !== key) : [...picked, key];
    void save(next, mineOthers);
  };

  const saveOther = () => {
    const text = otherDraft?.trim();
    if (!text) return;
    setOtherDraft(null);
    if (!mineOthers.includes(text)) void save(picked, [...mineOthers, text]);
  };

  // Ses propres lignes « autre chose » sont cochées (une occurrence par proposition) : un tap les retire
  const ownIndexes = new Set<number>();
  for (const t of mineOthers) {
    const i = others.findIndex((o, j) => o.title === t && !ownIndexes.has(j));
    if (i >= 0) ownIndexes.add(i);
  }
  const otherRows = others.map((o, i) => ({ ...o, own: ownIndexes.has(i) }));

  const noLimitMax = Math.max(4, ...POLL_ITEMS.map((it) => counts[it.key] ?? 0));

  return (
    <section className={skyClass(s, sky)} style={sky.style} id="sondage">
      <div className={s.wrap}>
        <span className={s.kicker}>{COPY.kicker}</span>
        <Title lines={COPY.title} />
        <p className={s.hand} style={{ marginTop: 20 }}>
          {EVENT.texts.pollIntro}
        </p>

        {Decor && (
          <DrawerTrigger flip className={`${s.deco} ${s.pollCocktail}`}>
            <Decor />
          </DrawerTrigger>
        )}

        {!canPick && (
          <p className={s.pollGate}>
            {me ? (
              COPY.notComing
            ) : (
              <>
                {COPY.answerFirst} <a href="#rsvp">{COPY.answerLink}</a>
              </>
            )}
          </p>
        )}

        <div className={s.pollGrid}>
          {POLL_ITEMS.map((it) => {
            const on = picked.includes(it.key);
            const count = counts[it.key] ?? 0;
            const isFull = it.limit !== null && count >= it.limit && !on;
            const ratio = it.limit !== null ? Math.min(1, count / it.limit) : count / noLimitMax;
            return (
              <button
                key={it.key}
                type="button"
                className={s.pollItem}
                aria-pressed={on}
                aria-disabled={!canPick || isFull}
                data-full={isFull || undefined}
                onClick={() => toggle(it.key, isFull)}
              >
                <span className={s.pollBar} style={{ width: `${ratio * 100}%` }} />
                <span className={s.pollEmoji} aria-hidden="true">
                  {it.emoji}
                </span>
                <span className={s.pollLabel}>{it.label}</span>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <span className={s.pollCount}>
                    {isFull ? COPY.full : it.limit !== null ? `${count}/${it.limit}` : count}
                  </span>
                  <span className={s.pollCheck} aria-hidden="true">
                    {on ? "✓" : ""}
                  </span>
                </span>
              </button>
            );
          })}
          {otherRows.map((o) => (
            <button
              key={o.id}
              type="button"
              className={s.pollItem}
              aria-pressed={o.own}
              aria-disabled={!o.own}
              onClick={() => o.own && void save(picked, mineOthers.filter((t) => t !== o.title))}
              title={o.own ? COPY.otherRemove : undefined}
            >
              <span className={s.pollEmoji} aria-hidden="true">
                ➕
              </span>
              <span className={s.pollLabel}>{o.title}</span>
              <span style={{ display: "flex", alignItems: "center" }}>
                <span className={s.pollCheck} aria-hidden="true">
                  {o.own ? "✓" : ""}
                </span>
              </span>
            </button>
          ))}
        </div>

        {canPick &&
          MAX_OTHERS_PER_GUEST > 0 &&
          mineOthers.length < MAX_OTHERS_PER_GUEST &&
          (otherDraft === null ? (
            <button type="button" className={s.otherPill} onClick={() => setOtherDraft("")}>
              {COPY.other}
              {mineOthers.length > 0 && <span className={s.otherCount}> ({mineOthers.length}/{MAX_OTHERS_PER_GUEST})</span>}
            </button>
          ) : (
            <form
              className={s.pollOther}
              onSubmit={(e) => {
                e.preventDefault();
                saveOther();
              }}
            >
              <label className={s.field}>
                <span className={s.label}>{COPY.otherLabel}</span>
                <input
                  className={s.input}
                  value={otherDraft}
                  onChange={(e) => setOtherDraft(e.target.value)}
                  placeholder={COPY.otherPlaceholder}
                  maxLength={OTHER_MAX}
                  autoFocus
                />
              </label>
              <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={!otherDraft.trim()}>
                {COPY.ok}
              </button>
            </form>
          ))}

        {notice && <p className={s.pollNotice}>{notice}</p>}
      </div>
    </section>
  );
}
