'use client';

import { useEffect } from 'react';

const TILT_SELECTOR = '[data-premium-tilt]';

function resetCard(card: HTMLElement) {
  card.removeAttribute('data-tilt-active');
  card.style.removeProperty('--tilt-x');
  card.style.removeProperty('--tilt-y');
  card.style.removeProperty('--tilt-glow-x');
  card.style.removeProperty('--tilt-glow-y');
}

export function PremiumTiltController() {
  useEffect(() => {
    const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!canTilt.matches || reducedMotion.matches) return;

    let activeCard: HTMLElement | null = null;
    let animationFrame: number | null = null;
    let latestPointer: PointerEvent | null = null;

    const updateTilt = () => {
      animationFrame = null;
      if (!activeCard || !latestPointer) return;

      const bounds = activeCard.getBoundingClientRect();
      const x = (latestPointer.clientX - bounds.left) / bounds.width;
      const y = (latestPointer.clientY - bounds.top) / bounds.height;
      const rotateX = (0.5 - y) * 4;
      const rotateY = (x - 0.5) * 4;

      activeCard.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
      activeCard.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
      activeCard.style.setProperty('--tilt-glow-x', `${(x * 100).toFixed(1)}%`);
      activeCard.style.setProperty('--tilt-glow-y', `${(y * 100).toFixed(1)}%`);
    };

    const onPointerOver = (event: PointerEvent) => {
      const target =
        event.target instanceof Element ? event.target.closest<HTMLElement>(TILT_SELECTOR) : null;
      if (!target || (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)))
        return;

      if (activeCard && activeCard !== target) resetCard(activeCard);
      activeCard = target;
      activeCard.setAttribute('data-tilt-active', 'true');
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!activeCard || !(event.target instanceof Node) || !activeCard.contains(event.target))
        return;
      latestPointer = event;
      if (animationFrame === null) animationFrame = window.requestAnimationFrame(updateTilt);
    };

    const onPointerOut = (event: PointerEvent) => {
      if (
        !activeCard ||
        (event.relatedTarget instanceof Node && activeCard.contains(event.relatedTarget))
      )
        return;
      resetCard(activeCard);
      activeCard = null;
      latestPointer = null;
    };

    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerout', onPointerOut);

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      if (activeCard) resetCard(activeCard);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerout', onPointerOut);
    };
  }, []);

  return null;
}
