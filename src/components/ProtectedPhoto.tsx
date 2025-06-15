import React, { useCallback } from 'react';

interface ProtectedPhotoProps {
  src: string;
  alt: string;
  className?: string;
}

const ProtectedPhoto: React.FC<ProtectedPhotoProps> = ({ src, alt, className = "" }) => {
  // Prevent right-click context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  }, []);

  // Prevent drag start
  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    return false;
  }, []);

  // Prevent keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Prevent common download/save shortcuts
    if (
      (e.ctrlKey && (e.key === 's' || e.key === 'S')) || // Ctrl+S
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) || // Ctrl+Shift+I
      e.key === 'F12' // F12
    ) {
      e.preventDefault();
      return false;
    }
  }, []);

  return (
    <div className="relative select-none">
      {/* Invisible overlay to prevent interaction */}
      <div 
        className="absolute inset-0 z-10 bg-transparent cursor-default"
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        } as React.CSSProperties}
      />
      
      {/* Protected Image */}
      <img
        src={src}
        alt={alt}
        className={`${className} select-none pointer-events-none`}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onKeyDown={handleKeyDown}
        draggable={false}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitTouchCallout: 'none'
        } as React.CSSProperties}
      />
    </div>
  );
};

export default ProtectedPhoto; 