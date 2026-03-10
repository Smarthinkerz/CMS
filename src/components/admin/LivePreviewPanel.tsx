import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Move, 
  Eye, 
  EyeOff, 
  X, 
  Minimize2, 
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  MousePointer,
  Target
} from 'lucide-react';

// Add custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #60a5fa;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #3b82f6;
  }
  .custom-scrollbar::-webkit-scrollbar-corner {
    background: #f1f5f9;
  }
`;

interface LivePreviewPanelProps {
  activePanel?: 'header' | 'body' | 'footer' | null;
  isVisible?: boolean;
  onClose?: () => void;
  editingElement?: string | null;
  previewData?: {
    header?: any;
    body?: any;
    footer?: any;
  };
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';
type HighlightMode = 'none' | 'hover' | 'editing' | 'all';

const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  activePanel = null,
  isVisible = true,
  onClose,
  editingElement = null,
  previewData = {}
}) => {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [highlightMode, setHighlightMode] = useState<HighlightMode>('editing');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isAutoPositioned, setIsAutoPositioned] = useState(true);
  
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Auto-position opposite to active panel
  useEffect(() => {
    if (!isAutoPositioned || !activePanel) return;

    const updatePosition = () => {
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const panelWidth = 400; // Approximate panel width
      const panelHeight = 600; // Approximate panel height
      
      let x = 0, y = 100;

      // Position opposite to active panel
      switch (activePanel) {
        case 'header':
          x = viewport.width - panelWidth - 20;
          y = 100;
          break;
        case 'body':
          x = 20;
          y = (viewport.height - panelHeight) / 2;
          break;
        case 'footer':
          x = viewport.width - panelWidth - 20;
          y = viewport.height - panelHeight - 20;
          break;
        default:
          x = viewport.width - panelWidth - 20;
          y = 100;
      }

      setPosition({ x, y });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [activePanel, isAutoPositioned]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragRef.current?.contains(e.target as Node)) return;
    
    setIsDragging(true);
    setIsAutoPositioned(false);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    
    // Keep panel within viewport bounds
    const bounds = {
      minX: 0,
      maxX: window.innerWidth - 400,
      minY: 0,
      maxY: window.innerHeight - 600
    };
    
    setPosition({
      x: Math.max(bounds.minX, Math.min(bounds.maxX, newX)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, newY))
    });
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
  }, [isDragging]);

  // Viewport dimensions based on mode
  const getViewportDimensions = () => {
    switch (viewportMode) {
      case 'mobile':
        return { width: 375, height: 667 }; // iPhone dimensions
      case 'tablet':
        return { width: 768, height: 1024 }; // iPad dimensions
      case 'desktop':
      default:
        return { width: 1200, height: 800 }; // Desktop dimensions
    }
  };

  const viewport = getViewportDimensions();
  const scaledWidth = (viewport.width * zoomLevel) / 100;
  const scaledHeight = (viewport.height * zoomLevel) / 100;

  // Preview content with highlighting
  const renderPreviewContent = () => {
    const getHighlightClass = (element: string) => {
      if (highlightMode === 'none') return '';
      
      const isEditing = editingElement === element;
      const isActive = activePanel && element.startsWith(activePanel);
      
      if (highlightMode === 'editing' && isEditing) {
        return 'ring-2 ring-blue-500 ring-opacity-75 bg-blue-50';
      }
      
      if (highlightMode === 'hover' && isActive) {
        return 'ring-1 ring-gray-400 ring-opacity-50';
      }
      
      if (highlightMode === 'all') {
        if (isEditing) return 'ring-2 ring-blue-500 ring-opacity-75 bg-blue-50';
        if (isActive) return 'ring-1 ring-gray-400 ring-opacity-50';
      }
      
      return '';
    };

    return (
      <div className="w-full h-full bg-white overflow-hidden">
        {/* Header Preview */}
        <div className={`border-b ${getHighlightClass('header')} transition-all duration-200`}>
          <div className="h-16 bg-gradient-to-r from-[#2F5B3C] to-[#4A7C59] flex items-center px-6">
            {previewData.header?.logos?.map((logo: any, index: number) => (
              <img
                key={index}
                src={logo.url}
                alt={logo.alt || 'Logo'}
                className={`h-8 ${getHighlightClass(`header-logo-${index}`)}`}
                style={{
                  position: 'absolute',
                  left: `${logo.position?.x || 0}px`,
                  top: `${logo.position?.y || 0}px`
                }}
              />
            ))}
            <div className="text-white font-bold">THE FRANKINCENSE</div>
            <nav className="ml-auto flex space-x-6">
              {['Home', 'Products', 'About', 'Contact'].map((item) => (
                <a key={item} href="#" className="text-white hover:text-green-200">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Body Preview */}
        <div className={`flex-1 ${getHighlightClass('body')} transition-all duration-200`}>
          {previewData.body?.sections?.map((section: any, sectionIndex: number) => (
            <div
              key={sectionIndex}
              className={`${getHighlightClass(`body-section-${sectionIndex}`)} transition-all duration-200`}
              style={{
                backgroundColor: section.backgroundColor || 'transparent',
                padding: `${section.padding || 20}px`
              }}
            >
              {section.blocks?.map((block: any, blockIndex: number) => (
                <div
                  key={blockIndex}
                  className={`${getHighlightClass(`body-block-${sectionIndex}-${blockIndex}`)} transition-all duration-200`}
                  style={{
                    marginBottom: `${block.spacing || 16}px`,
                    textAlign: block.alignment || 'left'
                  }}
                >
                  {block.type === 'text' && (
                    <div
                      style={{
                        fontSize: `${block.fontSize || 16}px`,
                        fontWeight: block.fontWeight || 'normal',
                        color: block.color || '#000000'
                      }}
                      dangerouslySetInnerHTML={{ __html: block.content || 'Sample text content' }}
                    />
                  )}
                  
                  {block.type === 'image' && (
                    <img
                      src={block.url || '/api/placeholder/300/200'}
                      alt={block.alt || 'Content image'}
                      className="max-w-full h-auto"
                      style={{
                        borderRadius: `${block.borderRadius || 0}px`,
                        opacity: block.opacity || 1
                      }}
                    />
                  )}
                  
                  {block.type === 'video' && (
                    <div className="relative bg-gray-200 rounded">
                      <div className="aspect-video flex items-center justify-center">
                        <span className="text-gray-500">Video Preview</span>
                      </div>
                    </div>
                  )}
                  
                  {block.type === 'button' && (
                    <button
                      className="px-6 py-2 rounded transition-colors"
                      style={{
                        backgroundColor: block.backgroundColor || '#2F5B3C',
                        color: block.textColor || '#ffffff',
                        fontSize: `${block.fontSize || 16}px`
                      }}
                    >
                      {block.text || 'Button Text'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
          
          {/* Default content if no body data */}
          {(!previewData.body?.sections || previewData.body.sections.length === 0) && (
            <div className="p-8">
              <h1 className="text-4xl font-bold mb-4">Welcome to The Frankincense</h1>
              <p className="text-lg text-gray-600 mb-6">
                Discover the ancient treasures of Oman with our premium frankincense collection.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-4">
                    <div className="h-32 bg-gray-200 rounded mb-4"></div>
                    <h3 className="font-semibold mb-2">Product {i}</h3>
                    <p className="text-sm text-gray-600">Premium frankincense resin from Salalah.</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Preview */}
        <div className={`border-t bg-gray-900 text-white ${getHighlightClass('footer')} transition-all duration-200`}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {previewData.footer?.columns?.map((column: any, index: number) => (
                <div key={index} className={getHighlightClass(`footer-column-${index}`)}>
                  <h4 className="font-semibold mb-3">{column.title || `Column ${index + 1}`}</h4>
                  <ul className="space-y-2 text-sm">
                    {column.links?.map((link: any, linkIndex: number) => (
                      <li key={linkIndex}>
                        <a href={link.url} className="hover:text-green-400">
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              {/* Default footer if no data */}
              {(!previewData.footer?.columns || previewData.footer.columns.length === 0) && (
                <>
                  <div>
                    <h4 className="font-semibold mb-3">Products</h4>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:text-green-400">Frankincense Resin</a></li>
                      <li><a href="#" className="hover:text-green-400">Essential Oils</a></li>
                      <li><a href="#" className="hover:text-green-400">Incense Burners</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Company</h4>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:text-green-400">About Us</a></li>
                      <li><a href="#" className="hover:text-green-400">Contact</a></li>
                      <li><a href="#" className="hover:text-green-400">Shipping</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Support</h4>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:text-green-400">Help Center</a></li>
                      <li><a href="#" className="hover:text-green-400">Returns</a></li>
                      <li><a href="#" className="hover:text-green-400">FAQ</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Connect</h4>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:text-green-400">Facebook</a></li>
                      <li><a href="#" className="hover:text-green-400">Instagram</a></li>
                      <li><a href="#" className="hover:text-green-400">Twitter</a></li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Inject custom scrollbar styles */}
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      
      <div
        ref={panelRef}
        className={`fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 ${
          isDragging ? 'cursor-grabbing' : ''
        } ${isMinimized ? 'w-80' : 'w-96'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isMinimized ? '320px' : '400px',
          height: isMinimized ? 'auto' : '600px'
        }}
        onMouseDown={handleMouseDown}
      >
      {/* Panel Header */}
      <CardHeader
        ref={dragRef}
        className="cursor-grab active:cursor-grabbing select-none border-b bg-gray-50 rounded-t-lg p-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <CardTitle className="text-sm font-medium">Live Preview</CardTitle>
            {activePanel && (
              <Badge variant="secondary" className="text-xs">
                {activePanel.charAt(0).toUpperCase() + activePanel.slice(1)}
              </Badge>
            )}
            {editingElement && (
              <Badge variant="outline" className="text-xs">
                Editing: {editingElement}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {/* Auto Position Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 w-6 p-0 ${isAutoPositioned ? 'text-blue-600' : 'text-gray-400'}`}
              onClick={() => setIsAutoPositioned(!isAutoPositioned)}
              title="Auto Position"
            >
              <Target className="w-3 h-3" />
            </Button>

            {/* Minimize/Maximize */}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </Button>

            {/* Close */}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                onClick={onClose}
                title="Close Preview"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {!isMinimized && (
          <div className="flex items-center justify-between mt-3">
            {/* Viewport Mode Toggle */}
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 border">
              {[
                { mode: 'desktop', icon: Monitor, label: 'Desktop' },
                { mode: 'tablet', icon: Tablet, label: 'Tablet' },
                { mode: 'mobile', icon: Smartphone, label: 'Mobile' }
              ].map(({ mode, icon: Icon, label }) => (
                <Button
                  key={mode}
                  variant={viewportMode === mode ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setViewportMode(mode as ViewportMode)}
                  title={label}
                >
                  <Icon className="w-3 h-3" />
                </Button>
              ))}
            </div>

            {/* Highlight Mode Toggle */}
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 border">
              {[
                { mode: 'none', icon: EyeOff, label: 'No Highlights' },
                { mode: 'editing', icon: MousePointer, label: 'Editing Only' },
                { mode: 'all', icon: Target, label: 'All Elements' }
              ].map(({ mode, icon: Icon, label }) => (
                <Button
                  key={mode}
                  variant={highlightMode === mode ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setHighlightMode(mode as HighlightMode)}
                  title={label}
                >
                  <Icon className="w-3 h-3" />
                </Button>
              ))}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 border">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
                disabled={zoomLevel <= 25}
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </Button>
              
              <span className="text-xs font-medium px-2 min-w-[40px] text-center">
                {zoomLevel}%
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                disabled={zoomLevel >= 200}
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setZoomLevel(100)}
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      {/* Panel Content */}
      {!isMinimized && (
        <CardContent className="p-0 h-[calc(100%-140px)] overflow-hidden">
          {/* Viewport Info */}
          <div className="px-3 py-2 bg-gray-50 border-b text-xs text-gray-600 flex items-center justify-between">
            <span>
              {viewport.width} × {viewport.height} ({viewportMode})
            </span>
            <span>
              Zoom: {zoomLevel}%
            </span>
          </div>

          {/* Preview Viewport */}
          <div className="h-full bg-gray-100 p-4 relative">
            <div 
              className="h-[calc(100%-20px)] overflow-auto custom-scrollbar"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#60a5fa #e5e7eb'
              }}
            >
              <div
                className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
                style={{
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`,
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  minWidth: `${scaledWidth}px`
                }}
              >
                {renderPreviewContent()}
              </div>
            </div>
            
            {/* Horizontal Scroll Indicator Bar */}
            <div className="absolute bottom-1 left-4 right-4 h-2 bg-slate-200 rounded-full border border-slate-300">
              <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-sm flex items-center justify-center relative">
                <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
                <span className="text-xs text-white font-bold tracking-wider z-10">
                  SCROLL
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      )}

      {/* Drag Handle Visual Indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded-lg pointer-events-none" />
      )}
    </div>
    </>
  );
};

export default LivePreviewPanel;