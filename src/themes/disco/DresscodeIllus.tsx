"use client";

import { DrinkMargarita, DrinkSpritz } from "./illus/Drinks";
import { INK } from "@/components/illus/shared";
import s from "./DresscodeIllus.module.css";

const o = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

// Le look du dress code, posé à plat : un t-shirt jaune entre deux cocktails
export default function DresscodeIllus({ className }: { className?: string }) {
  return (
    <div className={`${s.wrap} ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 200 190" className={s.tee}>
        <path
          d="M64 16 C72 30 128 30 136 16 L182 36 L168 82 L146 74 L148 178 L52 178 L54 74 L32 82 L18 36 Z"
          fill="#ffd95a"
          {...o}
        />
        {/* Col côtelé */}
        <path d="M64 16 C72 30 128 30 136 16" fill="none" stroke="#f2b53a" strokeWidth="7" strokeLinecap="round" />
        <path d="M64 16 C72 30 128 30 136 16" fill="none" {...o} />
      </svg>
      <DrinkMargarita className={`${s.drink} ${s.drinkLeft}`} />
      <DrinkSpritz className={`${s.drink} ${s.drinkRight}`} />
    </div>
  );
}
