import React, { useState, useEffect } from 'react';
import { ReactNode } from 'react';

const FlashlightBackground = ({ children, gradient }: { children: ReactNode, gradient: string }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div
        className="fixed inset-0 bg-black opacity-80 pointer-events-none"
        style={{
          background: gradient.replace('$x', `${mousePosition.x}px`).replace('$y', `${mousePosition.y}px`)
        }}
      />
      {children}
    </div>
  );
};

export default FlashlightBackground;