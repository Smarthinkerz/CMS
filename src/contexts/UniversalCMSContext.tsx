import React, { createContext, useContext, useState, useEffect } from 'react';

// Universal Site Integration Interface
interface SiteConfig {
  siteId: string;
  siteName: string;
  siteUrl: string;
  integration: 'iframe' | 'plugin' | 'api' | 'widget';
  apiEndpoint?: string;
  authToken?: string;
}

interface UniversalCMSState {
  currentSite: SiteConfig | null;
  isEditMode: boolean;
  activeSection: 'header' | 'body' | 'footer' | 'sidebar' | 'global';
  previewMode: 'desktop' | 'tablet' | 'mobile';
  isDirty: boolean;
  lastSaved: Date | null;
}

interface UniversalCMSContextType {
  state: UniversalCMSState;
  setSite: (site: SiteConfig) => void;
  setEditMode: (enabled: boolean) => void;
  setActiveSection: (section: UniversalCMSState['activeSection']) => void;
  setPreviewMode: (mode: UniversalCMSState['previewMode']) => void;
  markDirty: () => void;
  markSaved: () => void;
  
  // Site Integration Methods
  connectToSite: (config: SiteConfig) => Promise<boolean>;
  disconnectFromSite: () => void;
  saveChanges: () => Promise<boolean>;
  revertChanges: () => Promise<boolean>;
  
  // Universal Content Management
  updateContent: (section: string, elementId: string, content: any) => Promise<boolean>;
  updateStyles: (section: string, elementId: string, styles: any) => Promise<boolean>;
  createElement: (section: string, element: any) => Promise<string>;
  deleteElement: (section: string, elementId: string) => Promise<boolean>;
  
  // Analytics Integration
  getAnalytics: () => Promise<any>;
  trackEvent: (event: string, data?: any) => void;
}

const UniversalCMSContext = createContext<UniversalCMSContextType | null>(null);

export const UniversalCMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UniversalCMSState>({
    currentSite: null,
    isEditMode: false,
    activeSection: 'body',
    previewMode: 'desktop',
    isDirty: false,
    lastSaved: null
  });

  // Site Management
  const setSite = (site: SiteConfig) => {
    setState(prev => ({ ...prev, currentSite: site }));
  };

  const setEditMode = (enabled: boolean) => {
    setState(prev => ({ ...prev, isEditMode: enabled }));
  };

  const setActiveSection = (section: UniversalCMSState['activeSection']) => {
    setState(prev => ({ ...prev, activeSection: section }));
  };

  const setPreviewMode = (mode: UniversalCMSState['previewMode']) => {
    setState(prev => ({ ...prev, previewMode: mode }));
  };

  const markDirty = () => {
    setState(prev => ({ ...prev, isDirty: true }));
  };

  const markSaved = () => {
    setState(prev => ({ ...prev, isDirty: false, lastSaved: new Date() }));
  };

  // Universal Site Integration
  const connectToSite = async (config: SiteConfig): Promise<boolean> => {
    try {
      console.log('Connecting to site:', config);
      
      // Test connection based on integration type
      switch (config.integration) {
        case 'api':
          if (config.apiEndpoint && config.authToken) {
            const response = await fetch(`${config.apiEndpoint}/test`, {
              headers: { 'Authorization': `Bearer ${config.authToken}` }
            });
            if (!response.ok) throw new Error('API connection failed');
          }
          break;
        
        case 'plugin':
          // Check if plugin script is available
          if (typeof window !== 'undefined' && !(window as any).universalCMS) {
            console.warn('Plugin integration requires universalCMS script to be loaded');
          }
          break;
        
        case 'iframe':
        case 'widget':
          // Basic integration - always works
          break;
      }

      setSite(config);
      return true;
    } catch (error) {
      console.error('Failed to connect to site:', error);
      return false;
    }
  };

  const disconnectFromSite = () => {
    setState(prev => ({
      ...prev,
      currentSite: null,
      isEditMode: false,
      isDirty: false
    }));
  };

  // Content Management
  const updateContent = async (section: string, elementId: string, content: any): Promise<boolean> => {
    try {
      if (!state.currentSite) return false;

      const updateData = {
        siteId: state.currentSite.siteId,
        section,
        elementId,
        content,
        timestamp: new Date().toISOString()
      };

      // Save to localStorage for demo
      const key = `cms_content_${state.currentSite.siteId}_${section}_${elementId}`;
      localStorage.setItem(key, JSON.stringify(updateData));

      // If API integration, send to server
      if (state.currentSite.integration === 'api' && state.currentSite.apiEndpoint) {
        await fetch(`${state.currentSite.apiEndpoint}/content`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.currentSite.authToken}`
          },
          body: JSON.stringify(updateData)
        });
      }

      markDirty();
      return true;
    } catch (error) {
      console.error('Failed to update content:', error);
      return false;
    }
  };

  const updateStyles = async (section: string, elementId: string, styles: any): Promise<boolean> => {
    try {
      if (!state.currentSite) return false;

      const updateData = {
        siteId: state.currentSite.siteId,
        section,
        elementId,
        styles,
        timestamp: new Date().toISOString()
      };

      // Save to localStorage
      const key = `cms_styles_${state.currentSite.siteId}_${section}_${elementId}`;
      localStorage.setItem(key, JSON.stringify(updateData));

      markDirty();
      return true;
    } catch (error) {
      console.error('Failed to update styles:', error);
      return false;
    }
  };

  const createElement = async (section: string, element: any): Promise<string> => {
    const elementId = `element_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const success = await updateContent(section, elementId, element);
    return success ? elementId : '';
  };

  const deleteElement = async (section: string, elementId: string): Promise<boolean> => {
    try {
      if (!state.currentSite) return false;

      // Remove from localStorage
      const contentKey = `cms_content_${state.currentSite.siteId}_${section}_${elementId}`;
      const stylesKey = `cms_styles_${state.currentSite.siteId}_${section}_${elementId}`;
      
      localStorage.removeItem(contentKey);
      localStorage.removeItem(stylesKey);

      markDirty();
      return true;
    } catch (error) {
      console.error('Failed to delete element:', error);
      return false;
    }
  };

  const saveChanges = async (): Promise<boolean> => {
    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      markSaved();
      return true;
    } catch (error) {
      console.error('Failed to save changes:', error);
      return false;
    }
  };

  const revertChanges = async (): Promise<boolean> => {
    try {
      // Clear localStorage changes
      if (state.currentSite) {
        const keys = Object.keys(localStorage);
        const siteKeys = keys.filter(key => 
          key.startsWith(`cms_content_${state.currentSite!.siteId}_`) ||
          key.startsWith(`cms_styles_${state.currentSite!.siteId}_`)
        );
        siteKeys.forEach(key => localStorage.removeItem(key));
      }

      setState(prev => ({ ...prev, isDirty: false }));
      return true;
    } catch (error) {
      console.error('Failed to revert changes:', error);
      return false;
    }
  };

  // Analytics Integration
  const getAnalytics = async () => {
    // Mock analytics data - in real implementation, this would fetch from analytics service
    return {
      visitors: {
        total: 15420,
        today: 234,
        thisWeek: 1680,
        thisMonth: 7320
      },
      pageViews: {
        total: 45600,
        today: 567,
        thisWeek: 4200,
        thisMonth: 18900
      },
      topPages: [
        { path: '/', views: 12500, title: 'Home Page' },
        { path: '/about', views: 8900, title: 'About Us' },
        { path: '/products', views: 6700, title: 'Products' },
        { path: '/contact', views: 4200, title: 'Contact' },
        { path: '/blog', views: 3400, title: 'Blog' }
      ],
      referrers: [
        { source: 'google.com', visits: 8500 },
        { source: 'facebook.com', visits: 2100 },
        { source: 'twitter.com', visits: 980 },
        { source: 'linkedin.com', visits: 650 },
        { source: 'direct', visits: 3190 }
      ],
      devices: {
        desktop: 60,
        mobile: 35,
        tablet: 5
      },
      locations: [
        { country: 'United States', visits: 6800 },
        { country: 'United Kingdom', visits: 2100 },
        { country: 'Germany', visits: 1800 },
        { country: 'France', visits: 1200 },
        { country: 'Canada', visits: 950 }
      ]
    };
  };

  const trackEvent = (event: string, data?: any) => {
    console.log('Tracking event:', event, data);
    
    // Store event for analytics
    const eventData = {
      event,
      data,
      timestamp: new Date().toISOString(),
      siteId: state.currentSite?.siteId
    };

    // In real implementation, send to analytics service
    const events = JSON.parse(localStorage.getItem('cms_analytics_events') || '[]');
    events.push(eventData);
    localStorage.setItem('cms_analytics_events', JSON.stringify(events.slice(-1000))); // Keep last 1000 events
  };

  const contextValue: UniversalCMSContextType = {
    state,
    setSite,
    setEditMode,
    setActiveSection,
    setPreviewMode,
    markDirty,
    markSaved,
    connectToSite,
    disconnectFromSite,
    saveChanges,
    revertChanges,
    updateContent,
    updateStyles,
    createElement,
    deleteElement,
    getAnalytics,
    trackEvent
  };

  return (
    <UniversalCMSContext.Provider value={contextValue}>
      {children}
    </UniversalCMSContext.Provider>
  );
};

export const useUniversalCMS = () => {
  const context = useContext(UniversalCMSContext);
  if (!context) {
    throw new Error('useUniversalCMS must be used within UniversalCMSProvider');
  }
  return context;
};

export type { SiteConfig, UniversalCMSState, UniversalCMSContextType };