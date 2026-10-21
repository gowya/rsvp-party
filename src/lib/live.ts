"use client";

import { useSyncExternalStore } from "react";
import { EVENT } from "@/data/event";
import type { Answer, PublicState } from "./poll";

// L'état en direct du site (réponses de tout le monde), partagé par toutes les sections

export type Live = PublicState & {
  loaded: boolean;
  error: boolean;
  // true pendant que la pastille de la personne vole jusqu'à « Ils seront là »
  flying: boolean;
};

const EMPTY: Live = { guests: [], counts: {}, songs: [], others: [], me: null, address: null, loaded: false, error: false, flying: false };

let state: Live = EMPTY;
const listeners = new Set<() => void>();

function emit(next: Partial<Live>) {
  const merged = { ...state, ...next };
  // Rien n'a changé (cas le plus courant à chaque rafraîchissement) : on ne redessine rien
  if (JSON.stringify(merged) === JSON.stringify(state)) return;
  state = merged;
  listeners.forEach((l) => l());
}

export function useLive() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => EMPTY,
  );
}

export const setFlying = (flying: boolean) => emit({ flying });

// Un identifiant aléatoire par téléphone : permet de modifier sa réponse sans doublon
const TOKEN_KEY = `${EVENT.storageKey}-token`;
let memoryToken: string | null = null;

function newToken() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function getToken() {
  try {
    let token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      token = newToken();
      localStorage.setItem(TOKEN_KEY, token);
    }
    return token;
  } catch {
    memoryToken ??= newToken();
    return memoryToken;
  }
}

async function call(path: string, init?: RequestInit): Promise<PublicState> {
  const res = await fetch(path, {
    cache: "no-store",
    ...init,
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
  });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

export async function refresh() {
  try {
    emit({ ...(await call(`/api/state?token=${getToken()}`)), loaded: true, error: false });
  } catch {
    emit({ loaded: true, error: true });
  }
}

export async function submitRsvp(input: { name: string; answer: Answer; website: string }) {
  const next = await call("/api/rsvp", { method: "POST", body: JSON.stringify({ token: getToken(), ...input }) });
  emit({ ...next, loaded: true, error: false });
  return next;
}

// Mise à jour immédiate à l'écran, puis enregistrement.
// Renvoie la clé du truc déjà complet si le serveur refuse (quelqu'un a coché juste avant)
export async function saveBrings(brings: string[], mineOthers: string[]): Promise<string | null> {
  const me = state.me;
  if (!me) return null;
  const counts = { ...state.counts };
  for (const k of me.brings) counts[k] = Math.max(0, (counts[k] ?? 0) - 1);
  for (const k of brings) counts[k] = (counts[k] ?? 0) + 1;
  // La liste des « autre chose » est mise à jour tout de suite aussi
  // On retire ses anciennes lignes (une occurrence chacune), puis on ajoute les nouvelles
  const others = [...state.others];
  for (const t of me.bringsOthers) {
    const i = others.findIndex((o) => o.title === t);
    if (i >= 0) others.splice(i, 1);
  }
  mineOthers.forEach((t, i) => others.push({ id: `autre-moi-${i}`, title: t }));
  emit({ me: { ...me, brings, bringsOthers: mineOthers }, counts, others });
  try {
    const res = await fetch("/api/brings", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: getToken(), brings, others: mineOthers }),
    });
    const data = await res.json();
    if (res.status === 409) {
      const { error: _error, key, ...rest } = data;
      emit(rest);
      return key as string;
    }
    if (!res.ok) throw new Error(String(res.status));
    emit(data);
  } catch {
    await refresh();
  }
  return null;
}

export async function addSong(title: string) {
  emit(await call("/api/songs", { method: "POST", body: JSON.stringify({ token: getToken(), title }) }));
}

export async function removeSong(id: string) {
  emit(await call("/api/songs", { method: "DELETE", body: JSON.stringify({ token: getToken(), id }) }));
}

// Rafraîchit toutes les 10 s quand la page est visible, et au retour sur l'onglet
export function startLiveSync() {
  void refresh();
  const id = window.setInterval(() => {
    if (document.visibilityState === "visible") void refresh();
  }, 10000);
  const onVisible = () => document.visibilityState === "visible" && void refresh();
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    window.clearInterval(id);
    document.removeEventListener("visibilitychange", onVisible);
  };
}
