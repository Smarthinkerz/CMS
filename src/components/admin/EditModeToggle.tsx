import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Eye, Grid, Lock, Unlock, RotateCcw } from 'lucide-react';

interface EditModeToggleProps {
  isEditMode: boolean;
  onToggle: (enabled: boolean) => void;
  elementsCount: number;
  lockedCount: number;
  onUnlockAll: () => void;
  onResetAll: () => void;
  gridSnap: boolean;
  onGridSnapToggle: (enabled: boolean) => void;
}

const EditModeToggle: React.FC<EditModeToggleProps> = ({
  isEditMode,
  onToggle,
  elementsCount,
  lockedCount,
  onUnlockAll,
  onResetAll,
  gridSnap,
  onGridSnapToggle
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
      <div className="flex items-center gap-3">
        {/* Edit Mode Toggle */}
        <Button
          variant={isEditMode ? "default" : "outline"}
          size="sm"
          onClick={() => onToggle(!isEditMode)}
          className="flex items-center gap-2"
        >
          {isEditMode ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {isEditMode ? 'Edit Mode' : 'View Mode'}
        </Button>

        {isEditMode && (
          <>
            {/* Grid Snap Toggle */}
            <Button
              variant={gridSnap ? "default" : "outline"}
              size="sm"
              onClick={() => onGridSnapToggle(!gridSnap)}
              className="flex items-center gap-2"
              title="Toggle Grid Snap"
            >
              <Grid className="w-4 h-4" />
              {gridSnap ? 'Snap On' : 'Snap Off'}
            </Button>

            {/* Element Stats */}
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {elementsCount} Elements
              </Badge>
              {lockedCount > 0 && (
                <Badge variant="secondary">
                  {lockedCount} Locked
                </Badge>
              )}
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-1 border-l border-gray-300 pl-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onUnlockAll}
                disabled={lockedCount === 0}
                title="Unlock All Elements"
              >
                <Unlock className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetAll}
                title="Reset All Positions"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {isEditMode && (
        <div className="mt-2 text-xs text-gray-600">
          Hover over elements to see controls. Drag to move, use arrows for precise positioning.
        </div>
      )}
    </div>
  );
};

export default EditModeToggle;