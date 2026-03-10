import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  Lock, Unlock, Trash2, Eye, EyeOff, 
  Move, Square, Type, Image, Video
} from 'lucide-react';
import { useContentPositioning, ContentElement } from '@/hooks/useContentPositioning';

interface ContentEditorProps {
  pageId?: string;
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ 
  pageId, 
  isEditMode = true, 
  onToggleEditMode 
}) => {
  // Always call hooks at the top level
  const {
    pages,
    selectedElementId,
    setSelectedElementId,
    addElement,
    updateElementContent,
    updateElementPosition,
    updateElementSize,
    moveElementByDirection,
    toggleElementLock,
    deleteElement,
    bringToFront,
    sendToBack
  } = useContentPositioning();

  const [newElementType, setNewElementType] = useState<'text' | 'image' | 'video' | 'component'>('text');
  const [newContent, setNewContent] = useState('');

  // Early return after hooks
  if (!pageId) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No page selected</p>
      </div>
    );
  }

  const currentPage = pages.find(p => p.id === pageId);
  const selectedElement = selectedElementId ? pages.flatMap(p => p.elements).find(el => el.id === selectedElementId) : null;

  const handleAddElement = () => {
    if (!newContent.trim() || !pageId) return;

    const element = {
      type: newElementType,
      content: newElementType === 'text' ? newContent : { url: newContent, alt: 'Content' },
      position: { x: 100, y: 100 },
      size: { width: 200, height: 100 },
      zIndex: 1,
      locked: false
    };

    addElement(newElementType, pageId, { x: 100, y: 100 }, element.content);
    setNewContent('');
  };

  const handleContentChange = (content: any) => {
    if (selectedElementId) {
      updateElementContent(selectedElementId, content);
    }
  };

  const handlePositionChange = (field: 'x' | 'y', value: number) => {
    if (selectedElement) {
      const newPosition = { ...selectedElement.position, [field]: value };
      updateElementPosition(selectedElementId, newPosition);
    }
  };

  const handleSizeChange = (field: 'width' | 'height', value: number) => {
    if (selectedElement) {
      const newSize = { ...selectedElement.size, [field]: value };
      updateElementSize(selectedElementId, newSize);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Edit Mode Toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Content Editor</h2>
          {onToggleEditMode && (
            <Button 
              onClick={onToggleEditMode}
              variant={isEditMode ? "destructive" : "default"}
            >
              {isEditMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
            </Button>
          )}
        </div>

        {/* Add New Element */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Element</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={newElementType === 'text' ? 'default' : 'outline'}
                onClick={() => setNewElementType('text')}
                size="sm"
              >
                <Type className="w-4 h-4 mr-2" />
                Text
              </Button>
              <Button
                variant={newElementType === 'image' ? 'default' : 'outline'}
                onClick={() => setNewElementType('image')}
                size="sm"
              >
                <Image className="w-4 h-4 mr-2" />
                Image
              </Button>
              <Button
                variant={newElementType === 'video' ? 'default' : 'outline'}
                onClick={() => setNewElementType('video')}
                size="sm"
              >
                <Video className="w-4 h-4 mr-2" />
                Video
              </Button>
              <Button
                variant={newElementType === 'component' ? 'default' : 'outline'}
                onClick={() => setNewElementType('component')}
                size="sm"
              >
                <Square className="w-4 h-4 mr-2" />
                Component
              </Button>
            </div>
            
            <div className="flex gap-2">
              {newElementType === 'text' ? (
                <Textarea
                  placeholder="Enter text content..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
              ) : (
                <Input
                  placeholder={`Enter ${newElementType} URL...`}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
              )}
              <Button onClick={handleAddElement}>Add</Button>
            </div>
          </CardContent>
        </Card>

        {/* Element List */}
        <Card>
          <CardHeader>
            <CardTitle>Page Elements ({currentPage?.elements.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentPage?.elements.map((element) => (
                <div
                  key={element.id}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedElementId === element.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedElementId(element.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{element.type}</Badge>
                      <span className="text-sm font-medium">
                        {element.type === 'text' 
                          ? String(element.content).substring(0, 30) + '...'
                          : `${element.type} element`
                        }
                      </span>
                      {element.locked && <Lock className="w-3 h-3 text-gray-500" />}
                    </div>
                    <div className="text-xs text-gray-500">
                      {element.position.x}, {element.position.y}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Element Controls */}
        {selectedElement && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Move className="w-4 h-4" />
                Element Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Movement Controls */}
              <div>
                <label className="text-sm font-medium mb-2 block">Quick Movement</label>
                <div className="grid grid-cols-3 gap-2 w-fit">
                  <div></div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveElementByDirection(selectedElementId, 'up')}
                    disabled={selectedElement.locked}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <div></div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveElementByDirection(selectedElementId, 'left')}
                    disabled={selectedElement.locked}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveElementByDirection(selectedElementId, 'down')}
                    disabled={selectedElement.locked}
                  >
                    <ArrowUp className="w-4 h-4 rotate-180" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveElementByDirection(selectedElementId, 'right')}
                    disabled={selectedElement.locked}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Position Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">X Position</label>
                  <Input
                    type="number"
                    value={selectedElement.position.x}
                    onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                    disabled={selectedElement.locked}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Y Position</label>
                  <Input
                    type="number"
                    value={selectedElement.position.y}
                    onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                    disabled={selectedElement.locked}
                  />
                </div>
              </div>

              {/* Size Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Width</label>
                  <Input
                    type="number"
                    value={selectedElement.size.width}
                    onChange={(e) => handleSizeChange('width', Number(e.target.value))}
                    disabled={selectedElement.locked}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Height</label>
                  <Input
                    type="number"
                    value={selectedElement.size.height}
                    onChange={(e) => handleSizeChange('height', Number(e.target.value))}
                    disabled={selectedElement.locked}
                  />
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="text-sm font-medium mb-1 block">Content</label>
                {selectedElement.type === 'text' ? (
                  <Textarea
                    value={selectedElement.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    disabled={selectedElement.locked}
                  />
                ) : (
                  <Input
                    value={selectedElement.content?.url || ''}
                    onChange={(e) => handleContentChange({ ...selectedElement.content, url: e.target.value })}
                    disabled={selectedElement.locked}
                    placeholder="Enter URL..."
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleElementLock(selectedElementId)}
                >
                  {selectedElement.locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bringToFront(selectedElementId)}
                  disabled={selectedElement.locked}
                >
                  Front
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendToBack(selectedElementId)}
                  disabled={selectedElement.locked}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteElement(selectedElementId)}
                  disabled={selectedElement.locked}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;