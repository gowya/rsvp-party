import { Fragment } from "react";
import type { TitleLine } from "@/themes/types";
import s from "./sections.module.css";

// Grand titre de section : une ligne par élément, avec la mise en valeur du thème (contour ou dégradé)
export default function Title({ lines }: { lines: TitleLine[] }) {
  return (
    <h2 className={s.title}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {typeof line === "string" ? line : <span className={line.style === "outline" ? s.outline : s.sunset}>{line.text}</span>}
        </Fragment>
      ))}
    </h2>
  );
}
