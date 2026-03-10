import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  EyeOff,
  Settings,
  Palette,
  Type,
  Layout,
  Image as ImageIcon,
  Code,
  Save,
  Undo,
  Redo,
  Copy,
  Trash2,
  Plus,
  Move,
  Edit2,
  Layers,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useUniversalCMS } from '@/contexts/UniversalCMSContext';

interface ContentElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'video' | 'divider' | 'spacer' | 'html';
  content: any;
  styles: {
    width?: string;
    height?: string;
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: string;
    borderRadius?: string;
    border?: string;
    [key: string]: any;
  };
  settings: {
    visible?: boolean;
    animation?: string;
    responsive?: {
      desktop: any;
      tablet: any;
      mobile: any;
    };
  };
}

interface SectionData {
  elements: ContentElement[];
  styles: {
    backgroundColor?: string;
    backgroundImage?: string;
    padding?: string;
    margin?: string;
    minHeight?: string;
  };
  settings: {
    fullWidth?: boolean;
    containerMaxWidth?: string;
  };
}

const UniversalSectionEditor: React.FC<{
  sectionType: 'header' | 'body' | 'footer' | 'sidebar';
  onSave?: (data: SectionData) => void;
}> = ({ sectionType, onSave }) => {
  const { 
    state, 
    setPreviewMode, 
    updateContent, 
    updateStyles,
    trackEvent 
  } = useUniversalCMS();
  
  const [sectionData, setSectionData] = useState<SectionData>({
    elements: [
      {
        id: '1',
        type: 'text',
        content: { text: `Welcome to your ${sectionType} section`, tag: 'h1' },
        styles: { fontSize: '2rem', fontWeight: 'bold', color: '#333' },
        settings: { visible: true }
      },
      {
        id: '2',
        type: 'text',
        content: { text: 'This is a sample paragraph that you can edit.', tag: 'p' },
        styles: { fontSize: '1rem', color: '#666', margin: '1rem 0' },
        settings: { visible: true }
      }
    ],
    styles: {
      backgroundColor: '#ffffff',
      padding: '2rem 1rem'
    },
    settings: {
      fullWidth: false,
      containerMaxWidth: '1200px'
    }
  });

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setLocalPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isDirty, setIsDirty] = useState(false);
  const [draggedElement, setDraggedElement] = useState<ContentElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load section data on mount
  useEffect(() => {
    loadSectionData();
  }, [sectionType]);

  // Sync preview mode with global state
  useEffect(() => {
    setLocalPreviewMode(state.previewMode);
  }, [state.previewMode]);

  const loadSectionData = async () => {
    try {
      // Load from localStorage or API
      const key = `cms_section_${state.currentSite?.siteId}_${sectionType}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setSectionData(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load section data:', error);
    }
  };

  const saveSectionData = async () => {
    try {
      const key = `cms_section_${state.currentSite?.siteId}_${sectionType}`;
      localStorage.setItem(key, JSON.stringify(sectionData));
      
      // Update via Universal CMS context
      await updateContent(sectionType, 'main', sectionData);
      
      setIsDirty(false);
      trackEvent('section_saved', { sectionType, elementCount: sectionData.elements.length });
      
      if (onSave) {
        onSave(sectionData);
      }
    } catch (error) {
      console.error('Failed to save section data:', error);
    }
  };

  const addElement = (type: ContentElement['type']) => {
    const newElement: ContentElement = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      settings: { visible: true }
    };

    setSectionData(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
    
    setSelectedElement(newElement.id);
    setIsDirty(true);
    trackEvent('element_added', { type, sectionType });
  };

  const getDefaultContent = (type: ContentElement['type']) => {
    switch (type) {
      case 'text':
        return { text: 'New text element', tag: 'p' };
      case 'image':
        return { src: '/placeholder-image.jpg', alt: 'New image' };
      case 'button':
        return { text: 'Click me', href: '#', target: '_self' };
      case 'video':
        return { src: '', poster: '/placeholder-image.jpg' };
      case 'divider':
        return { style: 'solid' };
      case 'spacer':
        return { height: '2rem' };
      case 'html':
        return { html: '<div>Custom HTML</div>' };
      default:
        return {};
    }
  };

  const getDefaultStyles = (type: ContentElement['type']) => {
    switch (type) {
      case 'text':
        return { fontSize: '1rem', color: '#333', margin: '0.5rem 0' };
      case 'image':
        return { width: '100%', height: 'auto', borderRadius: '4px' };
      case 'button':
        return { 
          backgroundColor: '#007bff', 
          color: '#fff', 
          padding: '0.5rem 1rem', 
          borderRadius: '4px',
          textDecoration: 'none',
          display: 'inline-block'
        };
      case 'divider':
        return { 
          width: '100%', 
          height: '1px', 
          backgroundColor: '#ddd', 
          margin: '1rem 0' 
        };
      case 'spacer':
        return { width: '100%', height: '2rem' };
      default:
        return {};
    }
  };

  const updateElement = (elementId: string, updates: Partial<ContentElement>) => {
    setSectionData(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      )
    }));
    setIsDirty(true);
  };

  const deleteElement = (elementId: string) => {
    setSectionData(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId)
    }));
    
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
    
    setIsDirty(true);
    trackEvent('element_deleted', { elementId, sectionType });
  };

  const duplicateElement = (elementId: string) => {
    const element = sectionData.elements.find(el => el.id === elementId);
    if (!element) return;

    const newElement = {
      ...element,
      id: Date.now().toString()
    };

    setSectionData(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
    
    setIsDirty(true);
    trackEvent('element_duplicated', { originalId: elementId, sectionType });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const element = sectionData.elements.find(el => el.id === event.active.id);
    setDraggedElement(element || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSectionData(prev => {
        const oldIndex = prev.elements.findIndex(el => el.id === active.id);
        const newIndex = prev.elements.findIndex(el => el.id === over.id);
        
        return {
          ...prev,
          elements: arrayMove(prev.elements, oldIndex, newIndex)
        };
      });
      
      setIsDirty(true);
      trackEvent('elements_reordered', { sectionType });
    }
    
    setDraggedElement(null);
  };

  const SortableElement: React.FC<{ element: ContentElement }> = ({ element }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: element.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`relative group border rounded-lg p-3 ${
          selectedElement === element.id 
            ? 'border-primary bg-primary/5' 
            : 'border-muted hover:border-primary/50'
        }`}
        onClick={() => setSelectedElement(element.id)}
      >
        {/* Element Content Preview */}
        <div className="min-h-[50px] flex items-center">
          <ElementPreview element={element} />
        </div>

        {/* Element Controls */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                duplicateElement(element.id);
              }}
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                deleteElement(element.id);
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <Move className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Element Type Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 text-xs"
        >
          {element.type}
        </Badge>

        {/* Visibility Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            updateElement(element.id, {
              settings: {
                ...element.settings,
                visible: !element.settings.visible
              }
            });
          }}
        >
          {element.settings.visible ? (
            <Eye className="w-3 h-3" />
          ) : (
            <EyeOff className="w-3 h-3 text-muted-foreground" />
          )}
        </Button>
      </div>
    );
  };

  const ElementPreview: React.FC<{ element: ContentElement }> = ({ element }) => {
    switch (element.type) {
      case 'text':
        return (
          <div 
            style={element.styles}
            className="w-full"
          >
            {element.content.text}
          </div>
        );
      case 'image':
        return (
          <div className="flex items-center gap-2 w-full">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{element.content.alt || 'Image'}</span>
          </div>
        );
      case 'button':
        return (
          <div 
            style={element.styles}
            className="inline-block text-center cursor-pointer text-sm"
          >
            {element.content.text}
          </div>
        );
      case 'divider':
        return (
          <div 
            style={element.styles}
            className="w-full"
          />
        );
      case 'spacer':
        return (
          <div 
            style={element.styles}
            className="w-full bg-gray-100 border-dashed border flex items-center justify-center text-xs text-muted-foreground"
          >
            Spacer ({element.content.height})
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 w-full">
            <Code className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{element.type}</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold capitalize">{sectionType} Editor</h2>
          <p className="text-muted-foreground">
            Customize your {sectionType} with drag & drop elements
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Preview Mode Toggle */}
          <div className="flex border rounded-lg p-1">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setLocalPreviewMode('desktop');
                setPreviewMode('desktop');
              }}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setLocalPreviewMode('tablet');
                setPreviewMode('tablet');
              }}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setLocalPreviewMode('mobile');
                setPreviewMode('mobile');
              }}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <Button variant="outline" size="sm">
            <Undo className="w-4 h-4 mr-2" />
            Undo
          </Button>
          <Button variant="outline" size="sm">
            <Redo className="w-4 h-4 mr-2" />
            Redo
          </Button>
          <Button 
            onClick={saveSectionData}
            disabled={!isDirty}
            className="relative"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
            {isDirty && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Element Library */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {[
                  { type: 'text' as const, icon: Type, label: 'Text' },
                  { type: 'image' as const, icon: ImageIcon, label: 'Image' },
                  { type: 'button' as const, icon: Layout, label: 'Button' },
                  { type: 'video' as const, icon: Layout, label: 'Video' },
                  { type: 'divider' as const, icon: Layout, label: 'Divider' },
                  { type: 'spacer' as const, icon: Layout, label: 'Spacer' },
                  { type: 'html' as const, icon: Code, label: 'HTML' }
                ].map(({ type, icon: Icon, label }) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addElement(type)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Element List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={sectionData.elements.map(el => el.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="space-y-3">
                    {sectionData.elements.map((element) => (
                      <SortableElement key={element.id} element={element} />
                    ))}
                  </div>
                </SortableContext>
                
                <DragOverlay>
                  {draggedElement && (
                    <div className="border rounded-lg p-3 bg-background shadow-lg">
                      <ElementPreview element={draggedElement} />
                    </div>
                  )}
                </DragOverlay>
              </DndContext>

              {sectionData.elements.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No elements yet</p>
                  <p className="text-sm">Add elements from the left panel</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Properties Panel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              {selectedElement ? (
                <ElementPropertiesPanel
                  element={sectionData.elements.find(el => el.id === selectedElement)!}
                  onUpdate={(updates) => updateElement(selectedElement, updates)}
                />
              ) : (
                <SectionPropertiesPanel
                  sectionData={sectionData}
                  onUpdate={setSectionData}
                />
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Live Preview ({previewMode})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className={`border rounded-lg overflow-hidden transition-all duration-300 ${
              previewMode === 'mobile' ? 'max-w-sm' : 
              previewMode === 'tablet' ? 'max-w-2xl' : 'w-full'
            } mx-auto`}
          >
            <div 
              style={sectionData.styles}
              className="min-h-[200px] relative"
            >
              {sectionData.elements
                .filter(el => el.settings.visible)
                .map(element => (
                  <div
                    key={element.id}
                    style={element.styles}
                    className="element-preview"
                  >
                    <ElementPreview element={element} />
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Properties Panels (simplified for brevity)
const ElementPropertiesPanel: React.FC<{
  element: ContentElement;
  onUpdate: (updates: Partial<ContentElement>) => void;
}> = ({ element, onUpdate }) => {
  return (
    <Tabs defaultValue="content" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="space-y-4">
        {element.type === 'text' && (
          <>
            <div>
              <Label>Text Content</Label>
              <Textarea
                value={element.content.text}
                onChange={(e) => onUpdate({
                  content: { ...element.content, text: e.target.value }
                })}
              />
            </div>
            <div>
              <Label>HTML Tag</Label>
              <select
                value={element.content.tag}
                onChange={(e) => onUpdate({
                  content: { ...element.content, tag: e.target.value }
                })}
                className="w-full p-2 border rounded"
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="p">Paragraph</option>
                <option value="span">Span</option>
              </select>
            </div>
          </>
        )}
        {/* Add other element type content editors */}
      </TabsContent>

      <TabsContent value="style" className="space-y-4">
        <div>
          <Label>Font Size</Label>
          <Input
            value={element.styles.fontSize || ''}
            onChange={(e) => onUpdate({
              styles: { ...element.styles, fontSize: e.target.value }
            })}
            placeholder="1rem"
          />
        </div>
        <div>
          <Label>Color</Label>
          <Input
            type="color"
            value={element.styles.color || '#000000'}
            onChange={(e) => onUpdate({
              styles: { ...element.styles, color: e.target.value }
            })}
          />
        </div>
        {/* Add more style controls */}
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Visible</Label>
          <Switch
            checked={element.settings.visible}
            onCheckedChange={(checked) => onUpdate({
              settings: { ...element.settings, visible: checked }
            })}
          />
        </div>
        {/* Add more settings */}
      </TabsContent>
    </Tabs>
  );
};

const SectionPropertiesPanel: React.FC<{
  sectionData: SectionData;
  onUpdate: (data: SectionData) => void;
}> = ({ sectionData, onUpdate }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Section Settings</h3>
      
      <div>
        <Label>Background Color</Label>
        <Input
          type="color"
          value={sectionData.styles.backgroundColor || '#ffffff'}
          onChange={(e) => onUpdate({
            ...sectionData,
            styles: { ...sectionData.styles, backgroundColor: e.target.value }
          })}
        />
      </div>

      <div>
        <Label>Padding</Label>
        <Input
          value={sectionData.styles.padding || ''}
          onChange={(e) => onUpdate({
            ...sectionData,
            styles: { ...sectionData.styles, padding: e.target.value }
          })}
          placeholder="2rem 1rem"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Full Width</Label>
        <Switch
          checked={sectionData.settings.fullWidth}
          onCheckedChange={(checked) => onUpdate({
            ...sectionData,
            settings: { ...sectionData.settings, fullWidth: checked }
          })}
        />
      </div>
    </div>
  );
};

export default UniversalSectionEditor;