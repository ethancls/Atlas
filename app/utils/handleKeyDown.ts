export const handleKeyDown = (modal: HTMLDivElement) => {
  return (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleKeyDown(modal));
    }
  };
};