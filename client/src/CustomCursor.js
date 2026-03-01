import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over a button or link
      const target = e.target;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: isPointer ? '60px' : '20px',
        height: isPointer ? '60px' : '20px',
        backgroundColor: 'white',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `translate(${position.x - (isPointer ? 30 : 10)}px, ${position.y - (isPointer ? 30 : 10)}px)`,
        transition: 'width 0.3s, height 0.3s, transform 0.1s ease-out',
        mixBlendMode: 'difference'
      }}
    />
  );
};

export default CustomCursor;