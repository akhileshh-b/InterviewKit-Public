import React, { useEffect, useRef, useState, useCallback } from 'react';
import { loadSecureImage, renderSecureImage } from '@/utils/imageEncoder';

interface SecurePhotoProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const SecurePhoto: React.FC<SecurePhotoProps> = ({ 
  alt, 
  className = "", 
  width = 200, 
  height = 200 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
    if (
      (e.ctrlKey && (e.key === 's' || e.key === 'S')) ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
      e.key === 'F12'
    ) {
      e.preventDefault();
      return false;
    }
  }, []);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        // For public repository - show placeholder
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Create a simple placeholder
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, width, height);
        
        // Add placeholder text
        ctx.fillStyle = '#6b7280';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Photo', width / 2, height / 2 - 10);
        ctx.fillText('Placeholder', width / 2, height / 2 + 10);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading secure image:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadImage();
  }, [width, height]);

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${className}`}
          style={{ width, height }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
      />
    </div>
  );
};

export default SecurePhoto; 