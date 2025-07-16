/* Hook diseñado para ser reutilizado 
   cuando se tengan menús desplegables
   y el usuario haga click o touch afuera del menú,
   para que se cierre */

import { useEffect, useRef } from "react";

export default function useOutsideInteraction<T extends HTMLElement>(
    isActive: boolean,
    onOutsideInteraction: () => void
) {
    const ref = useRef<T>(null);

    useEffect(() => {
    const outside = (e: MouseEvent | TouchEvent) => {
      if (
        isActive &&
        ref.current &&
       !ref.current.contains(e.target as Node)
      ) {
        onOutsideInteraction();
      }
    };

    document.addEventListener('mousedown', outside);
    document.addEventListener('touchstart', outside);

    return () => {
      document.removeEventListener('mousedown', outside);
      document.removeEventListener('touchstart', outside);
    };
  }, [isActive, onOutsideInteraction]);

  return ref;
}