import { animate, stagger } from "motion";

export function animateEntrance(
  elements: Element | Element[] | NodeList,
  options?: { delay?: number; y?: number; stagger?: number },
): void {
  const targets = "length" in elements ? Array.from(elements) : [elements];
  if (targets.length === 0) return;
  animate(
    targets as HTMLElement[],
    { opacity: [0, 1], transform: [`translateY(${options?.y ?? 18}px)`, "translateY(0px)"] },
    {
      duration: 0.65,
      delay: stagger(options?.stagger ?? 0.07, { startDelay: options?.delay ?? 0 }),
      ease: [0.22, 1, 0.36, 1],
    },
  );
}

export function pulseGlow(el: HTMLElement): void {
  animate(
    el,
    { boxShadow: ["0 0 0 0 rgba(99,102,241,0.45)", "0 0 0 14px rgba(99,102,241,0)"] },
    { duration: 0.9, repeat: 2, ease: "easeOut" },
  );
}
