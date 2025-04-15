import { useRef } from 'react';

export const useSelectChain = () => {
  const selectRefs = useRef([]);

  const attachRef = (index) => (ref) => {
    if (ref) selectRefs.current[index] = ref;
  };

  const focusAndOpenNext = (index) => {
    const next = selectRefs.current[index + 1];
    if (next && typeof next.focus === 'function') {
      next.focus();

      const event = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      next.dispatchEvent(event);
    }
  };

  return { attachRef, focusAndOpenNext };
};
