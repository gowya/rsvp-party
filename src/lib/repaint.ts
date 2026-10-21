"use client";

/*
 * Safari (iPhone surtout) ne dessine pas les motifs SVG <pattern> placés sous une ombre CSS (drop-shadow)
 * tant que l'écran n'est pas rafraîchi : les illustrations paraissent unies jusqu'au premier scroll.
 * On force ce rafraîchissement en retouchant le remplissage des formes à motif.
 */
export function repaintPatterns(root: ParentNode = document) {
  const shapes = root.querySelectorAll<SVGElement>('[fill^="url(#"]');
  shapes.forEach((el) => {
    const fill = el.getAttribute("fill") as string;
    el.setAttribute("fill", "none");
    requestAnimationFrame(() => el.setAttribute("fill", fill));
  });
}

// Plusieurs passes : au chargement, puis une fois la mise en page stabilisée
export function repaintPatternsSoon(root?: ParentNode) {
  requestAnimationFrame(() => repaintPatterns(root));
  window.setTimeout(() => repaintPatterns(root), 400);
}
