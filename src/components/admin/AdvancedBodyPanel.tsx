import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBodyContent } from '@/contexts/BodyContentContext';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import UndoRedoControls from '@/components/admin/UndoRedoControls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Copy,
  Move, 
  ArrowUp, 
  ArrowDown,
  Type,
  Image,
  Video,
  Star,
  Grid3X3,
  Layout,
  Palette,
  Save,
  Eye,
  Upload,
  MousePointer2,
  Settings,
  Layers,
  RotateCcw,
  Zap,
  Heart,
  ShoppingCart,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface ModularBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'icon' | 'button' | 'spacer' | 'divider';
  content: any;
  styling: {
    width: string;
    height: string;
    padding: string;
    margin: string;
    backgroundColor: string;
    borderRadius: string;
    border: string;
    boxShadow: string;
    opacity: number;
    position?: string;
    left?: string;
    top?: string;
  };
  animation: {
    type: 'none' | 'fadeIn' | 'slideUp' | 'slideLeft' | 'bounce' | 'pulse';
    duration: string;
    delay: string;
  };
  responsive: {
    hideOnMobile: boolean;
    hideOnTablet: boolean;
    hideOnDesktop: boolean;
  };
}

interface AdvancedSection {
  id: string;
  name: string;
  type: 'hero' | 'content' | 'gallery' | 'testimonial' | 'cta' | 'custom';
  visible: boolean;
  blocks: ModularBlock[];
  layout: {
    type: 'stack' | 'grid' | 'masonry' | 'carousel';
    columns: number;
    gap: string;
    justifyContent: 'start' | 'center' | 'end' | 'space-between';
    alignItems: 'start' | 'center' | 'end' | 'stretch';
  };
  styling: {
    backgroundColor: string;
    backgroundImage: string;
    backgroundSize: 'cover' | 'contain' | 'auto';
    backgroundPosition: string;
    padding: string;
    minHeight: string;
    borderRadius: string;
    border: string;
    boxShadow: string;
  };
  effects: {
    parallax: boolean;
    sticky: boolean;
    overlay: boolean;
    overlayColor: string;
    overlayOpacity: number;
  };
  order: number;
}

const AdvancedBodyPanel: React.FC = () => {
  const { sections, updateSections } = useBodyContent();
  
  // Default body configuration
  const defaultBodySections: AdvancedSection[] = [
    {
      id: 'hero-section',
      name: 'Hero Section',
      type: 'hero',
      visible: true,
      blocks: [
        {
          id: 'hero-title',
          type: 'text',
          content: {
            text: 'Nature\'s Miracle, Treasure of Oman',
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#2F5B3C',
            fontFamily: 'Cinzel Decorative',
            textAlign: 'center',
            lineHeight: '1.2'
          },
          styling: {
            width: '100%',
            height: 'auto',
            padding: '20px',
            margin: '0 0 20px 0',
            backgroundColor: 'transparent',
            borderRadius: '0px',
            border: 'none',
            boxShadow: 'none',
            opacity: 1
          },
          animation: {
            type: 'fadeIn',
            duration: '1s',
            delay: '0s'
          },
          responsive: {
            hideOnMobile: false,
            hideOnTablet: false,
            hideOnDesktop: false
          }
        },
        {
          id: 'hero-subtitle',
          type: 'text',
          content: {
            text: 'Hand-harvested in Salalah, our frankincense offers nature\'s finest remedy.',
            fontSize: '18px',
            fontWeight: 'normal',
            color: '#6b7280',
            fontFamily: 'Inter',
            textAlign: 'center',
            lineHeight: '1.6'
          },
          styling: {
            width: '100%',
            height: 'auto',
            padding: '10px',
            margin: '0 0 30px 0',
            backgroundColor: 'transparent',
            borderRadius: '0px',
            border: 'none',
            boxShadow: 'none',
            opacity: 1
          },
          animation: {
            type: 'slideUp',
            duration: '1s',
            delay: '0.3s'
          },
          responsive: {
            hideOnMobile: false,
            hideOnTablet: false,
            hideOnDesktop: false
          }
        }
      ],
      layout: {
        type: 'stack',
        columns: 1,
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center'
      },
      styling: {
        backgroundColor: '#f8fafc',
        backgroundImage: '',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 20px',
        minHeight: '400px',
        borderRadius: '0px',
        border: 'none',
        boxShadow: 'none'
      },
      effects: {
        parallax: false,
        sticky: false,
        overlay: false,
        overlayColor: '#000000',
        overlayOpacity: 0.5
      },
      order: 1
    }
  ];

  // Undo/Redo state management for body configuration
  const bodyUndoRedo = useUndoRedo(sections.length > 0 ? sections : defaultBodySections, { maxHistorySize: 50 });
  
  // Use undo/redo present state as the current sections
  const localSections = bodyUndoRedo.present;

  // Update function that adds to history
  const updateLocalSections = useCallback((newSections: AdvancedSection[]) => {
    bodyUndoRedo.set(newSections);
    updateSections(newSections); // Also update context
  }, [bodyUndoRedo, updateSections]);

  // Load from context on component mount only
  useEffect(() => {
    if (sections.length > 0) {
      bodyUndoRedo.reset(sections);
    }
  }, []); // Empty dependency array - only run on mount

  const [selectedSection, setSelectedSection] = useState<string>('hero-section');
  const [selectedBlock, setSelectedBlock] = useState<string>('');
  const [dragMode, setDragMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [dragPosition, setDragPosition] = useState<{x: number, y: number} | null>(null);
  const [showGuides, setShowGuides] = useState(false);
  const [resizingBlock, setResizingBlock] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default configuration for reset functionality
  const defaultSections: AdvancedSection[] = [
    {
      id: 'hero-section',
      name: 'Hero Section',
      type: 'hero',
      visible: true,
      blocks: [
        {
          id: 'hero-title',
          type: 'text',
          content: {
            text: 'Nature\'s Miracle, Treasure of Oman',
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#2F5B3C',
            fontFamily: 'Cinzel Decorative',
            textAlign: 'center',
            lineHeight: '1.2'
          },
          styling: {
            width: '100%',
            height: 'auto',
            padding: '20px',
            margin: '0 0 20px 0',
            backgroundColor: 'transparent',
            borderRadius: '0px',
            border: 'none',
            boxShadow: 'none',
            opacity: 1
          },
          animation: {
            type: 'fadeIn',
            duration: '1s',
            delay: '0s'
          },
          responsive: {
            hideOnMobile: false,
            hideOnTablet: false,
            hideOnDesktop: false
          }
        },
        {
          id: 'hero-subtitle',
          type: 'text',
          content: {
            text: 'Hand-harvested in Salalah, our frankincense offers nature\'s finest remedy.',
            fontSize: '18px',
            fontWeight: 'normal',
            color: '#6b7280',
            fontFamily: 'Inter',
            textAlign: 'center',
            lineHeight: '1.6'
          },
          styling: {
            width: '100%',
            height: 'auto',
            padding: '10px',
            margin: '0 0 30px 0',
            backgroundColor: 'transparent',
            borderRadius: '0px',
            border: 'none',
            boxShadow: 'none',
            opacity: 1
          },
          animation: {
            type: 'slideUp',
            duration: '1s',
            delay: '0.3s'
          },
          responsive: {
            hideOnMobile: false,
            hideOnTablet: false,
            hideOnDesktop: false
          }
        }
      ],
      layout: {
        type: 'stack',
        columns: 1,
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center'
      },
      styling: {
        backgroundColor: '#f8fafc',
        backgroundImage: '',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 20px',
        minHeight: '400px',
        borderRadius: '0px',
        border: 'none',
        boxShadow: 'none'
      },
      effects: {
        parallax: false,
        sticky: false,
        overlay: false,
        overlayColor: '#000000',
        overlayOpacity: 0.5
      },
      order: 1
    }
  ];

  const iconOptions = [
    { value: 'star', label: 'Star', icon: Star },
    { value: 'heart', label: 'Heart', icon: Heart },
    { value: 'cart', label: 'Shopping Cart', icon: ShoppingCart },
    { value: 'mail', label: 'Mail', icon: Mail },
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'map', label: 'Map Pin', icon: MapPin },
    { value: 'zap', label: 'Zap', icon: Zap }
  ];

  const animationOptions = [
    { value: 'none', label: 'None' },
    { value: 'fadeIn', label: 'Fade In' },
    { value: 'slideUp', label: 'Slide Up' },
    { value: 'slideLeft', label: 'Slide Left' },
    { value: 'bounce', label: 'Bounce' },
    { value: 'pulse', label: 'Pulse' }
  ];

  const addSection = () => {
    const newSection: AdvancedSection = {
      id: `section-${Date.now()}`,
      name: 'New Section',
      type: 'content',
      visible: true,
      blocks: [],
      layout: {
        type: 'stack',
        columns: 1,
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'start'
      },
      styling: {
        backgroundColor: '#ffffff',
        backgroundImage: '',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px 20px',
        minHeight: '200px',
        borderRadius: '0px',
        border: 'none',
        boxShadow: 'none'
      },
      effects: {
        parallax: false,
        sticky: false,
        overlay: false,
        overlayColor: '#000000',
        overlayOpacity: 0.5
      },
      order: localSections.length + 1
    };
    const newSections = [...localSections, newSection];
    setLocalSections(newSections);
    updateSections(newSections); // Update context immediately
    setSelectedSection(newSection.id);
  };

  const updateSection = (sectionId: string, updates: Partial<AdvancedSection>) => {
    const newSections = localSections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    );
    setLocalSections(newSections);
    updateSections(newSections); // Update context immediately
  };

  const deleteSection = (sectionId: string) => {
    const newSections = localSections.filter(section => section.id !== sectionId);
    setLocalSections(newSections);
    updateSections(newSections); // Update context immediately
    if (selectedSection === sectionId) {
      setSelectedSection(newSections[0]?.id || '');
    }
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = localSections.findIndex(s => s.id === sectionId);
    if (
      (direction === 'up' && sectionIndex > 0) ||
      (direction === 'down' && sectionIndex < localSections.length - 1)
    ) {
      const newSections = [...localSections];
      const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
      [newSections[sectionIndex], newSections[targetIndex]] = 
      [newSections[targetIndex], newSections[sectionIndex]];
      
      newSections.forEach((section, index) => {
        section.order = index + 1;
      });
      
      setLocalSections(newSections);
      updateSections(newSections); // Update context immediately
    }
  };

  const addBlock = (sectionId: string, blockType: ModularBlock['type']) => {
    const section = localSections.find(s => s.id === sectionId);
    if (!section) return;

    const baseBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      styling: {
        width: '100%',
        height: 'auto',
        padding: '10px',
        margin: '0 0 10px 0',
        backgroundColor: 'transparent',
        borderRadius: '0px',
        border: 'none',
        boxShadow: 'none',
        opacity: 1
      },
      animation: {
        type: 'none' as const,
        duration: '1s',
        delay: '0s'
      },
      responsive: {
        hideOnMobile: false,
        hideOnTablet: false,
        hideOnDesktop: false
      }
    };

    let newBlock: ModularBlock;

    switch (blockType) {
      case 'text':
        newBlock = {
          ...baseBlock,
          content: {
            text: 'Enter your text here...',
            fontSize: '16px',
            fontWeight: 'normal',
            color: '#374151',
            fontFamily: 'Inter',
            textAlign: 'left',
            lineHeight: '1.5'
          }
        };
        break;
      case 'image':
        newBlock = {
          ...baseBlock,
          content: {
            url: '',
            alt: 'Image',
            caption: '',
            objectFit: 'cover'
          }
        };
        break;
      case 'video':
        newBlock = {
          ...baseBlock,
          content: {
            url: '',
            poster: '',
            controls: true,
            autoplay: false,
            muted: false,
            loop: false
          }
        };
        break;
      case 'icon':
        newBlock = {
          ...baseBlock,
          content: {
            icon: 'star',
            size: '24px',
            color: '#2F5B3C',
            label: 'Icon'
          }
        };
        break;
      case 'button':
        newBlock = {
          ...baseBlock,
          content: {
            text: 'Button Text',
            url: '#',
            variant: 'primary',
            size: 'medium',
            fullWidth: false
          }
        };
        break;
      case 'spacer':
        newBlock = {
          ...baseBlock,
          content: {
            height: '20px'
          }
        };
        break;
      case 'divider':
        newBlock = {
          ...baseBlock,
          content: {
            thickness: '1px',
            color: '#e5e7eb',
            style: 'solid',
            width: '100%'
          }
        };
        break;
      default:
        return;
    }

    const updatedBlocks = [...section.blocks, newBlock];
    updateSection(sectionId, { blocks: updatedBlocks });
    setSelectedBlock(newBlock.id);
  };

  const updateBlock = (sectionId: string, blockId: string, updates: Partial<ModularBlock>) => {
    const section = localSections.find(s => s.id === sectionId);
    if (section) {
      const updatedBlocks = section.blocks.map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      );
      updateSection(sectionId, { blocks: updatedBlocks });
    }
  };

  const deleteBlock = (sectionId: string, blockId: string) => {
    const section = localSections.find(s => s.id === sectionId);
    if (section) {
      const updatedBlocks = section.blocks.filter(block => block.id !== blockId);
      updateSection(sectionId, { blocks: updatedBlocks });
      if (selectedBlock === blockId) setSelectedBlock('');
    }
  };

  const duplicateBlock = (sectionId: string, blockId: string) => {
    const section = localSections.find(s => s.id === sectionId);
    const block = section?.blocks.find(b => b.id === blockId);
    if (section && block) {
      const newBlock = {
        ...block,
        id: `block-${Date.now()}`
      };
      const updatedBlocks = [...section.blocks, newBlock];
      updateSection(sectionId, { blocks: updatedBlocks });
    }
  };

  const currentSection = localSections.find(s => s.id === selectedSection);
  const currentBlock = currentSection?.blocks.find(b => b.id === selectedBlock);

  // Reset all settings to default values
  const resetToDefaults = () => {
    setLocalSections(defaultSections);
    updateSections(defaultSections); // Update context immediately
    setSelectedSection('hero-section');
    setSelectedBlock('');
    setDragMode(false);
    setPreviewMode(false);
  };

  // Handle block drag functionality
  const handleBlockDrag = (sectionId: string, blockId: string, newX: number, newY: number) => {
    if (!dragMode) return;
    
    const section = localSections.find(s => s.id === sectionId);
    if (section) {
      const updatedBlocks = section.blocks.map(block =>
        block.id === blockId 
          ? { 
              ...block, 
              styling: { 
                ...block.styling, 
                position: 'absolute',
                left: `${Math.max(0, newX)}px`, 
                top: `${Math.max(0, newY)}px` 
              } 
            }
          : block
      );
      updateSection(sectionId, { blocks: updatedBlocks });
    }
  };

  // Handle resize functionality
  const handleResizeStart = (e: React.MouseEvent, blockId: string, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentSectionObj = localSections.find(s => s.id === selectedSection);
    const currentBlockObj = currentSectionObj?.blocks.find(b => b.id === blockId);
    
    if (!currentBlockObj || !currentSectionObj) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    // Parse current dimensions
    const startWidth = parseInt(currentBlockObj.styling.width) || 200;
    const startHeight = parseInt(currentBlockObj.styling.height) || 150;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      // Calculate new dimensions based on resize direction
      switch (direction) {
        case 'se': // Bottom-right corner
          newWidth = Math.max(50, startWidth + deltaX);
          newHeight = Math.max(50, startHeight + deltaY);
          break;
        case 'sw': // Bottom-left corner
          newWidth = Math.max(50, startWidth - deltaX);
          newHeight = Math.max(50, startHeight + deltaY);
          break;
        case 'ne': // Top-right corner
          newWidth = Math.max(50, startWidth + deltaX);
          newHeight = Math.max(50, startHeight - deltaY);
          break;
        case 'nw': // Top-left corner
          newWidth = Math.max(50, startWidth - deltaX);
          newHeight = Math.max(50, startHeight - deltaY);
          break;
        case 'e': // Right edge
          newWidth = Math.max(50, startWidth + deltaX);
          break;
        case 'w': // Left edge
          newWidth = Math.max(50, startWidth - deltaX);
          break;
        case 's': // Bottom edge
          newHeight = Math.max(50, startHeight + deltaY);
          break;
        case 'n': // Top edge
          newHeight = Math.max(50, startHeight - deltaY);
          break;
      }
      
      // Update the block with new dimensions
      updateBlock(currentSectionObj.id, blockId, {
        styling: {
          ...currentBlockObj.styling,
          width: `${newWidth}px`,
          height: `${newHeight}px`
        }
      });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const renderBlock = (block: ModularBlock) => {
    const blockStyle = {
      width: block.styling.width,
      height: block.styling.height,
      padding: block.styling.padding,
      margin: block.styling.margin,
      backgroundColor: block.styling.backgroundColor,
      borderRadius: block.styling.borderRadius,
      border: block.styling.border,
      boxShadow: block.styling.boxShadow,
      opacity: block.styling.opacity
    };

    const animationClass = block.animation.type !== 'none' 
      ? `animate-${block.animation.type}` 
      : '';

    switch (block.type) {
      case 'text':
        return (
          <div
            style={{
              ...blockStyle,
              fontSize: block.content.fontSize,
              fontWeight: block.content.fontWeight,
              color: block.content.color,
              fontFamily: block.content.fontFamily,
              textAlign: block.content.textAlign,
              lineHeight: block.content.lineHeight
            }}
            className={animationClass}
          >
            {block.content.text}
          </div>
        );

      case 'image':
        return block.content.url ? (
          <div 
            style={blockStyle} 
            className={`${animationClass} relative group`}
            onMouseEnter={() => !previewMode && setResizingBlock(block.id)}
            onMouseLeave={() => setResizingBlock(null)}
          >
            <img
              src={block.content.url}
              alt={block.content.alt}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: block.content.objectFit 
              }}
              className="rounded"
            />
            {block.content.caption && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                {block.content.caption}
              </p>
            )}
            
            {/* Resize Handles */}
            {!previewMode && resizingBlock === block.id && (
              <>
                {/* Corner resize handles */}
                <div 
                  className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nw-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 'nw')}
                />
                <div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ne-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 'ne')}
                />
                <div 
                  className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-sw-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 'sw')}
                />
                <div 
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-se-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 'se')}
                />
                
                {/* Edge resize handles */}
                <div 
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-n-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 'n')}
                />
                <div 
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-s-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 's')}
                />
                <div 
                  className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-w-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 'w')}
                />
                <div 
                  className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-e-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 'e')}
                />
              </>
            )}
          </div>
        ) : (
          <div 
            style={blockStyle}
            className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${animationClass}`}
          >
            <span className="text-gray-400">Image Placeholder</span>
          </div>
        );

      case 'video':
        return block.content.url ? (
          <div 
            style={blockStyle} 
            className={`${animationClass} relative group`}
            onMouseEnter={() => !previewMode && setResizingBlock(block.id)}
            onMouseLeave={() => setResizingBlock(null)}
          >
            <video
              src={block.content.url}
              poster={block.content.poster}
              controls={block.content.controls}
              autoPlay={block.content.autoplay}
              muted={block.content.muted}
              loop={block.content.loop}
              className="w-full h-full rounded"
            />
            
            {/* Resize Handles */}
            {!previewMode && resizingBlock === block.id && (
              <>
                {/* Corner resize handles */}
                <div 
                  className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 border border-white rounded-sm cursor-nw-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 'nw')}
                />
                <div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border border-white rounded-sm cursor-ne-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 'ne')}
                />
                <div 
                  className="absolute -bottom-1 -left-1 w-3 h-3 bg-red-500 border border-white rounded-sm cursor-sw-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 'sw')}
                />
                <div 
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 border border-white rounded-sm cursor-se-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 'se')}
                />
                
                {/* Edge resize handles */}
                <div 
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 border border-white rounded-sm cursor-n-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 'n')}
                />
                <div 
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 border border-white rounded-sm cursor-s-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 's')}
                />
                <div 
                  className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 border border-white rounded-sm cursor-w-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 'w')}
                />
                <div 
                  className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 border border-white rounded-sm cursor-e-resize opacity-80 hover:opacity-100"
                  onMouseDown={(e) => handleResizeStart(e, block.id, 'e')}
                />
              </>
            )}
          </div>
        ) : (
          <div 
            style={blockStyle}
            className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${animationClass}`}
          >
            <span className="text-gray-400">Video Placeholder</span>
          </div>
        );

      case 'icon':
        const IconComponent = iconOptions.find(opt => opt.value === block.content.icon)?.icon || Star;
        return (
          <div 
            style={blockStyle} 
            className={`flex items-center justify-center ${animationClass}`}
          >
            <IconComponent 
              size={parseInt(block.content.size)} 
              style={{ color: block.content.color }} 
            />
            {block.content.label && (
              <span className="ml-2">{block.content.label}</span>
            )}
          </div>
        );

      case 'button':
        return (
          <div style={blockStyle} className={animationClass}>
            <button
              className={`
                px-6 py-2 rounded-md font-medium transition-colors
                ${block.content.variant === 'primary' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }
                ${block.content.size === 'small' ? 'text-sm px-3 py-1' : ''}
                ${block.content.size === 'large' ? 'text-lg px-8 py-3' : ''}
                ${block.content.fullWidth ? 'w-full' : ''}
              `}
            >
              {block.content.text}
            </button>
          </div>
        );

      case 'spacer':
        return (
          <div 
            style={{ ...blockStyle, height: block.content.height }} 
            className={animationClass}
          />
        );

      case 'divider':
        return (
          <div style={blockStyle} className={animationClass}>
            <hr
              style={{
                height: block.content.thickness,
                backgroundColor: block.content.color,
                border: 'none',
                borderStyle: block.content.style,
                width: block.content.width
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Advanced Body Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Advanced Body Preview
            </CardTitle>
            <div className="flex gap-2">
              <UndoRedoControls
                canUndo={bodyUndoRedo.canUndo}
                canRedo={bodyUndoRedo.canRedo}
                onUndo={bodyUndoRedo.undo}
                onRedo={bodyUndoRedo.redo}
                onClear={bodyUndoRedo.clear}
                sectionName="Body"
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
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Layout
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto relative">
            {localSections
              .filter(section => section.visible)
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <div
                  key={section.id}
                  className={`relative ${selectedSection === section.id && !previewMode ? 'ring-2 ring-blue-500' : ''}`}
                  style={{
                    background: section.styling.backgroundColor,
                    backgroundImage: section.styling.backgroundImage ? `url(${section.styling.backgroundImage})` : 'none',
                    backgroundSize: section.styling.backgroundSize,
                    backgroundPosition: section.styling.backgroundPosition,
                    padding: section.styling.padding,
                    minHeight: section.styling.minHeight,
                    borderRadius: section.styling.borderRadius,
                    border: section.styling.border,
                    boxShadow: section.styling.boxShadow
                  }}
                  onClick={() => setSelectedSection(section.id)}
                >
                  {/* Section Overlay */}
                  {section.effects.overlay && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: section.effects.overlayColor,
                        opacity: section.effects.overlayOpacity
                      }}
                    />
                  )}

                  {/* Grid overlay and alignment guides */}
                  {dragMode && (
                    <>
                      {/* Fine grid overlay */}
                      <div 
                        className="absolute inset-0 opacity-10 pointer-events-none z-5"
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
                        className="absolute inset-0 opacity-20 pointer-events-none z-5"
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

                  {/* Section Header */}
                  {!previewMode && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="secondary" className="text-xs">
                        {section.name}
                      </Badge>
                    </div>
                  )}

                  {/* Section Content */}
                  <div 
                    className={`relative z-10 ${
                      section.layout.type === 'grid'
                        ? `grid gap-${section.layout.gap.replace('px', '')} grid-cols-${section.layout.columns}` 
                        : section.layout.type === 'stack'
                        ? `flex flex-col gap-${section.layout.gap.replace('px', '')}`
                        : 'space-y-4'
                    }`}
                    style={{
                      justifyContent: section.layout.justifyContent,
                      alignItems: section.layout.alignItems,
                      gap: section.layout.gap
                    }}
                  >
                    {section.blocks.map((block) => (
                      <div
                        key={block.id}
                        className={`${
                          selectedBlock === block.id && !previewMode ? 'ring-2 ring-green-500' : ''
                        } ${dragMode ? 'cursor-move' : 'cursor-pointer'} transition-all`}
                        style={{
                          position: (dragMode && block.styling.position) ? 'absolute' : 'relative',
                          left: (dragMode && block.styling.left) ? block.styling.left : 'auto',
                          top: (dragMode && block.styling.top) ? block.styling.top : 'auto',
                          zIndex: dragMode ? 1000 : 'auto'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBlock(block.id);
                        }}
                        onMouseDown={(e) => {
                          if (dragMode && !previewMode) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            const element = e.currentTarget;
                            const container = element.closest('.border.rounded-lg.overflow-hidden');
                            if (!container) return;
                            
                            const containerRect = container.getBoundingClientRect();
                            const elementRect = element.getBoundingClientRect();
                            
                            const offsetX = e.clientX - elementRect.left;
                            const offsetY = e.clientY - elementRect.top;
                            
                            setShowGuides(true);
                            
                            const handleMouseMove = (e: MouseEvent) => {
                              const newX = e.clientX - containerRect.left - offsetX;
                              const newY = e.clientY - containerRect.top - offsetY;
                              
                              setDragPosition({ x: newX, y: newY });
                              handleBlockDrag(section.id, block.id, newX, newY);
                            };
                            
                            const handleMouseUp = () => {
                              setShowGuides(false);
                              setDragPosition(null);
                              document.removeEventListener('mousemove', handleMouseMove);
                              document.removeEventListener('mouseup', handleMouseUp);
                            };
                            
                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                          }
                        }}
                      >
                        {renderBlock(block)}
                        {selectedBlock === block.id && !previewMode && dragMode && (
                          <div className="absolute -top-6 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded z-10">
                            Drag to move
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Empty State */}
                    {section.blocks.length === 0 && (
                      <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded">
                        <Layout className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Empty Section</p>
                        <p className="text-xs">Add modular blocks</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Configuration */}
      <Tabs defaultValue="sections" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Advanced Sections
                </CardTitle>
                <Button onClick={addSection} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {localSections.map((section, index) => (
                <div
                  key={section.id}
                  className={`border rounded-lg p-4 ${selectedSection === section.id ? 'border-blue-500 bg-blue-50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={section.visible}
                        onCheckedChange={(checked) =>
                          updateSection(section.id, { visible: checked })
                        }
                      />
                      <Input
                        value={section.name}
                        onChange={(e) =>
                          updateSection(section.id, { name: e.target.value })
                        }
                        className="text-sm font-medium w-40"
                        size="sm"
                      />
                      <Badge variant="outline">{section.type}</Badge>
                      <Badge variant="secondary">{section.blocks.length} blocks</Badge>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSection(section.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSection(section.id, 'down')}
                        disabled={index === localSections.length - 1}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSection(section.id)}
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSection(section.id)}
                        disabled={localSections.length <= 1}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blocks Tab */}
        <TabsContent value="blocks" className="space-y-4">
          {currentSection && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Grid3X3 className="w-5 h-5" />
                    Modular Blocks: {currentSection.name}
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => addBlock(currentSection.id, 'text')}
                      size="sm"
                      variant="outline"
                    >
                      <Type className="w-4 h-4 mr-1" />
                      Text
                    </Button>
                    <Button
                      onClick={() => addBlock(currentSection.id, 'image')}
                      size="sm"
                      variant="outline"
                    >
                      <Image className="w-4 h-4 mr-1" />
                      Image
                    </Button>
                    <Button
                      onClick={() => addBlock(currentSection.id, 'video')}
                      size="sm"
                      variant="outline"
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Video
                    </Button>
                    <Button
                      onClick={() => addBlock(currentSection.id, 'icon')}
                      size="sm"
                      variant="outline"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      Icon
                    </Button>
                    <Button
                      onClick={() => addBlock(currentSection.id, 'button')}
                      size="sm"
                      variant="outline"
                    >
                      <MousePointer2 className="w-4 h-4 mr-1" />
                      Button
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentSection.blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className={`border rounded-lg p-4 ${selectedBlock === block.id ? 'border-green-500 bg-green-50' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{block.type}</Badge>
                        <span className="text-sm">
                          {block.type === 'text' ? block.content.text?.substring(0, 30) + '...' : `${block.type} block`}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedBlock(block.id)}
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateBlock(currentSection.id, block.id)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteBlock(currentSection.id, block.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Quick Block Content Edit */}
                    {block.type === 'text' && (
                      <Textarea
                        value={block.content.text}
                        onChange={(e) =>
                          updateBlock(currentSection.id, block.id, {
                            content: { ...block.content, text: e.target.value }
                          })
                        }
                        rows={2}
                        className="text-sm"
                      />
                    )}

                    {block.type === 'image' && (
                      <div className="space-y-2">
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={block.content.url}
                              onChange={(e) =>
                                updateBlock(currentSection.id, block.id, {
                                  content: { ...block.content, url: e.target.value }
                                })
                              }
                              placeholder="Image URL or paste link"
                              size="sm"
                              className="flex-1"
                            />
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  // Check file size (limit to 5MB for images)
                                  const maxSize = 5 * 1024 * 1024; // 5MB
                                  if (file.size > maxSize) {
                                    alert(`Image file is too large (${Math.round(file.size / 1024 / 1024)}MB). Please use a file smaller than 5MB or use an image URL instead.`);
                                    return;
                                  }
                                  
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    updateBlock(currentSection.id, block.id, {
                                      content: { 
                                        ...block.content, 
                                        url: e.target?.result as string,
                                        fileName: file.name,
                                        fileSize: Math.round(file.size / 1024 / 1024 * 100) / 100 // Size in MB
                                      }
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                  
                                  // Show success message
                                  console.log(`Image uploaded: ${file.name} (${Math.round(file.size / 1024 / 1024 * 100) / 100}MB)`);
                                }
                              };
                              input.click();
                            }}
                          >
                            <Upload className="w-3 h-3" />
                          </Button>
                          </div>
                          {block.content.fileName && (
                            <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                              ✓ Uploaded: {block.content.fileName} ({block.content.fileSize}MB)
                            </div>
                          )}
                        </div>
                        <Input
                          value={block.content.alt}
                          onChange={(e) =>
                            updateBlock(currentSection.id, block.id, {
                              content: { ...block.content, alt: e.target.value }
                            })
                          }
                          placeholder="Alt text (accessibility)"
                          size="sm"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs text-gray-500">Width</label>
                            <input
                              key={`width-${block.id}`}
                              type="text"
                              value={block.styling.width || ''}
                              onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateBlock(currentSection.id, block.id, {
                                  styling: { ...block.styling, width: e.target.value }
                                });
                              }}
                              placeholder="100%"
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Height</label>
                            <input
                              key={`height-${block.id}`}
                              type="text"
                              value={block.styling.height || ''}
                              onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateBlock(currentSection.id, block.id, {
                                  styling: { ...block.styling, height: e.target.value }
                                });
                              }}
                              placeholder="auto"
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Fit</label>
                            <select
                              key={`fit-${block.id}`}
                              value={block.content.objectFit || 'cover'}
                              onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateBlock(currentSection.id, block.id, {
                                  content: { ...block.content, objectFit: e.target.value }
                                });
                              }}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="cover">Cover</option>
                              <option value="contain">Contain</option>
                              <option value="fill">Fill</option>
                              <option value="none">None</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {block.type === 'video' && (
                      <div className="space-y-2">
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={block.content.url}
                              onChange={(e) =>
                                updateBlock(currentSection.id, block.id, {
                                  content: { ...block.content, url: e.target.value }
                                })
                              }
                              placeholder="Video URL or paste link"
                              size="sm"
                              className="flex-1"
                            />
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'video/*';
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  // Check file size (limit to 10MB for safety)
                                  const maxSize = 10 * 1024 * 1024; // 10MB
                                  if (file.size > maxSize) {
                                    alert(`Video file is too large (${Math.round(file.size / 1024 / 1024)}MB). Please use a file smaller than 10MB or use a video URL instead.`);
                                    return;
                                  }
                                  
                                  // Create a blob URL instead of base64 for better performance
                                  const videoUrl = URL.createObjectURL(file);
                                  updateBlock(currentSection.id, block.id, {
                                    content: { 
                                      ...block.content, 
                                      url: videoUrl,
                                      fileName: file.name,
                                      fileSize: Math.round(file.size / 1024 / 1024 * 100) / 100 // Size in MB
                                    }
                                  });
                                  
                                  // Show success message
                                  console.log(`Video uploaded: ${file.name} (${Math.round(file.size / 1024 / 1024 * 100) / 100}MB)`);
                                }
                              };
                              input.click();
                            }}
                          >
                            <Upload className="w-3 h-3" />
                          </Button>
                          </div>
                          {block.content.fileName && (
                            <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                              ✓ Uploaded: {block.content.fileName} ({block.content.fileSize}MB)
                            </div>
                          )}
                          <div className="text-xs text-gray-500">
                            💡 For large videos (&gt;10MB), use YouTube, Vimeo, or direct URLs for best performance
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={block.content.poster || ''}
                            onChange={(e) =>
                              updateBlock(currentSection.id, block.id, {
                                content: { ...block.content, poster: e.target.value }
                              })
                            }
                            placeholder="Poster image URL"
                            size="sm"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`controls-${block.id}`}
                              checked={block.content.controls}
                              onChange={(e) =>
                                updateBlock(currentSection.id, block.id, {
                                  content: { ...block.content, controls: e.target.checked }
                                })
                              }
                              className="w-4 h-4"
                            />
                            <label htmlFor={`controls-${block.id}`} className="text-sm">
                              Show controls
                            </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500">Video Width</label>
                            <input
                              key={`video-width-${block.id}`}
                              type="text"
                              value={block.styling.width || ''}
                              onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateBlock(currentSection.id, block.id, {
                                  styling: { ...block.styling, width: e.target.value }
                                });
                              }}
                              placeholder="100%"
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Video Height</label>
                            <input
                              key={`video-height-${block.id}`}
                              type="text"
                              value={block.styling.height || ''}
                              onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateBlock(currentSection.id, block.id, {
                                  styling: { ...block.styling, height: e.target.value }
                                });
                              }}
                              placeholder="auto"
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {block.type === 'button' && (
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={block.content.text}
                          onChange={(e) =>
                            updateBlock(currentSection.id, block.id, {
                              content: { ...block.content, text: e.target.value }
                            })
                          }
                          placeholder="Button text"
                          size="sm"
                        />
                        <Input
                          value={block.content.url}
                          onChange={(e) =>
                            updateBlock(currentSection.id, block.id, {
                              content: { ...block.content, url: e.target.value }
                            })
                          }
                          placeholder="Button URL"
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {currentSection.blocks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Grid3X3 className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">No blocks yet</p>
                    <p className="text-xs">Add modular blocks above</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-4">
          {currentBlock && currentSection && (
            <Card>
              <CardHeader>
                <CardTitle>Block Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Width</Label>
                    <Input
                      value={currentBlock.styling.width}
                      onChange={(e) =>
                        updateBlock(currentSection.id, currentBlock.id, {
                          styling: { ...currentBlock.styling, width: e.target.value }
                        })
                      }
                      placeholder="100%"
                    />
                  </div>
                  <div>
                    <Label>Height</Label>
                    <Input
                      value={currentBlock.styling.height}
                      onChange={(e) =>
                        updateBlock(currentSection.id, currentBlock.id, {
                          styling: { ...currentBlock.styling, height: e.target.value }
                        })
                      }
                      placeholder="auto"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Padding</Label>
                    <Input
                      value={currentBlock.styling.padding}
                      onChange={(e) =>
                        updateBlock(currentSection.id, currentBlock.id, {
                          styling: { ...currentBlock.styling, padding: e.target.value }
                        })
                      }
                      placeholder="10px"
                    />
                  </div>
                  <div>
                    <Label>Margin</Label>
                    <Input
                      value={currentBlock.styling.margin}
                      onChange={(e) =>
                        updateBlock(currentSection.id, currentBlock.id, {
                          styling: { ...currentBlock.styling, margin: e.target.value }
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={currentBlock.styling.backgroundColor}
                      onChange={(e) =>
                        updateBlock(currentSection.id, currentBlock.id, {
                          styling: { ...currentBlock.styling, backgroundColor: e.target.value }
                        })
                      }
                      className="w-16"
                    />
                    <Input
                      value={currentBlock.styling.backgroundColor}
                      onChange={(e) =>
                        updateBlock(currentSection.id, currentBlock.id, {
                          styling: { ...currentBlock.styling, backgroundColor: e.target.value }
                        })
                      }
                      placeholder="transparent"
                    />
                  </div>
                </div>

                <div>
                  <Label>Animation</Label>
                  <Select
                    value={currentBlock.animation.type}
                    onValueChange={(value: any) =>
                      updateBlock(currentSection.id, currentBlock.id, {
                        animation: { ...currentBlock.animation, type: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      {animationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-gray-900 hover:bg-gray-100">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Responsive Visibility</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={!currentBlock.responsive.hideOnMobile}
                        onCheckedChange={(checked) =>
                          updateBlock(currentSection.id, currentBlock.id, {
                            responsive: { ...currentBlock.responsive, hideOnMobile: !checked }
                          })
                        }
                      />
                      <Label className="text-sm">Mobile</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={!currentBlock.responsive.hideOnTablet}
                        onCheckedChange={(checked) =>
                          updateBlock(currentSection.id, currentBlock.id, {
                            responsive: { ...currentBlock.responsive, hideOnTablet: !checked }
                          })
                        }
                      />
                      <Label className="text-sm">Tablet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={!currentBlock.responsive.hideOnDesktop}
                        onCheckedChange={(checked) =>
                          updateBlock(currentSection.id, currentBlock.id, {
                            responsive: { ...currentBlock.responsive, hideOnDesktop: !checked }
                          })
                        }
                      />
                      <Label className="text-sm">Desktop</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Effects Tab */}
        <TabsContent value="effects" className="space-y-4">
          {currentSection && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Section Effects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Background</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="color"
                        value={currentSection.styling.backgroundColor}
                        onChange={(e) =>
                          updateSection(currentSection.id, {
                            styling: { ...currentSection.styling, backgroundColor: e.target.value }
                          })
                        }
                        className="w-16"
                      />
                      <Input
                        value={currentSection.styling.backgroundImage}
                        onChange={(e) =>
                          updateSection(currentSection.id, {
                            styling: { ...currentSection.styling, backgroundImage: e.target.value }
                          })
                        }
                        placeholder="Background image URL"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={currentSection.effects.parallax}
                        onCheckedChange={(checked) =>
                          updateSection(currentSection.id, {
                            effects: { ...currentSection.effects, parallax: checked }
                          })
                        }
                      />
                      <Label>Parallax</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={currentSection.effects.sticky}
                        onCheckedChange={(checked) =>
                          updateSection(currentSection.id, {
                            effects: { ...currentSection.effects, sticky: checked }
                          })
                        }
                      />
                      <Label>Sticky</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={currentSection.effects.overlay}
                        onCheckedChange={(checked) =>
                          updateSection(currentSection.id, {
                            effects: { ...currentSection.effects, overlay: checked }
                          })
                        }
                      />
                      <Label>Overlay</Label>
                    </div>
                  </div>

                  {currentSection.effects.overlay && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Overlay Color</Label>
                        <Input
                          type="color"
                          value={currentSection.effects.overlayColor}
                          onChange={(e) =>
                            updateSection(currentSection.id, {
                              effects: { ...currentSection.effects, overlayColor: e.target.value }
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Overlay Opacity</Label>
                        <Input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={currentSection.effects.overlayOpacity}
                          onChange={(e) =>
                            updateSection(currentSection.id, {
                              effects: { ...currentSection.effects, overlayOpacity: Number(e.target.value) }
                            })
                          }
                        />
                        <span className="text-xs text-gray-500">{currentSection.effects.overlayOpacity}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={resetToDefaults}>
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
            Save Advanced Body
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedBodyPanel;