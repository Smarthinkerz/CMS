import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Type, 
  Image, 
  Eye, 
  RotateCcw, 
  Save, 
  Download, 
  Upload,
  Sparkles,
  Brush,
  Droplet,
  Sun,
  Moon,
  Contrast,
  Zap,
  Heart,
  Star,
  Flower,
  Gem
} from 'lucide-react';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface Typography {
  primaryFont: string;
  secondaryFont: string;
  headingFont: string;
  bodyFont: string;
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    tight: number;
    normal: number;
    wide: number;
  };
}

interface Background {
  type: 'solid' | 'gradient' | 'image' | 'pattern';
  value: string;
  overlay?: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
  animation?: {
    enabled: boolean;
    type: 'none' | 'fade' | 'slide' | 'zoom' | 'parallax';
    duration: number;
  };
}

interface ThemeConfig {
  name: string;
  palette: ColorPalette;
  typography: Typography;
  background: Background;
  borderRadius: number;
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    scale: number;
  };
  cultural: {
    rtlSupport: boolean;
    arabicFonts: string[];
    culturalColors: string[];
  };
}

interface GlobalThemeManagerProps {
  currentTheme?: ThemeConfig;
  onThemeChange?: (theme: ThemeConfig) => void;
  onApplyTheme?: (theme: ThemeConfig) => void;
  language?: 'en' | 'ar';
}

const defaultTheme: ThemeConfig = {
  name: 'Frankincense Elegance',
  palette: {
    primary: '#2F5B3C',
    secondary: '#4A7C59',
    accent: '#9333ea',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  typography: {
    primaryFont: 'Inter',
    secondaryFont: 'Playfair Display',
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    },
    letterSpacing: {
      tight: -0.025,
      normal: 0,
      wide: 0.025
    }
  },
  background: {
    type: 'gradient',
    value: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    overlay: {
      enabled: false,
      color: '#000000',
      opacity: 0.1
    },
    animation: {
      enabled: false,
      type: 'none',
      duration: 3000
    }
  },
  borderRadius: 8,
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  },
  spacing: {
    scale: 1
  },
  cultural: {
    rtlSupport: true,
    arabicFonts: ['Amiri', 'Cairo', 'Tajawal', 'IBM Plex Sans Arabic'],
    culturalColors: ['#9333ea', '#ec4899', '#06b6d4', '#10b981']
  }
};

const predefinedThemes: ThemeConfig[] = [
  {
    ...defaultTheme,
    name: 'Omani Elegance',
    palette: {
      ...defaultTheme.palette,
      primary: '#2F5B3C',
      secondary: '#4A7C59',
      accent: '#d4af37'
    }
  },
  {
    ...defaultTheme,
    name: 'Purple Lavender',
    palette: {
      ...defaultTheme.palette,
      primary: '#9333ea',
      secondary: '#c084fc',
      accent: '#ec4899'
    }
  },
  {
    ...defaultTheme,
    name: 'Desert Sunset',
    palette: {
      ...defaultTheme.palette,
      primary: '#ea580c',
      secondary: '#fb923c',
      accent: '#fbbf24'
    }
  },
  {
    ...defaultTheme,
    name: 'Ocean Breeze',
    palette: {
      ...defaultTheme.palette,
      primary: '#0ea5e9',
      secondary: '#38bdf8',
      accent: '#06b6d4'
    }
  }
];

const GlobalThemeManager: React.FC<GlobalThemeManagerProps> = ({
  currentTheme = defaultTheme,
  onThemeChange,
  onApplyTheme,
  language = 'en'
}) => {
  const [theme, setTheme] = useState<ThemeConfig>(currentTheme);
  const [activeTab, setActiveTab] = useState('palette');
  const [previewMode, setPreviewMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Real-time theme updates
  useEffect(() => {
    if (onThemeChange) {
      onThemeChange(theme);
    }
    
    // Apply CSS variables for instant reflection
    applyThemeToDOM(theme);
  }, [theme, onThemeChange]);

  const applyThemeToDOM = useCallback((themeConfig: ThemeConfig) => {
    const root = document.documentElement;
    
    // Apply color variables
    Object.entries(themeConfig.palette).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Apply typography variables
    root.style.setProperty('--font-primary', themeConfig.typography.primaryFont);
    root.style.setProperty('--font-secondary', themeConfig.typography.secondaryFont);
    root.style.setProperty('--font-heading', themeConfig.typography.headingFont);
    root.style.setProperty('--font-body', themeConfig.typography.bodyFont);
    
    // Apply font sizes
    Object.entries(themeConfig.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, `${value}px`);
    });
    
    // Apply background
    if (themeConfig.background.type === 'gradient') {
      root.style.setProperty('--bg-gradient', themeConfig.background.value);
    }
    
    // Apply border radius globally
    root.style.setProperty('--border-radius', `${themeConfig.borderRadius}px`);
    
    // Apply RTL support
    if (themeConfig.cultural.rtlSupport && language === 'ar') {
      document.dir = 'rtl';
    } else {
      document.dir = 'ltr';
    }
  }, [language]);

  const updatePalette = (key: keyof ColorPalette, value: string) => {
    setTheme(prev => ({
      ...prev,
      palette: {
        ...prev.palette,
        [key]: value
      }
    }));
  };

  const updateTypography = (category: string, key: string, value: any) => {
    setTheme(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [category]: {
          ...prev.typography[category as keyof Typography],
          [key]: value
        }
      }
    }));
  };

  const updateBackground = (key: keyof Background, value: any) => {
    setTheme(prev => ({
      ...prev,
      background: {
        ...prev.background,
        [key]: value
      }
    }));
  };

  const applyPredefinedTheme = (predefinedTheme: ThemeConfig) => {
    setTheme(predefinedTheme);
  };

  const resetToDefault = () => {
    setTheme(defaultTheme);
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTheme = JSON.parse(e.target?.result as string);
          setTheme(importedTheme);
        } catch (error) {
          console.error('Invalid theme file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const generateRandomTheme = () => {
    const colors = ['#9333ea', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06d6a0'];
    const primary = colors[Math.floor(Math.random() * colors.length)];
    const secondary = colors[Math.floor(Math.random() * colors.length)];
    const accent = colors[Math.floor(Math.random() * colors.length)];
    
    setTheme(prev => ({
      ...prev,
      name: `Random Theme ${Date.now()}`,
      palette: {
        ...prev.palette,
        primary,
        secondary,
        accent
      }
    }));
  };

  const ColorPicker = ({ label, value, onChange, icon: Icon }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    icon?: any;
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </Label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-purple-300 transition-colors"
          />
          <div 
            className="absolute inset-1 rounded-md"
            style={{ backgroundColor: value }}
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 font-mono text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'ar' ? 'مدير المظهر الشامل' : 'Global Theme Manager'}
            </h2>
            <p className="text-sm text-gray-600">
              {language === 'ar' 
                ? 'تخصيص الألوان والخطوط والخلفيات مع انعكاس فوري على الموقع'
                : 'Customize colors, typography, and backgrounds with instant site-wide reflection'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className={previewMode ? 'bg-purple-50 border-purple-300' : ''}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Exit Preview' : 'Preview Mode'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={generateRandomTheme}
          >
            <Zap className="w-4 h-4 mr-2" />
            Random
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          {onApplyTheme && (
            <Button
              onClick={() => onApplyTheme(theme)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Apply Theme
            </Button>
          )}
        </div>
      </div>

      {/* Current Theme Info */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">
                  {language === 'ar' ? 'المظهر النشط:' : 'Active Theme:'}
                </span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {theme.name}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-700 font-medium mr-2">Quick Colors:</span>
                {Object.values(theme.palette).slice(0, 8).map((color, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-lg border-3 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200 hover:shadow-xl"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      // Copy color to clipboard
                      navigator.clipboard.writeText(color);
                      console.log(`Copied ${color} to clipboard`);
                    }}
                    title={`${Object.keys(theme.palette)[index]}: ${color} (Click to copy)`}
                  />
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-purple-600 hover:text-purple-800"
                  onClick={() => setActiveTab('palette')}
                >
                  <Palette className="w-4 h-4 mr-1" />
                  Edit Colors
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={exportTheme}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importTheme}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button variant="ghost" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predefined Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-600" />
            {language === 'ar' ? 'المظاهر المحددة مسبقاً' : 'Predefined Themes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {predefinedThemes.map((predefinedTheme, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                  theme.name === predefinedTheme.name 
                    ? 'border-purple-400 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => applyPredefinedTheme(predefinedTheme)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex gap-1">
                      {Object.values(predefinedTheme.palette).slice(0, 3).map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-sm">{predefinedTheme.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {predefinedTheme.typography.primaryFont} • {predefinedTheme.background.type}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="palette" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            {language === 'ar' ? 'الألوان' : 'Colors'}
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            {language === 'ar' ? 'الخطوط' : 'Typography'}
          </TabsTrigger>
          <TabsTrigger value="background" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            {language === 'ar' ? 'الخلفية' : 'Background'}
          </TabsTrigger>
        </TabsList>

        {/* Color Palette Tab */}
        <TabsContent value="palette" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-purple-600" />
                {language === 'ar' ? 'لوحة الألوان' : 'Color Palette'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ColorPicker
                  label={language === 'ar' ? 'اللون الأساسي' : 'Primary Color'}
                  value={theme.palette.primary}
                  onChange={(value) => updatePalette('primary', value)}
                  icon={Heart}
                />
                
                <ColorPicker
                  label={language === 'ar' ? 'اللون الثانوي' : 'Secondary Color'}
                  value={theme.palette.secondary}
                  onChange={(value) => updatePalette('secondary', value)}
                  icon={Star}
                />
                
                <ColorPicker
                  label={language === 'ar' ? 'لون التمييز' : 'Accent Color'}
                  value={theme.palette.accent}
                  onChange={(value) => updatePalette('accent', value)}
                  icon={Sparkles}
                />
                
                <ColorPicker
                  label={language === 'ar' ? 'لون الخلفية' : 'Background Color'}
                  value={theme.palette.background}
                  onChange={(value) => updatePalette('background', value)}
                />
                
                <ColorPicker
                  label={language === 'ar' ? 'لون السطح' : 'Surface Color'}
                  value={theme.palette.surface}
                  onChange={(value) => updatePalette('surface', value)}
                />
                
                <ColorPicker
                  label={language === 'ar' ? 'لون النص' : 'Text Color'}
                  value={theme.palette.text}
                  onChange={(value) => updatePalette('text', value)}
                />
                
                <ColorPicker
                  label={language === 'ar' ? 'النص الثانوي' : 'Secondary Text'}
                  value={theme.palette.textSecondary}
                  onChange={(value) => updatePalette('textSecondary', value)}
                />
                
                <ColorPicker
                  label={language === 'ar' ? 'لون الحدود' : 'Border Color'}
                  value={theme.palette.border}
                  onChange={(value) => updatePalette('border', value)}
                />
                
                <ColorPicker
                  label={language === 'ar' ? 'لون النجاح' : 'Success Color'}
                  value={theme.palette.success}
                  onChange={(value) => updatePalette('success', value)}
                />
              </div>
              
              {/* Interactive Color Swatches */}
              <div className="mt-8 p-6 rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">
                    {language === 'ar' ? 'لوحة الألوان التفاعلية' : 'Interactive Color Swatches'}
                  </h4>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {language === 'ar' ? 'اضغط للنسخ' : 'Click to Copy'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(theme.palette).map(([key, value]) => (
                    <div 
                      key={key} 
                      className="group cursor-pointer transform transition-all duration-200 hover:scale-105"
                      onClick={() => {
                        navigator.clipboard.writeText(value);
                        console.log(`Copied ${value} to clipboard`);
                      }}
                    >
                      <div
                        className="w-full h-20 rounded-xl shadow-lg border-3 border-white group-hover:shadow-2xl transition-shadow duration-200 relative overflow-hidden"
                        style={{ backgroundColor: value }}
                      >
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium">
                            Copy
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-center space-y-1">
                        <div className="font-medium capitalize text-sm text-gray-800">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded-md shadow-sm">
                          {value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Quick Actions */}
                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-purple-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateRandomTheme}
                    className="bg-white hover:bg-purple-50"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'ألوان عشوائية' : 'Random Colors'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetToDefault}
                    className="bg-white hover:bg-purple-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'استعادة الافتراضي' : 'Reset Colors'}
                  </Button>
                  
                  <div className="ml-auto text-xs text-purple-600">
                    {language === 'ar' ? 'اضغط على أي لون لنسخه' : 'Click any color to copy to clipboard'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5 text-purple-600" />
                {language === 'ar' ? 'الخطوط والنصوص' : 'Typography Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Font Families */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'الخط الأساسي' : 'Primary Font'}</Label>
                  <select
                    value={theme.typography.primaryFont}
                    onChange={(e) => updateTypography('primaryFont', '', e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'خط العناوين' : 'Heading Font'}</Label>
                  <select
                    value={theme.typography.headingFont}
                    onChange={(e) => updateTypography('headingFont', '', e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Merriweather">Merriweather</option>
                    <option value="Crimson Text">Crimson Text</option>
                    <option value="Lora">Lora</option>
                    <option value="Cinzel">Cinzel</option>
                    <option value="Cormorant Garamond">Cormorant Garamond</option>
                  </select>
                </div>
              </div>
              
              {/* Font Sizes */}
              <div className="space-y-4">
                <h4 className="font-semibold">
                  {language === 'ar' ? 'أحجام الخطوط' : 'Font Sizes'}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(theme.typography.fontSize).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-xs uppercase">{key}</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[value]}
                          onValueChange={([newValue]) => updateTypography('fontSize', key, newValue)}
                          min={10}
                          max={48}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm font-mono w-10">{value}px</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Typography Preview */}
              <div className="mt-8 p-6 rounded-lg border-2 border-gray-200">
                <h4 className="font-semibold mb-4">
                  {language === 'ar' ? 'معاينة الخطوط' : 'Typography Preview'}
                </h4>
                <div className="space-y-4">
                  <h1 
                    style={{ 
                      fontFamily: theme.typography.headingFont,
                      fontSize: `${theme.typography.fontSize['4xl']}px`,
                      fontWeight: theme.typography.fontWeight.bold,
                      color: theme.palette.text
                    }}
                  >
                    {language === 'ar' ? 'عنوان رئيسي' : 'Main Heading'}
                  </h1>
                  
                  <h2 
                    style={{ 
                      fontFamily: theme.typography.headingFont,
                      fontSize: `${theme.typography.fontSize['2xl']}px`,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.palette.text
                    }}
                  >
                    {language === 'ar' ? 'عنوان فرعي' : 'Subheading'}
                  </h2>
                  
                  <p 
                    style={{ 
                      fontFamily: theme.typography.bodyFont,
                      fontSize: `${theme.typography.fontSize.base}px`,
                      fontWeight: theme.typography.fontWeight.normal,
                      color: theme.palette.textSecondary,
                      lineHeight: theme.typography.lineHeight.normal
                    }}
                  >
                    {language === 'ar' 
                      ? 'هذا نص تجريبي لمعاينة شكل الخط والتنسيق في المحتوى الأساسي للموقع. يمكنك رؤية كيف ستبدو النصوص بالخط المختار.'
                      : 'This is sample body text to preview how the font and formatting will look in the main content of your website. You can see how the text will appear with the selected font.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Background Tab */}
        <TabsContent value="background" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brush className="w-5 h-5 text-purple-600" />
                {language === 'ar' ? 'إعدادات الخلفية' : 'Background Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Background Type */}
              <div className="space-y-4">
                <Label>{language === 'ar' ? 'نوع الخلفية' : 'Background Type'}</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { type: 'solid', label: language === 'ar' ? 'لون واحد' : 'Solid', icon: Sun },
                    { type: 'gradient', label: language === 'ar' ? 'متدرج' : 'Gradient', icon: Droplet },
                    { type: 'image', label: language === 'ar' ? 'صورة' : 'Image', icon: Image },
                    { type: 'pattern', label: language === 'ar' ? 'نمط' : 'Pattern', icon: Gem }
                  ].map(({ type, label, icon: Icon }) => (
                    <Card
                      key={type}
                      className={`cursor-pointer transition-all duration-200 ${
                        theme.background.type === type 
                          ? 'border-purple-400 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => updateBackground('type', type)}
                    >
                      <CardContent className="p-4 text-center">
                        <Icon className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                        <span className="text-sm font-medium">{label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Background Value Input */}
              <div className="space-y-2">
                <Label>
                  {theme.background.type === 'solid' && (language === 'ar' ? 'لون الخلفية' : 'Background Color')}
                  {theme.background.type === 'gradient' && (language === 'ar' ? 'التدرج' : 'Gradient')}
                  {theme.background.type === 'image' && (language === 'ar' ? 'رابط الصورة' : 'Image URL')}
                  {theme.background.type === 'pattern' && (language === 'ar' ? 'كود النمط' : 'Pattern Code')}
                </Label>
                
                {theme.background.type === 'solid' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={theme.background.value}
                      onChange={(e) => updateBackground('value', e.target.value)}
                      className="w-12 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
                    />
                    <Input
                      value={theme.background.value}
                      onChange={(e) => updateBackground('value', e.target.value)}
                      className="flex-1"
                      placeholder="#ffffff"
                    />
                  </div>
                )}
                
                {theme.background.type !== 'solid' && (
                  <Input
                    value={theme.background.value}
                    onChange={(e) => updateBackground('value', e.target.value)}
                    placeholder={
                      theme.background.type === 'gradient' 
                        ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                        : theme.background.type === 'image' 
                        ? 'https://example.com/image.jpg'
                        : 'url(data:image/svg+xml,...)'
                    }
                    className="font-mono text-sm"
                  />
                )}
              </div>
              
              {/* Gradient Presets */}
              {theme.background.type === 'gradient' && (
                <div className="space-y-3">
                  <Label>{language === 'ar' ? 'تدرجات جاهزة' : 'Gradient Presets'}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
                    ].map((gradient, index) => (
                      <div
                        key={index}
                        className="h-12 rounded-lg cursor-pointer border-2 border-gray-200 hover:border-purple-300 transition-colors"
                        style={{ background: gradient }}
                        onClick={() => updateBackground('value', gradient)}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Background Preview */}
              <div className="mt-8">
                <Label className="mb-4 block">
                  {language === 'ar' ? 'معاينة الخلفية' : 'Background Preview'}
                </Label>
                <div
                  className="w-full h-32 rounded-lg border-2 border-gray-200 flex items-center justify-center"
                  style={{
                    background: theme.background.type === 'solid' 
                      ? theme.background.value
                      : theme.background.type === 'gradient'
                      ? theme.background.value
                      : theme.background.type === 'image'
                      ? `url(${theme.background.value}) center/cover`
                      : theme.background.value
                  }}
                >
                  <span 
                    className="text-lg font-semibold px-4 py-2 rounded-lg bg-white bg-opacity-80"
                    style={{ color: theme.palette.text }}
                  >
                    {language === 'ar' ? 'معاينة الخلفية' : 'Background Preview'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Live Preview Indicator */}
      {previewMode && (
        <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium">
            {language === 'ar' ? 'وضع المعاينة النشط' : 'Preview Mode Active'}
          </span>
        </div>
      )}
    </div>
  );
};

export default GlobalThemeManager;