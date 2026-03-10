import React, { useState, useRef, useCallback } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import UndoRedoControls from '@/components/admin/UndoRedoControls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Upload,
  Save,
  Eye,
  RotateCcw,
  Settings,
  Layers,
  Palette,
  Type,
  Image as ImageIcon,
  Link,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Globe,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Grid3X3,
  Layout,
  Zap
} from 'lucide-react';

interface FooterLogo {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  position: 'left' | 'center' | 'right';
  opacity: number;
}

interface FooterColumn {
  id: string;
  title: string;
  content: string;
  visible: boolean;
  width: string;
  titleColor: string;
  titleSize: string;
  titleWeight: string;
  contentColor: string;
  contentSize: string;
  alignment: 'left' | 'center' | 'right';
  links: Array<{
    id: string;
    label: string;
    url: string;
    visible: boolean;
    color: string;
    hoverColor: string;
  }>;
}

interface SocialLink {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'custom';
  label: string;
  url: string;
  visible: boolean;
  icon: any;
  color: string;
  hoverColor: string;
  size: string;
  shape: 'circle' | 'square' | 'rounded';
}

interface ContactInfo {
  id: string;
  type: 'phone' | 'email' | 'address' | 'website' | 'custom';
  label: string;
  value: string;
  visible: boolean;
  icon: any;
  color: string;
  fontSize: string;
  showIcon: boolean;
}

interface AdvancedFooterConfig {
  layout: {
    type: 'single' | 'two-column' | 'three-column' | 'four-column' | 'custom-grid';
    gridTemplate: string;
    gap: string;
    padding: string;
    maxWidth: string;
    alignment: 'left' | 'center' | 'right';
  };
  styling: {
    backgroundColor: string;
    backgroundGradient: string;
    backgroundImage: string;
    backgroundBlendMode: string;
    textColor: string;
    borderTop: boolean;
    borderColor: string;
    borderWidth: string;
    boxShadow: string;
    borderRadius: string;
  };
  branding: {
    logos: FooterLogo[];
    brandText: string;
    brandColor: string;
    brandFont: string;
    brandSize: string;
    brandWeight: string;
    tagline: string;
    taglineColor: string;
    taglineSize: string;
  };
  content: {
    columns: FooterColumn[];
    customHtml: string;
    showCustomHtml: boolean;
  };
  contact: {
    info: ContactInfo[];
    title: string;
    titleColor: string;
    groupedDisplay: boolean;
  };
  social: {
    links: SocialLink[];
    title: string;
    titleColor: string;
    alignment: 'left' | 'center' | 'right';
    style: 'icons' | 'buttons' | 'text';
  };
  copyright: {
    text: string;
    year: string;
    color: string;
    fontSize: string;
    alignment: 'left' | 'center' | 'right';
    separator: boolean;
    separatorColor: string;
    customLinks: Array<{
      id: string;
      label: string;
      url: string;
      visible: boolean;
    }>;
  };
  effects: {
    stickyFooter: boolean;
    parallaxBackground: boolean;
    fadeInAnimation: boolean;
    glowEffects: boolean;
    hoverAnimations: boolean;
  };
}

const AdvancedFooterPanel: React.FC = () => {
  // Default footer configuration
  const defaultFooterConfig: AdvancedFooterConfig = {
    layout: {
      type: 'three-column',
      gridTemplate: '1fr 1fr 1fr',
      gap: '40px',
      padding: '60px 20px 20px',
      maxWidth: '1200px',
      alignment: 'left'
    },
    styling: {
      backgroundColor: '#1f2937',
      backgroundGradient: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
      backgroundImage: '',
      backgroundBlendMode: 'normal',
      textColor: '#e5e7eb',
      borderTop: true,
      borderColor: '#374151',
      borderWidth: '1px',
      boxShadow: '0 -4px 8px rgba(0,0,0,0.1)',
      borderRadius: '0px'
    },
    branding: {
      logos: [
        {
          id: 'main-logo',
          url: '/Logo.jpg',
          alt: 'The Frankincense Logo',
          width: 60,
          height: 60,
          position: 'left',
          opacity: 1
        }
      ],
      brandText: 'THE FRANKINCENSE',
      brandColor: '#2F5B3C',
      brandFont: 'Cinzel Decorative',
      brandSize: '24px',
      brandWeight: 'bold',
      tagline: 'Nature\'s Miracle, Treasure of Oman',
      taglineColor: '#9ca3af',
      taglineSize: '14px'
    },
    content: {
      columns: [
        {
          id: 'about-col',
          title: 'About Frankincense',
          content: 'Discover the ancient treasure of Oman. Our premium frankincense is hand-harvested from the sacred Boswellia sacra trees.',
          visible: true,
          width: '1fr',
          titleColor: '#2F5B3C',
          titleSize: '18px',
          titleWeight: 'semibold',
          contentColor: '#9ca3af',
          contentSize: '14px',
          alignment: 'left',
          links: [
            { id: 'history', label: 'Our Story', url: '/history', visible: true, color: '#d1d5db', hoverColor: '#2F5B3C' },
            { id: 'benefits', label: 'Benefits', url: '/benefits', visible: true, color: '#d1d5db', hoverColor: '#2F5B3C' },
            { id: 'ritual', label: 'Rituals', url: '/ritual', visible: true, color: '#d1d5db', hoverColor: '#2F5B3C' }
          ]
        },
        {
          id: 'products-col',
          title: 'Products',
          content: 'Explore our collection of premium frankincense products.',
          visible: true,
          width: '1fr',
          titleColor: '#2F5B3C',
          titleSize: '18px',
          titleWeight: 'semibold',
          contentColor: '#9ca3af',
          contentSize: '14px',
          alignment: 'left',
          links: [
            { id: 'resin', label: 'Premium Resin', url: '/products', visible: true, color: '#d1d5db', hoverColor: '#2F5B3C' },
            { id: 'oils', label: 'Essential Oils', url: '/products', visible: true, color: '#d1d5db', hoverColor: '#2F5B3C' },
            { id: 'gifts', label: 'Gift Sets', url: '/products', visible: true, color: '#d1d5db', hoverColor: '#2F5B3C' }
          ]
        }
      ],
      customHtml: '',
      showCustomHtml: false
    },
    contact: {
      info: [
        {
          id: 'phone',
          type: 'phone',
          label: 'Phone',
          value: '+968 9999 9999',
          visible: true,
          icon: Phone,
          color: '#d1d5db',
          fontSize: '14px',
          showIcon: true
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          value: 'info@thefrankincense.com',
          visible: true,
          icon: Mail,
          color: '#d1d5db',
          fontSize: '14px',
          showIcon: true
        },
        {
          id: 'address',
          type: 'address',
          label: 'Address',
          value: 'Salalah, Dhofar, Sultanate of Oman',
          visible: true,
          icon: MapPin,
          color: '#d1d5db',
          fontSize: '14px',
          showIcon: true
        }
      ],
      title: 'Contact Us',
      titleColor: '#2F5B3C',
      groupedDisplay: true
    },
    social: {
      links: [
        {
          id: 'facebook',
          platform: 'facebook',
          label: 'Facebook',
          url: 'https://facebook.com/thefrankincense',
          visible: true,
          icon: Facebook,
          color: '#4267B2',
          hoverColor: '#365899',
          size: '24px',
          shape: 'circle'
        },
        {
          id: 'instagram',
          platform: 'instagram',
          label: 'Instagram',
          url: 'https://instagram.com/thefrankincense',
          visible: true,
          icon: Instagram,
          color: '#E4405F',
          hoverColor: '#C13584',
          size: '24px',
          shape: 'circle'
        }
      ],
      title: 'Follow Us',
      titleColor: '#2F5B3C',
      alignment: 'left',
      style: 'icons'
    },
    copyright: {
      text: '© {year} THE FRANKINCENSE. All rights reserved.',
      year: '2025',
      color: '#9ca3af',
      fontSize: '12px',
      alignment: 'center',
      separator: true,
      separatorColor: '#374151',
      customLinks: [
        { id: 'privacy', label: 'Privacy Policy', url: '/privacy', visible: true },
        { id: 'terms', label: 'Terms of Service', url: '/terms', visible: true }
      ]
    },
    effects: {
      stickyFooter: false,
      parallaxBackground: false,
      fadeInAnimation: true,
      glowEffects: false,
      hoverAnimations: true
    }
  };

  // Undo/Redo state management for footer configuration
  const footerUndoRedo = useUndoRedo(defaultFooterConfig, { maxHistorySize: 50 });
  
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [previewMode, setPreviewMode] = useState(false);
  const [dragPosition, setDragPosition] = useState<{x: number, y: number} | null>(null);
  
  // Use global edit mode context
  const { isEditMode, setEditMode, setEditModeType } = useEditMode();
  
  // Use undo/redo present state as the current config
  const footerConfig = footerUndoRedo.present;

  // Update function that adds to history
  const updateFooterConfig = useCallback((updates: Partial<AdvancedFooterConfig>) => {
    const newConfig = { ...footerConfig, ...updates };
    footerUndoRedo.set(newConfig);
  }, [footerConfig, footerUndoRedo]);
  const [showGuides, setShowGuides] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const socialPlatforms = [
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'custom', label: 'Custom Link', icon: Link }
  ];

  const contactTypes = [
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'address', label: 'Address', icon: MapPin },
    { value: 'website', label: 'Website', icon: Globe },
    { value: 'custom', label: 'Custom', icon: Settings }
  ];

  // updateFooterConfig is now defined above with undo/redo functionality

  const addLogo = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const newLogo: FooterLogo = {
          id: `logo-${Date.now()}`,
          url: e.target?.result as string,
          alt: `Logo ${footerConfig.branding.logos.length + 1}`,
          width: 60,
          height: 60,
          position: 'left',
          opacity: 1
        };
        updateFooterConfig({
          branding: {
            ...footerConfig.branding,
            logos: [...footerConfig.branding.logos, newLogo]
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateLogo = (logoId: string, updates: Partial<FooterLogo>) => {
    const updatedLogos = footerConfig.branding.logos.map(logo =>
      logo.id === logoId ? { ...logo, ...updates } : logo
    );
    updateFooterConfig({
      branding: {
        ...footerConfig.branding,
        logos: updatedLogos
      }
    });
  };

  const deleteLogo = (logoId: string) => {
    const updatedLogos = footerConfig.branding.logos.filter(logo => logo.id !== logoId);
    updateFooterConfig({
      branding: {
        ...footerConfig.branding,
        logos: updatedLogos
      }
    });
  };

  const addColumn = () => {
    const newColumn: FooterColumn = {
      id: `column-${Date.now()}`,
      title: 'New Section',
      content: 'Add your content here...',
      visible: true,
      width: '1fr',
      titleColor: '#2F5B3C',
      titleSize: '18px',
      titleWeight: 'semibold',
      contentColor: '#9ca3af',
      contentSize: '14px',
      alignment: 'left',
      links: []
    };
    updateFooterConfig({
      content: {
        ...footerConfig.content,
        columns: [...footerConfig.content.columns, newColumn]
      }
    });
  };

  const updateColumn = (columnId: string, updates: Partial<FooterColumn>) => {
    const updatedColumns = footerConfig.content.columns.map(column =>
      column.id === columnId ? { ...column, ...updates } : column
    );
    updateFooterConfig({
      content: {
        ...footerConfig.content,
        columns: updatedColumns
      }
    });
  };

  const deleteColumn = (columnId: string) => {
    const updatedColumns = footerConfig.content.columns.filter(column => column.id !== columnId);
    updateFooterConfig({
      content: {
        ...footerConfig.content,
        columns: updatedColumns
      }
    });
  };

  const addColumnLink = (columnId: string) => {
    const column = footerConfig.content.columns.find(col => col.id === columnId);
    if (column) {
      const newLink = {
        id: `link-${Date.now()}`,
        label: 'New Link',
        url: '/',
        visible: true,
        color: '#d1d5db',
        hoverColor: '#2F5B3C'
      };
      updateColumn(columnId, {
        links: [...column.links, newLink]
      });
    }
  };

  const addSocialLink = () => {
    const newSocial: SocialLink = {
      id: `social-${Date.now()}`,
      platform: 'custom',
      label: 'New Social',
      url: '',
      visible: true,
      icon: Link,
      color: '#9ca3af',
      hoverColor: '#2F5B3C',
      size: '24px',
      shape: 'circle'
    };
    updateFooterConfig({
      social: {
        ...footerConfig.social,
        links: [...footerConfig.social.links, newSocial]
      }
    });
  };

  const updateSocialLink = (linkId: string, updates: Partial<SocialLink>) => {
    const updatedLinks = footerConfig.social.links.map(link =>
      link.id === linkId ? { ...link, ...updates } : link
    );
    updateFooterConfig({
      social: {
        ...footerConfig.social,
        links: updatedLinks
      }
    });
  };

  const addContactInfo = () => {
    const newContact: ContactInfo = {
      id: `contact-${Date.now()}`,
      type: 'phone',
      label: 'New Contact',
      value: '',
      visible: true,
      icon: Phone,
      color: '#d1d5db',
      fontSize: '14px',
      showIcon: true
    };
    updateFooterConfig({
      contact: {
        ...footerConfig.contact,
        info: [...footerConfig.contact.info, newContact]
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Advanced Footer Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Advanced Footer Preview
            </CardTitle>
            <div className="flex gap-2">
              <UndoRedoControls
                canUndo={footerUndoRedo.canUndo}
                canRedo={footerUndoRedo.canRedo}
                onUndo={footerUndoRedo.undo}
                onRedo={footerUndoRedo.redo}
                onClear={footerUndoRedo.clear}
                sectionName="Footer"
              />
              <Button
                variant={isEditMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setEditMode(!isEditMode);
                  setEditModeType(isEditMode ? null : 'footer');
                }}
              >
                <Move className="w-4 h-4 mr-2" />
                {isEditMode ? 'Drag Active' : 'Enable Drag'}
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
                Save Footer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className="border rounded-lg overflow-hidden relative"
            style={{ 
              background: footerConfig.styling.backgroundColor,
              backgroundImage: footerConfig.styling.backgroundGradient !== footerConfig.styling.backgroundColor 
                ? footerConfig.styling.backgroundGradient 
                : footerConfig.styling.backgroundImage 
                ? `url(${footerConfig.styling.backgroundImage})` 
                : 'none',
              backgroundBlendMode: footerConfig.styling.backgroundBlendMode,
              color: footerConfig.styling.textColor,
              padding: footerConfig.layout.padding,
              borderTop: footerConfig.styling.borderTop ? `${footerConfig.styling.borderWidth} solid ${footerConfig.styling.borderColor}` : 'none',
              boxShadow: footerConfig.styling.boxShadow,
              borderRadius: footerConfig.styling.borderRadius,
              position: footerConfig.effects.stickyFooter ? 'sticky' : 'relative',
              bottom: footerConfig.effects.stickyFooter ? '0' : 'auto'
            }}
          >
            {/* Grid overlay and alignment guides */}
            {isEditMode && (
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
            {/* Main Footer Content */}
            <div 
              className="mx-auto"
              style={{ maxWidth: footerConfig.layout.maxWidth }}
            >
              <div 
                className={`grid gap-${footerConfig.layout.gap.replace('px', '')} mb-8`}
                style={{ 
                  gridTemplateColumns: footerConfig.layout.type === 'custom-grid' 
                    ? footerConfig.layout.gridTemplate 
                    : footerConfig.layout.type === 'single' 
                    ? '1fr'
                    : footerConfig.layout.type === 'two-column'
                    ? '1fr 1fr'
                    : footerConfig.layout.type === 'three-column'
                    ? '1fr 1fr 1fr'
                    : '1fr 1fr 1fr 1fr',
                  gap: footerConfig.layout.gap
                }}
              >
                {/* Brand Column */}
                <div className={`text-${footerConfig.layout.alignment}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {footerConfig.branding.logos.map((logo) => (
                      <div
                        key={logo.id}
                        className={`${isEditMode ? 'cursor-move' : 'cursor-pointer'} transition-all`}
                        style={{
                          position: isEditMode ? 'relative' : 'static'
                        }}
                        onMouseDown={(e) => {
                          if (isEditMode && !previewMode) {
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
                              
                              // Actually move the element
                              element.style.transform = `translate(${newX}px, ${newY}px)`;
                              element.style.position = 'absolute';
                              element.style.zIndex = '1000';
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
                        <img
                          src={logo.url}
                          alt={logo.alt}
                          style={{ 
                            width: logo.width, 
                            height: logo.height, 
                            opacity: logo.opacity 
                          }}
                          className="object-contain"
                        />
                        {isEditMode && (
                          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10 opacity-0 hover:opacity-100 transition-opacity">
                            Drag to move logo
                          </div>
                        )}
                      </div>
                    ))}
                    <div
                      className={`${isEditMode ? 'cursor-move' : 'cursor-pointer'} transition-all relative`}
                      onMouseDown={(e) => {
                        if (isEditMode && !previewMode) {
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
                            
                            // Actually move the element
                            element.style.transform = `translate(${newX}px, ${newY}px)`;
                            element.style.position = 'absolute';
                            element.style.zIndex = '1000';
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
                      <h3
                        style={{
                          color: footerConfig.branding.brandColor,
                          fontFamily: footerConfig.branding.brandFont,
                          fontSize: footerConfig.branding.brandSize,
                          fontWeight: footerConfig.branding.brandWeight
                        }}
                      >
                        {footerConfig.branding.brandText}
                      </h3>
                      {footerConfig.branding.tagline && (
                        <p
                          style={{
                            color: footerConfig.branding.taglineColor,
                            fontSize: footerConfig.branding.taglineSize
                          }}
                        >
                          {footerConfig.branding.tagline}
                        </p>
                      )}
                      {isEditMode && (
                        <div className="absolute -top-6 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded z-10 opacity-0 hover:opacity-100 transition-opacity">
                          Drag to move text
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  {footerConfig.contact.groupedDisplay && (
                    <div 
                      className={`space-y-2 ${isEditMode ? 'cursor-move' : 'cursor-pointer'} transition-all relative`}
                      onMouseDown={(e) => {
                        if (isEditMode && !previewMode) {
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
                            
                            // Actually move the element
                            element.style.transform = `translate(${newX}px, ${newY}px)`;
                            element.style.position = 'absolute';
                            element.style.zIndex = '1000';
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
                      <h4 
                        style={{ color: footerConfig.contact.titleColor }}
                        className="font-semibold mb-3"
                      >
                        {footerConfig.contact.title}
                      </h4>
                      {footerConfig.contact.info.filter(contact => contact.visible).map((contact) => {
                        const IconComponent = contact.icon;
                        return (
                          <div key={contact.id} className="flex items-center gap-2">
                            {contact.showIcon && <IconComponent className="w-4 h-4" />}
                            <span 
                              style={{ 
                                color: contact.color,
                                fontSize: contact.fontSize
                              }}
                            >
                              {contact.value}
                            </span>
                          </div>
                        );
                      })}
                      {isEditMode && (
                        <div className="absolute -top-6 left-0 bg-purple-500 text-white text-xs px-2 py-1 rounded z-10 opacity-0 hover:opacity-100 transition-opacity">
                          Drag to move contact
                        </div>
                      )}
                    </div>
                  )}

                  {/* Social Links */}
                  <div 
                    className={`mt-6 flex items-center gap-3 justify-${footerConfig.social.alignment} ${isEditMode ? 'cursor-move' : 'cursor-pointer'} transition-all relative`}
                    onMouseDown={(e) => {
                      if (isEditMode && !previewMode) {
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
                          
                          // Actually move the element
                          element.style.transform = `translate(${newX}px, ${newY}px)`;
                          element.style.position = 'absolute';
                          element.style.zIndex = '1000';
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
                    <span 
                      style={{ color: footerConfig.social.titleColor }}
                      className="text-sm font-medium"
                    >
                      {footerConfig.social.title}:
                    </span>
                    {footerConfig.social.links.filter(social => social.visible).map((social) => {
                      const IconComponent = social.icon;
                      return (
                        <a
                          key={social.id}
                          href={previewMode ? social.url : '#'}
                          className={`
                            p-2 transition-colors
                            ${social.shape === 'circle' ? 'rounded-full' : ''}
                            ${social.shape === 'square' ? 'rounded-none' : ''}
                            ${social.shape === 'rounded' ? 'rounded-md' : ''}
                          `}
                          style={{ 
                            backgroundColor: `${social.color}20`,
                            color: social.color
                          }}
                          title={social.label}
                        >
                          <IconComponent size={parseInt(social.size)} />
                        </a>
                      );
                    })}
                    {isEditMode && (
                      <div className="absolute -top-6 left-0 bg-orange-500 text-white text-xs px-2 py-1 rounded z-10 opacity-0 hover:opacity-100 transition-opacity">
                        Drag to move socials
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Columns */}
                {footerConfig.content.columns.filter(column => column.visible).map((column) => (
                  <div 
                    key={column.id} 
                    className={`text-${column.alignment} ${isEditMode ? 'cursor-move' : 'cursor-pointer'} transition-all relative`}
                    onMouseDown={(e) => {
                      if (isEditMode && !previewMode) {
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
                          
                          // Actually move the element
                          element.style.transform = `translate(${newX}px, ${newY}px)`;
                          element.style.position = 'absolute';
                          element.style.zIndex = '1000';
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
                    <h4 
                      style={{ 
                        color: column.titleColor,
                        fontSize: column.titleSize,
                        fontWeight: column.titleWeight
                      }}
                      className="mb-3"
                    >
                      {column.title}
                    </h4>
                    <p 
                      style={{ 
                        color: column.contentColor,
                        fontSize: column.contentSize
                      }}
                      className="mb-4 opacity-90"
                    >
                      {column.content}
                    </p>
                    <ul className="space-y-2">
                      {column.links.filter(link => link.visible).map((link) => (
                        <li key={link.id}>
                          <a
                            href={previewMode ? link.url : '#'}
                            style={{ color: link.color }}
                            className="transition-colors hover:opacity-80"
                            onMouseOver={(e) => e.target.style.color = link.hoverColor}
                            onMouseOut={(e) => e.target.style.color = link.color}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                    {isEditMode && (
                      <div className="absolute -top-6 left-0 bg-teal-500 text-white text-xs px-2 py-1 rounded z-10 opacity-0 hover:opacity-100 transition-opacity">
                        Drag to move column
                      </div>
                    )}
                  </div>
                ))}

                {/* Custom HTML */}
                {footerConfig.content.showCustomHtml && footerConfig.content.customHtml && (
                  <div dangerouslySetInnerHTML={{ __html: footerConfig.content.customHtml }} />
                )}
              </div>

              {/* Copyright */}
              {footerConfig.copyright.separator && (
                <hr 
                  style={{ 
                    borderColor: footerConfig.copyright.separatorColor,
                    marginBottom: '20px'
                  }}
                />
              )}
              <div 
                className={`flex items-center justify-${footerConfig.copyright.alignment} gap-6`}
              >
                <span 
                  style={{ 
                    color: footerConfig.copyright.color,
                    fontSize: footerConfig.copyright.fontSize
                  }}
                >
                  {footerConfig.copyright.text.replace('{year}', footerConfig.copyright.year)}
                </span>
                <div className="flex items-center gap-4">
                  {footerConfig.copyright.customLinks.filter(link => link.visible).map((link) => (
                    <a
                      key={link.id}
                      href={previewMode ? link.url : '#'}
                      style={{ 
                        color: footerConfig.copyright.color,
                        fontSize: footerConfig.copyright.fontSize
                      }}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Configuration */}
      <Tabs defaultValue="layout" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Advanced Layout Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Layout Type</Label>
                  <Select
                    value={footerConfig.layout.type}
                    onValueChange={(value: any) =>
                      updateFooterConfig({
                        layout: { ...footerConfig.layout, type: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="single" className="text-gray-900 hover:bg-gray-100">Single Column</SelectItem>
                      <SelectItem value="two-column" className="text-gray-900 hover:bg-gray-100">Two Columns</SelectItem>
                      <SelectItem value="three-column" className="text-gray-900 hover:bg-gray-100">Three Columns</SelectItem>
                      <SelectItem value="four-column" className="text-gray-900 hover:bg-gray-100">Four Columns</SelectItem>
                      <SelectItem value="custom-grid" className="text-gray-900 hover:bg-gray-100">Custom Grid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Content Alignment</Label>
                  <div className="flex gap-1">
                    <Button
                      variant={footerConfig.layout.alignment === 'left' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() =>
                        updateFooterConfig({
                          layout: { ...footerConfig.layout, alignment: 'left' }
                        })
                      }
                    >
                      <AlignLeft className="w-3 h-3" />
                    </Button>
                    <Button
                      variant={footerConfig.layout.alignment === 'center' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() =>
                        updateFooterConfig({
                          layout: { ...footerConfig.layout, alignment: 'center' }
                        })
                      }
                    >
                      <AlignCenter className="w-3 h-3" />
                    </Button>
                    <Button
                      variant={footerConfig.layout.alignment === 'right' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() =>
                        updateFooterConfig({
                          layout: { ...footerConfig.layout, alignment: 'right' }
                        })
                      }
                    >
                      <AlignRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {footerConfig.layout.type === 'custom-grid' && (
                <div>
                  <Label>Grid Template Columns</Label>
                  <Input
                    value={footerConfig.layout.gridTemplate}
                    onChange={(e) =>
                      updateFooterConfig({
                        layout: { ...footerConfig.layout, gridTemplate: e.target.value }
                      })
                    }
                    placeholder="1fr 2fr 1fr"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Gap</Label>
                  <Input
                    value={footerConfig.layout.gap}
                    onChange={(e) =>
                      updateFooterConfig({
                        layout: { ...footerConfig.layout, gap: e.target.value }
                      })
                    }
                    placeholder="40px"
                  />
                </div>
                <div>
                  <Label>Padding</Label>
                  <Input
                    value={footerConfig.layout.padding}
                    onChange={(e) =>
                      updateFooterConfig({
                        layout: { ...footerConfig.layout, padding: e.target.value }
                      })
                    }
                    placeholder="60px 20px"
                  />
                </div>
                <div>
                  <Label>Max Width</Label>
                  <Input
                    value={footerConfig.layout.maxWidth}
                    onChange={(e) =>
                      updateFooterConfig({
                        layout: { ...footerConfig.layout, maxWidth: e.target.value }
                      })
                    }
                    placeholder="1200px"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Background & Styling</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={footerConfig.styling.backgroundColor}
                        onChange={(e) =>
                          updateFooterConfig({
                            styling: { ...footerConfig.styling, backgroundColor: e.target.value }
                          })
                        }
                        className="w-16"
                      />
                      <Input
                        value={footerConfig.styling.backgroundColor}
                        onChange={(e) =>
                          updateFooterConfig({
                            styling: { ...footerConfig.styling, backgroundColor: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={footerConfig.styling.textColor}
                        onChange={(e) =>
                          updateFooterConfig({
                            styling: { ...footerConfig.styling, textColor: e.target.value }
                          })
                        }
                        className="w-16"
                      />
                      <Input
                        value={footerConfig.styling.textColor}
                        onChange={(e) =>
                          updateFooterConfig({
                            styling: { ...footerConfig.styling, textColor: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Background Gradient (CSS)</Label>
                  <Input
                    value={footerConfig.styling.backgroundGradient}
                    onChange={(e) =>
                      updateFooterConfig({
                        styling: { ...footerConfig.styling, backgroundGradient: e.target.value }
                      })
                    }
                    placeholder="linear-gradient(135deg, #1f2937 0%, #374151 100%)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logo Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Multiple Logos
                  </CardTitle>
                  <Button
                    onClick={() => logoInputRef.current?.click()}
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Add Logo
                  </Button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => addLogo(e.target.files)}
                    className="hidden"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {footerConfig.branding.logos.map((logo) => (
                  <div key={logo.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img src={logo.url} alt={logo.alt} className="w-8 h-8 object-contain" />
                        <Input
                          value={logo.alt}
                          onChange={(e) => updateLogo(logo.id, { alt: e.target.value })}
                          size="sm"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLogo(logo.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        value={logo.width}
                        onChange={(e) => updateLogo(logo.id, { width: Number(e.target.value) })}
                        placeholder="Width"
                        size="sm"
                      />
                      <Input
                        type="number"
                        value={logo.height}
                        onChange={(e) => updateLogo(logo.id, { height: Number(e.target.value) })}
                        placeholder="Height"
                        size="sm"
                      />
                      <Input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={logo.opacity}
                        onChange={(e) => updateLogo(logo.id, { opacity: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Brand Text */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Brand Text
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={footerConfig.branding.brandText}
                  onChange={(e) =>
                    updateFooterConfig({
                      branding: { ...footerConfig.branding, brandText: e.target.value }
                    })
                  }
                  placeholder="Brand name"
                />

                <Textarea
                  value={footerConfig.branding.tagline}
                  onChange={(e) =>
                    updateFooterConfig({
                      branding: { ...footerConfig.branding, tagline: e.target.value }
                    })
                  }
                  placeholder="Brand tagline"
                  rows={2}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Brand Color</Label>
                    <Input
                      type="color"
                      value={footerConfig.branding.brandColor}
                      onChange={(e) =>
                        updateFooterConfig({
                          branding: { ...footerConfig.branding, brandColor: e.target.value }
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Tagline Color</Label>
                    <Input
                      type="color"
                      value={footerConfig.branding.taglineColor}
                      onChange={(e) =>
                        updateFooterConfig({
                          branding: { ...footerConfig.branding, taglineColor: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Grid3X3 className="w-5 h-5" />
                  Content Columns
                </CardTitle>
                <Button onClick={addColumn} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Column
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {footerConfig.content.columns.map((column) => (
                <div key={column.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={column.visible}
                        onCheckedChange={(checked) =>
                          updateColumn(column.id, { visible: checked })
                        }
                      />
                      <Input
                        value={column.title}
                        onChange={(e) =>
                          updateColumn(column.id, { title: e.target.value })
                        }
                        className="font-medium"
                        size="sm"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteColumn(column.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  <Textarea
                    value={column.content}
                    onChange={(e) =>
                      updateColumn(column.id, { content: e.target.value })
                    }
                    rows={3}
                    className="mb-3"
                  />

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <Input
                      type="color"
                      value={column.titleColor}
                      onChange={(e) =>
                        updateColumn(column.id, { titleColor: e.target.value })
                      }
                      title="Title Color"
                    />
                    <Input
                      type="color"
                      value={column.contentColor}
                      onChange={(e) =>
                        updateColumn(column.id, { contentColor: e.target.value })
                      }
                      title="Content Color"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addColumnLink(column.id)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Link
                    </Button>
                  </div>

                  {/* Column Links */}
                  {column.links.map((link) => (
                    <div key={link.id} className="flex items-center gap-2 mb-2">
                      <Switch
                        checked={link.visible}
                        onCheckedChange={(checked) => {
                          const updatedLinks = column.links.map(l =>
                            l.id === link.id ? { ...l, visible: checked } : l
                          );
                          updateColumn(column.id, { links: updatedLinks });
                        }}
                      />
                      <Input
                        value={link.label}
                        onChange={(e) => {
                          const updatedLinks = column.links.map(l =>
                            l.id === link.id ? { ...l, label: e.target.value } : l
                          );
                          updateColumn(column.id, { links: updatedLinks });
                        }}
                        size="sm"
                        placeholder="Link text"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => {
                          const updatedLinks = column.links.map(l =>
                            l.id === link.id ? { ...l, url: e.target.value } : l
                          );
                          updateColumn(column.id, { links: updatedLinks });
                        }}
                        size="sm"
                        placeholder="URL"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updatedLinks = column.links.filter(l => l.id !== link.id);
                          updateColumn(column.id, { links: updatedLinks });
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <Button onClick={addContactInfo} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                  value={footerConfig.contact.title}
                  onChange={(e) =>
                    updateFooterConfig({
                      contact: { ...footerConfig.contact, title: e.target.value }
                    })
                  }
                  placeholder="Contact section title"
                />
                <Input
                  type="color"
                  value={footerConfig.contact.titleColor}
                  onChange={(e) =>
                    updateFooterConfig({
                      contact: { ...footerConfig.contact, titleColor: e.target.value }
                    })
                  }
                />
              </div>

              {footerConfig.contact.info.map((contact) => (
                <div key={contact.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={contact.visible}
                        onCheckedChange={(checked) => {
                          const updatedInfo = footerConfig.contact.info.map(info =>
                            info.id === contact.id ? { ...info, visible: checked } : info
                          );
                          updateFooterConfig({
                            contact: { ...footerConfig.contact, info: updatedInfo }
                          });
                        }}
                      />
                      <Select
                        value={contact.type}
                        onValueChange={(value: any) => {
                          const contactType = contactTypes.find(ct => ct.value === value);
                          const updatedInfo = footerConfig.contact.info.map(info =>
                            info.id === contact.id ? { ...info, type: value, icon: contactType?.icon } : info
                          );
                          updateFooterConfig({
                            contact: { ...footerConfig.contact, info: updatedInfo }
                          });
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          {contactTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="text-gray-900 hover:bg-gray-100">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updatedInfo = footerConfig.contact.info.filter(info => info.id !== contact.id);
                        updateFooterConfig({
                          contact: { ...footerConfig.contact, info: updatedInfo }
                        });
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={contact.label}
                      onChange={(e) => {
                        const updatedInfo = footerConfig.contact.info.map(info =>
                          info.id === contact.id ? { ...info, label: e.target.value } : info
                        );
                        updateFooterConfig({
                          contact: { ...footerConfig.contact, info: updatedInfo }
                        });
                      }}
                      placeholder="Label"
                      size="sm"
                    />
                    <Input
                      value={contact.value}
                      onChange={(e) => {
                        const updatedInfo = footerConfig.contact.info.map(info =>
                          info.id === contact.id ? { ...info, value: e.target.value } : info
                        );
                        updateFooterConfig({
                          contact: { ...footerConfig.contact, info: updatedInfo }
                        });
                      }}
                      placeholder="Value"
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Facebook className="w-5 h-5" />
                  Social Media Links
                </CardTitle>
                <Button onClick={addSocialLink} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {footerConfig.social.links.map((social) => (
                <div key={social.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={social.visible}
                        onCheckedChange={(checked) => updateSocialLink(social.id, { visible: checked })}
                      />
                      <Select
                        value={social.platform}
                        onValueChange={(value: any) => {
                          const platform = socialPlatforms.find(sp => sp.value === value);
                          updateSocialLink(social.id, { 
                            platform: value, 
                            icon: platform?.icon || Link 
                          });
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          {socialPlatforms.map((platform) => (
                            <SelectItem key={platform.value} value={platform.value} className="text-gray-900 hover:bg-gray-100">
                              {platform.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updatedLinks = footerConfig.social.links.filter(link => link.id !== social.id);
                        updateFooterConfig({
                          social: { ...footerConfig.social, links: updatedLinks }
                        });
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      value={social.label}
                      onChange={(e) => updateSocialLink(social.id, { label: e.target.value })}
                      placeholder="Label"
                      size="sm"
                    />
                    <Input
                      value={social.url}
                      onChange={(e) => updateSocialLink(social.id, { url: e.target.value })}
                      placeholder="URL"
                      size="sm"
                    />
                    <Select
                      value={social.shape}
                      onValueChange={(value: any) => updateSocialLink(social.id, { shape: value })}
                    >
                      <SelectTrigger size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="circle" className="text-gray-900 hover:bg-gray-100">Circle</SelectItem>
                        <SelectItem value="square" className="text-gray-900 hover:bg-gray-100">Square</SelectItem>
                        <SelectItem value="rounded" className="text-gray-900 hover:bg-gray-100">Rounded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Effects Tab */}
        <TabsContent value="effects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Advanced Effects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={footerConfig.effects.stickyFooter}
                    onCheckedChange={(checked) =>
                      updateFooterConfig({
                        effects: { ...footerConfig.effects, stickyFooter: checked }
                      })
                    }
                  />
                  <Label>Sticky Footer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={footerConfig.effects.parallaxBackground}
                    onCheckedChange={(checked) =>
                      updateFooterConfig({
                        effects: { ...footerConfig.effects, parallaxBackground: checked }
                      })
                    }
                  />
                  <Label>Parallax Background</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={footerConfig.effects.fadeInAnimation}
                    onCheckedChange={(checked) =>
                      updateFooterConfig({
                        effects: { ...footerConfig.effects, fadeInAnimation: checked }
                      })
                    }
                  />
                  <Label>Fade In Animation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={footerConfig.effects.glowEffects}
                    onCheckedChange={(checked) =>
                      updateFooterConfig({
                        effects: { ...footerConfig.effects, glowEffects: checked }
                      })
                    }
                  />
                  <Label>Glow Effects</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={footerConfig.effects.hoverAnimations}
                    onCheckedChange={(checked) =>
                      updateFooterConfig({
                        effects: { ...footerConfig.effects, hoverAnimations: checked }
                      })
                    }
                  />
                  <Label>Hover Animations</Label>
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
          Reset Footer
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
            Save Advanced Footer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFooterPanel;