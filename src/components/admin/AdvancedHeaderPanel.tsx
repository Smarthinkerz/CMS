import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useConfig } from '@/hooks/useConfig';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import UndoRedoControls from '@/components/admin/UndoRedoControls';
import { 
  Upload,
  Move,
  Trash2,
  Copy,
  RotateCcw,
  MousePointer2,
  Layers,
  Eye,
  Save,
  Plus,
  GripVertical,
  Settings,
  Image as ImageIcon,
  Type,
  Palette
} from 'lucide-react';

interface LogoElement {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
  visible: boolean;
  opacity: number;
  rotation: number;
}

interface TextElement {
  id: string;
  content: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  fontFamily: string;
  x: number;
  y: number;
  zIndex: number;
  visible: boolean;
  opacity: number;
  rotation: number;
}

interface AdvancedHeaderConfig {
  backgroundColor: string;
  backgroundGradient: string;
  height: string;
  padding: string;
  borderBottom: boolean;
  borderColor: string;
  boxShadow: boolean;
  sticky: boolean;
  logos: LogoElement[];
  textElements: TextElement[];
  layoutMode: 'absolute' | 'flexbox' | 'grid';
  gridColumns: number;
  justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  alignItems: 'flex-start' | 'center' | 'flex-end';
}

const AdvancedHeaderPanel: React.FC = () => {
  const { headerConfig, updateHeaderConfig } = useConfig();
  
  // Initialize undo/redo for header configuration
  const defaultAdvancedConfig: AdvancedHeaderConfig = {
    backgroundColor: '#ffffff',
    backgroundGradient: 'linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)',
    height: '80px',
    padding: '20px',
    borderBottom: true,
    borderColor: '#e5e7eb',
    boxShadow: true,
    sticky: true,
    logos: [
      {
        id: 'main-logo',
        url: '/Logo.jpg',
        alt: 'Main Logo',
        width: 50,
        height: 50,
        x: 20,
        y: 15,
        zIndex: 10,
        visible: true,
        opacity: 1,
        rotation: 0
      }
    ],
    textElements: [
      {
        id: 'brand-text',
        content: 'THE FRANKINCENSE',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#2F5B3C',
        fontFamily: 'Cinzel Decorative',
        x: 80,
        y: 20,
        zIndex: 9,
        visible: true,
        opacity: 1,
        rotation: 0
      }
    ],
    layoutMode: 'absolute',
    gridColumns: 3,
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  // Undo/Redo state management for header configuration  
  const headerUndoRedo = useUndoRedo(defaultAdvancedConfig, { maxHistorySize: 50 });

  const [selectedElement, setSelectedElement] = useState<string>('');
  const [dragMode, setDragMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [dragPosition, setDragPosition] = useState<{x: number, y: number} | null>(null);
  const [showGuides, setShowGuides] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use undo/redo present state as the current config
  const currentAdvancedConfig = headerUndoRedo.present;

  // Update function that adds to history
  const updateAdvancedConfig = useCallback((updates: Partial<AdvancedHeaderConfig>) => {
    const newConfig = { ...currentAdvancedConfig, ...updates };
    headerUndoRedo.set(newConfig);
  }, [currentAdvancedConfig, headerUndoRedo]);

  // Default configuration for reset functionality
  const defaultConfig: AdvancedHeaderConfig = {
    backgroundColor: '#ffffff',
    backgroundGradient: 'linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)',
    height: '80px',
    padding: '20px',
    borderBottom: true,
    borderColor: '#e5e7eb',
    boxShadow: true,
    sticky: true,
    logos: [
      {
        id: 'main-logo',
        url: '/Logo.jpg',
        alt: 'Main Logo',
        width: 50,
        height: 50,
        x: 20,
        y: 15,
        zIndex: 10,
        visible: true,
        opacity: 1,
        rotation: 0
      }
    ],
    textElements: [
      {
        id: 'brand-text',
        content: 'THE FRANKINCENSE',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#2F5B3C',
        fontFamily: 'Cinzel Decorative',
        x: 80,
        y: 20,
        zIndex: 9,
        visible: true,
        opacity: 1,
        rotation: 0
      }
    ],
    layoutMode: 'absolute',
    gridColumns: 3,
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  // Default navigation configuration for reset functionality
  const defaultNavItems = [
    { id: 'home', label: 'HOME', href: '/', color: '#374151', fontSize: '14px', position: { x: 600, y: 25 }, visible: true, locked: false },
    { id: 'history', label: 'HISTORY', href: '/history', color: '#374151', fontSize: '14px', position: { x: 660, y: 25 }, visible: true, locked: false },
    { id: 'benefits', label: 'BENEFITS', href: '/benefits', color: '#374151', fontSize: '14px', position: { x: 730, y: 25 }, visible: true, locked: false },
    { id: 'ritual', label: 'RITUAL', href: '/ritual', color: '#374151', fontSize: '14px', position: { x: 810, y: 25 }, visible: true, locked: false },
    { id: 'shop', label: 'SHOP', href: '/products', color: '#374151', fontSize: '14px', position: { x: 870, y: 25 }, visible: true, locked: false },
    { id: 'contact', label: 'CONTACT', href: '/contact', color: '#374151', fontSize: '14px', position: { x: 920, y: 25 }, visible: true, locked: false },
    { id: 'admin', label: 'ADMIN', href: '/dashboard', color: '#dc2626', fontSize: '14px', position: { x: 990, y: 25 }, visible: true, locked: false },
  ];

  // updateAdvancedConfig is now defined above with undo/redo functionality

  // Reset all settings to default values
  const resetToDefaults = () => {
    headerUndoRedo.reset(defaultConfig);
    // Reset navigation items to default positions
    updateHeaderConfig({
      ...headerConfig,
      navItems: defaultNavItems
    });
    setSelectedElement('');
    setDragMode(false);
    setPreviewMode(false);
  };

  // Update navigation item position
  const updateNavItem = (navId: string, updates: Partial<typeof headerConfig.navItems[0]>) => {
    const updatedNavItems = headerConfig.navItems.map(item =>
      item.id === navId ? { ...item, ...updates } : item
    );
    updateHeaderConfig({ ...headerConfig, navItems: updatedNavItems });
  };

  const addLogo = useCallback((files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const newLogo: LogoElement = {
          id: `logo-${Date.now()}`,
          url: e.target?.result as string,
          alt: `Logo ${currentAdvancedConfig.logos.length + 1}`,
          width: 50,
          height: 50,
          x: 20 + (currentAdvancedConfig.logos.length * 60),
          y: 15,
          zIndex: 10 + currentAdvancedConfig.logos.length,
          visible: true,
          opacity: 1,
          rotation: 0
        };
        updateAdvancedConfig({ logos: [...currentAdvancedConfig.logos, newLogo] });
      };
      reader.readAsDataURL(file);
    }
  }, [currentAdvancedConfig.logos]);

  const updateLogo = (logoId: string, updates: Partial<LogoElement>) => {
    const updatedLogos = currentAdvancedConfig.logos.map(logo =>
      logo.id === logoId ? { ...logo, ...updates } : logo
    );
    updateAdvancedConfig({ logos: updatedLogos });
  };

  const deleteLogo = (logoId: string) => {
    const updatedLogos = currentAdvancedConfig.logos.filter(logo => logo.id !== logoId);
    updateAdvancedConfig({ logos: updatedLogos });
    if (selectedElement === logoId) setSelectedElement('');
  };

  const duplicateLogo = (logoId: string) => {
    const logo = currentAdvancedConfig.logos.find(l => l.id === logoId);
    if (logo) {
      const newLogo: LogoElement = {
        ...logo,
        id: `logo-${Date.now()}`,
        x: logo.x + 20,
        y: logo.y + 20,
        zIndex: Math.max(...currentAdvancedConfig.logos.map(l => l.zIndex)) + 1
      };
      updateAdvancedConfig({ logos: [...currentAdvancedConfig.logos, newLogo] });
    }
  };

  const addTextElement = () => {
    const newText: TextElement = {
      id: `text-${Date.now()}`,
      content: 'New Text',
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#374151',
      fontFamily: 'Inter',
      x: 200 + (currentAdvancedConfig.textElements.length * 20),
      y: 25,
      zIndex: 8,
      visible: true,
      opacity: 1,
      rotation: 0
    };
    updateAdvancedConfig({ textElements: [...currentAdvancedConfig.textElements, newText] });
    setSelectedElement(newText.id);
  };

  const updateTextElement = (textId: string, updates: Partial<TextElement>) => {
    const updatedTexts = currentAdvancedConfig.textElements.map(text =>
      text.id === textId ? { ...text, ...updates } : text
    );
    updateAdvancedConfig({ textElements: updatedTexts });
  };

  const deleteTextElement = (textId: string) => {
    const updatedTexts = currentAdvancedConfig.textElements.filter(text => text.id !== textId);
    updateAdvancedConfig({ textElements: updatedTexts });
    if (selectedElement === textId) setSelectedElement('');
  };

  const handleElementDrag = (elementId: string, newX: number, newY: number) => {
    if (!dragMode) return;
    
    const logo = currentAdvancedConfig.logos.find(l => l.id === elementId);
    if (logo) {
      updateLogo(elementId, { x: newX, y: newY });
    } else {
      updateTextElement(elementId, { x: newX, y: newY });
    }
  };

  const bringToFront = (elementId: string) => {
    const maxZ = Math.max(
      ...currentAdvancedConfig.logos.map(l => l.zIndex),
      ...currentAdvancedConfig.textElements.map(t => t.zIndex)
    );
    
    const logo = currentAdvancedConfig.logos.find(l => l.id === elementId);
    if (logo) {
      updateLogo(elementId, { zIndex: maxZ + 1 });
    } else {
      updateTextElement(elementId, { zIndex: maxZ + 1 });
    }
  };

  const selectedLogo = currentAdvancedConfig.logos.find(l => l.id === selectedElement);
  const selectedText = currentAdvancedConfig.textElements.find(t => t.id === selectedElement);
  const selectedNav = headerConfig.navItems.find(n => n.id === selectedElement);

  return (
    <div className="space-y-6">
      {/* Advanced Live Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Advanced Header Preview
            </CardTitle>
            <div className="flex gap-2">
              <UndoRedoControls
                canUndo={headerUndoRedo.canUndo}
                canRedo={headerUndoRedo.canRedo}
                onUndo={headerUndoRedo.undo}
                onRedo={headerUndoRedo.redo}
                onClear={headerUndoRedo.clear}
                sectionName="Header"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
                title="Reset all settings to default values"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Layout
              </Button>
              <Button
                variant={dragMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDragMode(!dragMode)}
              >
                <Move className="w-4 h-4 mr-2" />
                {dragMode ? 'Drag Active' : 'Enable Drag'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? 'Edit Mode' : 'Preview Mode'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className={`relative border rounded-lg overflow-hidden ${dragMode ? 'cursor-move' : ''}`}
            style={{ 
              background: currentAdvancedConfig.backgroundColor,
              backgroundImage: currentAdvancedConfig.backgroundGradient !== currentAdvancedConfig.backgroundColor ? currentAdvancedConfig.backgroundGradient : 'none',
              height: currentAdvancedConfig.height,
              padding: currentAdvancedConfig.padding,
              borderBottom: currentAdvancedConfig.borderBottom ? `1px solid ${currentAdvancedConfig.borderColor}` : 'none',
              boxShadow: currentAdvancedConfig.boxShadow ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              position: currentAdvancedConfig.sticky ? 'sticky' : 'relative',
              top: currentAdvancedConfig.sticky ? '0' : 'auto',
              zIndex: currentAdvancedConfig.sticky ? '50' : 'auto'
            }}
          >
            {/* Grid overlay and alignment guides */}
            {dragMode && (
              <>
                {/* Fine grid overlay */}
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                      linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                    `,
                    backgroundSize: '10px 10px'
                  }}
                />
                {/* Major grid overlay */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #9ca3af 1px, transparent 1px),
                      linear-gradient(to bottom, #9ca3af 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                  }}
                />
                {/* Alignment guides */}
                {showGuides && dragPosition && (
                  <>
                    {/* Horizontal guide */}
                    <div 
                      className="absolute left-0 right-0 border-t-2 border-dashed border-red-500 opacity-75 pointer-events-none z-50"
                      style={{ top: dragPosition.y }}
                    />
                    {/* Vertical guide */}
                    <div 
                      className="absolute top-0 bottom-0 border-l-2 border-dashed border-red-500 opacity-75 pointer-events-none z-50"
                      style={{ left: dragPosition.x }}
                    />
                    {/* Center guides */}
                    <div 
                      className="absolute top-0 bottom-0 border-l border-dashed border-blue-500 opacity-50 pointer-events-none z-40"
                      style={{ left: '50%' }}
                    />
                    <div 
                      className="absolute left-0 right-0 border-t border-dashed border-blue-500 opacity-50 pointer-events-none z-40"
                      style={{ top: '50%' }}
                    />
                  </>
                )}
              </>
            )}

            {/* Logo Elements */}
            {currentAdvancedConfig.logos.filter(logo => logo.visible).map((logo) => (
              <div
                key={logo.id}
                className={`absolute cursor-pointer transition-all ${selectedElement === logo.id ? 'ring-2 ring-blue-500' : ''}`}
                style={{
                  left: logo.x,
                  top: logo.y,
                  zIndex: logo.zIndex,
                  opacity: logo.opacity,
                  transform: `rotate(${logo.rotation}deg)`
                }}
                onClick={() => setSelectedElement(logo.id)}
                onMouseDown={(e) => {
                  if (dragMode) {
                    const startX = e.clientX - logo.x;
                    const startY = e.clientY - logo.y;
                    setShowGuides(true);
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      const newX = e.clientX - startX;
                      const newY = e.clientY - startY;
                      setDragPosition({ x: newX, y: newY });
                      handleElementDrag(logo.id, newX, newY);
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                      setShowGuides(false);
                      setDragPosition(null);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }
                }}
              >
                <img
                  src={logo.url}
                  alt={logo.alt}
                  style={{ width: logo.width, height: logo.height }}
                  className="object-contain"
                />
                {selectedElement === logo.id && !previewMode && (
                  <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Logo
                  </div>
                )}
              </div>
            ))}

            {/* Text Elements */}
            {currentAdvancedConfig.textElements.filter(text => text.visible).map((text) => (
              <div
                key={text.id}
                className={`absolute cursor-pointer transition-all ${selectedElement === text.id ? 'ring-2 ring-blue-500' : ''}`}
                style={{
                  left: text.x,
                  top: text.y,
                  zIndex: text.zIndex,
                  opacity: text.opacity,
                  transform: `rotate(${text.rotation}deg)`,
                  fontSize: text.fontSize,
                  fontWeight: text.fontWeight,
                  color: text.color,
                  fontFamily: text.fontFamily
                }}
                onClick={() => setSelectedElement(text.id)}
                onMouseDown={(e) => {
                  if (dragMode) {
                    const startX = e.clientX - text.x;
                    const startY = e.clientY - text.y;
                    setShowGuides(true);
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      const newX = e.clientX - startX;
                      const newY = e.clientY - startY;
                      setDragPosition({ x: newX, y: newY });
                      handleElementDrag(text.id, newX, newY);
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                      setShowGuides(false);
                      setDragPosition(null);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }
                }}
              >
                {text.content}
                {selectedElement === text.id && !previewMode && (
                  <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Text
                  </div>
                )}
              </div>
            ))}

            {/* Navigation Items */}
            {headerConfig.navItems.filter(item => item.visible).map((item) => (
              <div
                key={item.id}
                className={`absolute cursor-pointer transition-all ${
                  selectedElement === item.id ? 'ring-2 ring-purple-500' : ''
                } ${dragMode ? 'cursor-move' : ''}`}
                style={{
                  left: item.position.x,
                  top: item.position.y,
                  zIndex: 8
                }}
                onClick={() => setSelectedElement(item.id)}
                onMouseDown={(e) => {
                  if (dragMode) {
                    const startX = e.clientX - item.position.x;
                    const startY = e.clientY - item.position.y;
                    setShowGuides(true);
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      const newX = e.clientX - startX;
                      const newY = e.clientY - startY;
                      setDragPosition({ x: newX, y: newY });
                      updateNavItem(item.id, {
                        position: {
                          x: newX,
                          y: newY
                        }
                      });
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                      setShowGuides(false);
                      setDragPosition(null);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }
                }}
              >
                <a
                  href={previewMode ? item.href : '#'}
                  style={{
                    color: item.color,
                    fontSize: item.fontSize
                  }}
                  className="font-medium hover:opacity-80 transition-opacity"
                >
                  {item.label}
                </a>
                {selectedElement === item.id && !previewMode && (
                  <div className="absolute -top-6 left-0 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                    Nav
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Configuration */}
      <Tabs defaultValue="elements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="elements">Elements</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>

        {/* Elements Tab */}
        <TabsContent value="elements" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logo Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Logo Elements
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Add Logo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => addLogo(e.target.files)}
                      className="hidden"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentAdvancedConfig.logos.map((logo) => (
                  <div
                    key={logo.id}
                    className={`border rounded-lg p-3 ${selectedElement === logo.id ? 'border-blue-500 bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={logo.visible}
                          onCheckedChange={(checked) => updateLogo(logo.id, { visible: checked })}
                        />
                        <img src={logo.url} alt={logo.alt} className="w-6 h-6 object-contain" />
                        <span className="text-sm font-medium">{logo.alt}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedElement(logo.id)}
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateLogo(logo.id)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => bringToFront(logo.id)}
                        >
                          <Layers className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLogo(logo.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <Label className="text-xs">Width</Label>
                        <Input
                          type="number"
                          value={logo.width}
                          onChange={(e) => updateLogo(logo.id, { width: Number(e.target.value) })}
                          size="sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Height</Label>
                        <Input
                          type="number"
                          value={logo.height}
                          onChange={(e) => updateLogo(logo.id, { height: Number(e.target.value) })}
                          size="sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">X</Label>
                        <Input
                          type="number"
                          value={logo.x}
                          onChange={(e) => updateLogo(logo.id, { x: Number(e.target.value) })}
                          size="sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Y</Label>
                        <Input
                          type="number"
                          value={logo.y}
                          onChange={(e) => updateLogo(logo.id, { y: Number(e.target.value) })}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Text Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Text Elements
                  </CardTitle>
                  <Button onClick={addTextElement} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Text
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentAdvancedConfig.textElements.map((text) => (
                  <div
                    key={text.id}
                    className={`border rounded-lg p-3 ${selectedElement === text.id ? 'border-blue-500 bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={text.visible}
                          onCheckedChange={(checked) => updateTextElement(text.id, { visible: checked })}
                        />
                        <Input
                          value={text.content}
                          onChange={(e) => updateTextElement(text.id, { content: e.target.value })}
                          className="text-sm"
                          size="sm"
                        />
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedElement(text.id)}
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => bringToFront(text.id)}
                        >
                          <Layers className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTextElement(text.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        value={text.fontSize}
                        onChange={(e) => updateTextElement(text.id, { fontSize: e.target.value })}
                        placeholder="Font size"
                        size="sm"
                      />
                      <Input
                        type="color"
                        value={text.color}
                        onChange={(e) => updateTextElement(text.id, { color: e.target.value })}
                        className="w-full h-8"
                      />
                      <Select
                        value={text.fontFamily}
                        onValueChange={(value) => updateTextElement(text.id, { fontFamily: value })}
                      >
                        <SelectTrigger size="sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          <SelectItem value="Inter" className="text-gray-900 hover:bg-gray-100">Inter</SelectItem>
                          <SelectItem value="Roboto" className="text-gray-900 hover:bg-gray-100">Roboto</SelectItem>
                          <SelectItem value="Cinzel Decorative" className="text-gray-900 hover:bg-gray-100">Cinzel Decorative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Navigation Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer2 className="w-5 h-5" />
                  Navigation Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {headerConfig.navItems.map((nav) => (
                  <div
                    key={nav.id}
                    className={`border rounded-lg p-3 ${selectedElement === nav.id ? 'border-purple-500 bg-purple-50' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={nav.visible}
                          onCheckedChange={(checked) => updateNavItem(nav.id, { visible: checked })}
                        />
                        <span className="text-sm font-medium">{nav.label}</span>
                        <Badge variant="outline" className="text-xs">{nav.href}</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedElement(nav.id)}
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <Label className="text-xs">X</Label>
                        <Input
                          type="number"
                          value={nav.position.x}
                          onChange={(e) => updateNavItem(nav.id, { 
                            position: { ...nav.position, x: Number(e.target.value) }
                          })}
                          size="sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Y</Label>
                        <Input
                          type="number"
                          value={nav.position.y}
                          onChange={(e) => updateNavItem(nav.id, { 
                            position: { ...nav.position, y: Number(e.target.value) }
                          })}
                          size="sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Size</Label>
                        <Input
                          value={nav.fontSize}
                          onChange={(e) => updateNavItem(nav.id, { fontSize: e.target.value })}
                          size="sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Color</Label>
                        <Input
                          type="color"
                          value={nav.color}
                          onChange={(e) => updateNavItem(nav.id, { color: e.target.value })}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-4">
          {(selectedLogo || selectedText || selectedNav) && (
            <Card>
              <CardHeader>
                <CardTitle>Element Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedLogo && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Opacity</Label>
                        <Input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={selectedLogo.opacity}
                          onChange={(e) => updateLogo(selectedLogo.id, { opacity: Number(e.target.value) })}
                        />
                        <span className="text-xs text-gray-500">{selectedLogo.opacity}</span>
                      </div>
                      <div>
                        <Label>Rotation</Label>
                        <Input
                          type="range"
                          min="-180"
                          max="180"
                          value={selectedLogo.rotation}
                          onChange={(e) => updateLogo(selectedLogo.id, { rotation: Number(e.target.value) })}
                        />
                        <span className="text-xs text-gray-500">{selectedLogo.rotation}°</span>
                      </div>
                      <div>
                        <Label>Z-Index</Label>
                        <Input
                          type="number"
                          value={selectedLogo.zIndex}
                          onChange={(e) => updateLogo(selectedLogo.id, { zIndex: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedText && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Opacity</Label>
                        <Input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={selectedText.opacity}
                          onChange={(e) => updateTextElement(selectedText.id, { opacity: Number(e.target.value) })}
                        />
                        <span className="text-xs text-gray-500">{selectedText.opacity}</span>
                      </div>
                      <div>
                        <Label>Rotation</Label>
                        <Input
                          type="range"
                          min="-180"
                          max="180"
                          value={selectedText.rotation}
                          onChange={(e) => updateTextElement(selectedText.id, { rotation: Number(e.target.value) })}
                        />
                        <span className="text-xs text-gray-500">{selectedText.rotation}°</span>
                      </div>
                      <div>
                        <Label>Z-Index</Label>
                        <Input
                          type="number"
                          value={selectedText.zIndex}
                          onChange={(e) => updateTextElement(selectedText.id, { zIndex: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedNav && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>X Position</Label>
                        <Input
                          type="number"
                          value={selectedNav.position.x}
                          onChange={(e) => updateNavItem(selectedNav.id, { 
                            position: { ...selectedNav.position, x: Number(e.target.value) }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Y Position</Label>
                        <Input
                          type="number"
                          value={selectedNav.position.y}
                          onChange={(e) => updateNavItem(selectedNav.id, { 
                            position: { ...selectedNav.position, y: Number(e.target.value) }
                          })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Color</Label>
                        <Input
                          type="color"
                          value={selectedNav.color}
                          onChange={(e) => updateNavItem(selectedNav.id, { color: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Font Size</Label>
                        <Input
                          value={selectedNav.fontSize}
                          onChange={(e) => updateNavItem(selectedNav.id, { fontSize: e.target.value })}
                          placeholder="14px"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={selectedNav.label}
                          onChange={(e) => updateNavItem(selectedNav.id, { label: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>URL</Label>
                        <Input
                          value={selectedNav.href}
                          onChange={(e) => updateNavItem(selectedNav.id, { href: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Advanced Layout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Layout Mode</Label>
                  <Select
                    value={currentAdvancedConfig.layoutMode}
                    onValueChange={(value: any) => updateAdvancedConfig({ layoutMode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="absolute" className="text-gray-900 hover:bg-gray-100">Absolute Positioning</SelectItem>
                      <SelectItem value="flexbox" className="text-gray-900 hover:bg-gray-100">Flexbox Layout</SelectItem>
                      <SelectItem value="grid" className="text-gray-900 hover:bg-gray-100">Grid Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Header Height</Label>
                  <Input
                    value={currentAdvancedConfig.height}
                    onChange={(e) => updateAdvancedConfig({ height: e.target.value })}
                    placeholder="80px"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Justify Content</Label>
                  <Select
                    value={currentAdvancedConfig.justifyContent}
                    onValueChange={(value: any) => updateAdvancedConfig({ justifyContent: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="flex-start" className="text-gray-900 hover:bg-gray-100">Start</SelectItem>
                      <SelectItem value="center" className="text-gray-900 hover:bg-gray-100">Center</SelectItem>
                      <SelectItem value="flex-end" className="text-gray-900 hover:bg-gray-100">End</SelectItem>
                      <SelectItem value="space-between" className="text-gray-900 hover:bg-gray-100">Space Between</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Align Items</Label>
                  <Select
                    value={currentAdvancedConfig.alignItems}
                    onValueChange={(value: any) => updateAdvancedConfig({ alignItems: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="flex-start" className="text-gray-900 hover:bg-gray-100">Start</SelectItem>
                      <SelectItem value="center" className="text-gray-900 hover:bg-gray-100">Center</SelectItem>
                      <SelectItem value="flex-end" className="text-gray-900 hover:bg-gray-100">End</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Effects Tab */}
        <TabsContent value="effects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Visual Effects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Background</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="color"
                      value={currentAdvancedConfig.backgroundColor}
                      onChange={(e) => updateAdvancedConfig({ backgroundColor: e.target.value })}
                    />
                    <Input
                      value={currentAdvancedConfig.backgroundGradient}
                      onChange={(e) => updateAdvancedConfig({ backgroundGradient: e.target.value })}
                      placeholder="CSS gradient"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={currentAdvancedConfig.borderBottom}
                      onCheckedChange={(checked) => updateAdvancedConfig({ borderBottom: checked })}
                    />
                    <Label>Bottom Border</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={currentAdvancedConfig.boxShadow}
                      onCheckedChange={(checked) => updateAdvancedConfig({ boxShadow: checked })}
                    />
                    <Label>Drop Shadow</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={currentAdvancedConfig.sticky}
                      onCheckedChange={(checked) => updateAdvancedConfig({ sticky: checked })}
                    />
                    <Label>Sticky Header</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => console.log('Reset')}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Layout
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/" target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              Preview Site
            </a>
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Advanced Header
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedHeaderPanel;