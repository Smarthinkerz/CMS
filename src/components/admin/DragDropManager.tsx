import React, { useState, useRef, useEffect } from 'react';
import { Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Position {
  x: number;
  y: number;
  z?: number;
}

interface DragDropElement {
  id: string;
  type: 'nav-item' | 'logo' | 'content-block' | 'image' | 'video' | 'text' | 'section' | 'social';
  position: Position;
  locked: boolean;
  container?: string;
}

interface DragDropManagerProps {
  element: DragDropElement;
  onPositionChange: (id: string, position: Position) => void;
  onLockToggle: (id: string, locked: boolean) => void;
  children: React.ReactNode;
  isEditMode: boolean;
  showControls?: boolean;
  gridSnap?: boolean;
  snapSize?: number;
}

const DragDropManager: React.FC<DragDropManagerProps> = ({
  element,
  onPositionChange,
  onLockToggle,
  children,
  isEditMode,
  showControls = true,
  gridSnap = false,
  snapSize = 10
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (element.locked || !isEditMode) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || element.locked) return;

    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;

    // Grid snapping
    if (gridSnap) {
      newX = Math.round(newX / snapSize) * snapSize;
      newY = Math.round(newY / snapSize) * snapSize;
    }

    // Container bounds checking
    const container = elementRef.current?.parentElement;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = elementRef.current?.getBoundingClientRect();
      
      if (elementRect) {
        newX = Math.max(0, Math.min(newX, containerRect.width - elementRect.width));
        newY = Math.max(0, Math.min(newY, containerRect.height - elementRect.height));
      }
    }

    onPositionChange(element.id, { x: newX, y: newY, z: element.position.z });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, element.locked]);

  const moveElement = (direction: 'up' | 'down' | 'left' | 'right', amount: number = 10) => {
    if (element.locked) return;

    const newPosition = { ...element.position };
    
    switch (direction) {
      case 'up':
        newPosition.y = Math.max(0, newPosition.y - amount);
        break;
      case 'down':
        newPosition.y = newPosition.y + amount;
        break;
      case 'left':
        newPosition.x = Math.max(0, newPosition.x - amount);
        break;
      case 'right':
        newPosition.x = newPosition.x + amount;
        break;
    }

    onPositionChange(element.id, newPosition);
  };

  const resetPosition = () => {
    if (element.locked) return;
    onPositionChange(element.id, { x: 0, y: 0, z: element.position.z });
  };

  const toggleLock = () => {
    onLockToggle(element.id, !element.locked);
  };

  return (
    <div
      ref={elementRef}
      className={`relative ${isEditMode ? 'cursor-move' : ''} ${
        isDragging ? 'z-50' : ''
      } ${isHovered && isEditMode ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
      style={{
        transform: `translate(${element.position.x}px, ${element.position.y}px)`,
        position: 'relative',
        zIndex: isEditMode ? (isDragging ? 9999 : (element.position.z || 200)) : (element.position.z || 1),
        pointerEvents: isEditMode ? 'auto' : 'auto'
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {/* Control Panel */}
      {isEditMode && showControls && (isHovered || isDragging) && (
        <div className="absolute -top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex items-center gap-1" style={{ zIndex: 10000 }}>
          {/* Directional Controls */}
          <div className="grid grid-cols-3 gap-1">
            <div></div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => moveElement('up')}
              disabled={element.locked}
            >
              <ArrowUp className="w-3 h-3" />
            </Button>
            <div></div>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => moveElement('left')}
              disabled={element.locked}
            >
              <ArrowLeft className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={resetPosition}
              disabled={element.locked}
              title="Reset Position"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => moveElement('right')}
              disabled={element.locked}
            >
              <ArrowRight className="w-3 h-3" />
            </Button>
            
            <div></div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => moveElement('down')}
              disabled={element.locked}
            >
              <ArrowDown className="w-3 h-3" />
            </Button>
            <div></div>
          </div>

          {/* Lock Toggle */}
          <div className="border-l border-gray-300 pl-2 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={toggleLock}
              title={element.locked ? "Unlock Element" : "Lock Element"}
            >
              {element.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            </Button>
          </div>

          {/* Position Display */}
          <div className="border-l border-gray-300 pl-2 ml-2 text-xs text-gray-600">
            X:{Math.round(element.position.x)} Y:{Math.round(element.position.y)}
          </div>
        </div>
      )}

      {/* Drag Handle */}
      {isEditMode && isHovered && !element.locked && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 cursor-move" style={{ zIndex: 10000 }}>
          <Move className="w-3 h-3" />
        </div>
      )}

      {/* Lock Indicator */}
      {element.locked && isEditMode && (
        <div className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1" style={{ zIndex: 10000 }}>
          <Lock className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};

export default DragDropManager;