import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Settings,
  Palette,
  FileText,
  Users,
  BarChart3,
  Image as ImageIcon,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Edit2,
  Save,
  Upload,
  Download,
  RefreshCw,
  Globe,
  Database,
  Shield,
  Layers,
  Code,
  Zap,
  Search,
  Bell,
  Plus,
  ExternalLink
} from 'lucide-react';
import { useUniversalCMS } from '@/contexts/UniversalCMSContext';
import AnalyticsDashboard from './AnalyticsDashboard';
import UniversalMediaLibrary from './UniversalMediaLibrary';
import UniversalSectionEditor from './UniversalSectionEditor';

const UniversalCRMDashboard: React.FC = () => {
  const { 
    state, 
    setActiveSection, 
    setEditMode, 
    setPreviewMode, 
    trackEvent,
    connectToSite,
    disconnectFromSite,
    saveChanges,
    revertChanges
  } = useUniversalCMS();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Enhanced sidebar items with comprehensive CRM features
  const sidebarItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      description: 'Main dashboard with quick stats and actions'
    },
    {
      id: 'analytics',
      label: 'Analytics & Traffic',
      icon: BarChart3,
      description: 'Visitor analytics, traffic sources, and behavior'
    },
    {
      id: 'header-editor',
      label: 'Header Editor',
      icon: Layers,
      description: 'Edit header content, navigation, and branding'
    },
    {
      id: 'body-editor',
      label: 'Content Editor',
      icon: FileText,
      description: 'Main content editing with drag & drop'
    },
    {
      id: 'footer-editor',
      label: 'Footer Editor',
      icon: Layers,
      description: 'Footer content, links, and social media'
    },
    {
      id: 'media-library',
      label: 'Media Library',
      icon: ImageIcon,
      description: 'Upload and manage all media files'
    },
    {
      id: 'theme-manager',
      label: 'Theme & Design',
      icon: Palette,
      description: 'Colors, fonts, and visual styling'
    },
    {
      id: 'seo-tools',
      label: 'SEO & Meta',
      icon: Search,
      description: 'Search engine optimization settings'
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      description: 'Manage team members and permissions'
    },
    {
      id: 'form-builder',
      label: 'Forms & Leads',
      icon: Database,
      description: 'Create forms and manage lead capture'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Zap,
      description: 'Connect with external services and APIs'
    },
    {
      id: 'security',
      label: 'Security & Backup',
      icon: Shield,
      description: 'Security settings and backup management'
    },
    {
      id: 'settings',
      label: 'Site Settings',
      icon: Settings,
      description: 'General site configuration and preferences'
    }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    trackEvent('dashboard_tab_changed', { tab: tabId });
    
    // Update active section for editors
    if (tabId.includes('-editor')) {
      const section = tabId.replace('-editor', '') as 'header' | 'body' | 'footer';
      setActiveSection(section === 'body' ? 'body' : section);
    }
  };

  const quickStats = [
    { label: 'Total Visitors', value: '15,420', change: '+12%', color: 'text-green-600' },
    { label: 'Page Views', value: '45,600', change: '+8%', color: 'text-green-600' },
    { label: 'Bounce Rate', value: '42.3%', change: '-5%', color: 'text-green-600' },
    { label: 'Avg Session', value: '2m 34s', change: '+15%', color: 'text-green-600' }
  ];

  const recentActivity = [
    { action: 'Header updated', user: 'Admin', time: '2 minutes ago', type: 'edit' },
    { action: 'New media uploaded', user: 'Editor', time: '15 minutes ago', type: 'upload' },
    { action: 'Theme colors changed', user: 'Admin', time: '1 hour ago', type: 'design' },
    { action: 'Form submission received', user: 'System', time: '2 hours ago', type: 'form' }
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Enhanced Sidebar */}
      <div className={`bg-card border-r transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold">Universal CRM</h1>
                <p className="text-sm text-muted-foreground">
                  {state.currentSite?.siteName || 'Connect to a site'}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Layers className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start mb-1 ${
                    sidebarCollapsed ? 'px-2' : 'px-3'
                  }`}
                  onClick={() => handleTabChange(item.id)}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <div className="ml-3 text-left overflow-hidden">
                      <p className="text-sm font-medium truncate">{item.label}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </p>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Site Connection Status */}
        <div className="p-4 border-t">
          {!sidebarCollapsed && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connection</span>
                <div className={`w-2 h-2 rounded-full ${
                  state.currentSite ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
              <p className="text-xs text-muted-foreground">
                {state.currentSite ? 'Connected' : 'Not connected'}
              </p>
              {state.currentSite && (
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Visit Site
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            {state.isDirty && (
              <Badge variant="destructive" className="text-xs">
                Unsaved Changes
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Preview Mode Toggle */}
            <div className="flex border rounded-lg p-1">
              <Button
                variant={state.previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={state.previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={state.previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={saveChanges}
              disabled={!state.isDirty}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <span className={`text-sm font-medium ${stat.color}`}>
                          {stat.change}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => handleTabChange('header-editor')}
                    >
                      <Edit2 className="w-6 h-6 mb-2" />
                      Edit Header
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => handleTabChange('body-editor')}
                    >
                      <FileText className="w-6 h-6 mb-2" />
                      Edit Content
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => handleTabChange('media-library')}
                    >
                      <Upload className="w-6 h-6 mb-2" />
                      Upload Media
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => handleTabChange('analytics')}
                    >
                      <BarChart3 className="w-6 h-6 mb-2" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'edit' ? 'bg-blue-500' :
                            activity.type === 'upload' ? 'bg-green-500' :
                            activity.type === 'design' ? 'bg-purple-500' :
                            'bg-orange-500'
                          }`} />
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">
                              by {activity.user}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'media-library' && <UniversalMediaLibrary />}
          
          {activeTab === 'header-editor' && (
            <UniversalSectionEditor 
              sectionType="header" 
              onSave={(data) => console.log('Header saved:', data)}
            />
          )}
          
          {activeTab === 'body-editor' && (
            <UniversalSectionEditor 
              sectionType="body" 
              onSave={(data) => console.log('Body saved:', data)}
            />
          )}
          
          {activeTab === 'footer-editor' && (
            <UniversalSectionEditor 
              sectionType="footer" 
              onSave={(data) => console.log('Footer saved:', data)}
            />
          )}

          {/* Placeholder for other tabs */}
          {!['overview', 'analytics', 'media-library', 'header-editor', 'body-editor', 'footer-editor'].includes(activeTab) && (
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{activeTab.replace('-', ' ')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <Code className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium mb-2">Coming Soon</p>
                  <p className="text-muted-foreground">
                    This feature is under development and will be available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversalCRMDashboard;