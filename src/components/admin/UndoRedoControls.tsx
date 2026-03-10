import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo2, Redo2, RotateCcw } from 'lucide-react';

interface UndoRedoControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear?: () => void;
  sectionName?: string;
  className?: string;
}

const UndoRedoControls: React.FC<UndoRedoControlsProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  sectionName = '',
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        title={`Undo ${sectionName}`}
        className="h-8 w-8 p-0"
      >
        <Undo2 className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        title={`Redo ${sectionName}`}
        className="h-8 w-8 p-0"
      >
        <Redo2 className="w-4 h-4" />
      </Button>
      
      {onClear && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={!canUndo && !canRedo}
          title={`Clear ${sectionName} History`}
          className="h-8 w-8 p-0"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default UndoRedoControls;