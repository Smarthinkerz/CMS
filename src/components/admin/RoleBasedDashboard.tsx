import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/hooks/usePermissions';
import PermissionGate, { AdminOnly, EditorOrHigher, ThemeManagerGate, UserManagementGate, EditingGate } from '@/components/admin/PermissionGate';
import RoleSimulator from '@/components/admin/RoleSimulator';
import AdvancedHeaderPanel from '@/components/admin/AdvancedHeaderPanel';
import AdvancedBodyPanel from '@/components/admin/AdvancedBodyPanel';
import AdvancedFooterPanel from '@/components/admin/AdvancedFooterPanel';
import GlobalThemeManager from '@/components/admin/GlobalThemeManager';
import FloatingResizablePreviewPanel from '@/components/admin/FloatingResizablePreviewPanel';
import { useLivePreview } from '@/hooks/useLivePreview';
import { 
  Settings, 
  Layout, 
  Palette, 
  FileText, 
  ArrowLeft,
  Save,
  Eye,
  Monitor,
  Users,
  BarChart3,
  Bell,
  Search,
  Menu,
  X,
  LogIn,
  Shield,
  Layers,
  Brush,
  Crown,
  Edit3,
  AlertTriangle,
  Lock
} from 'lucide-react';

interface RoleBasedDashboardProps {
  language?: 'en' | 'ar';
}

const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ language = 'en' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  
  const {
    currentUser,
    currentRole,
    canAccess,
    canPerform,
    isSimulating,
    isAdmin,
    isEditor,
    isViewer
  } = usePermissions();
  
  // Live Preview Integration
  const {
    isVisible: previewVisible,
    activePanel,
    editingElement,
    previewData,
    setActivePanel,
    setEditingElement,
    togglePreview,
    hidePreview
  } = useLivePreview();

  // Update active panel when section changes
  useEffect(() => {
    switch (activeSection) {
      case 'customization':
        setActivePanel('header');
        break;
      case 'content':
        setActivePanel('body');
        break;
      case 'footer':
        setActivePanel('footer');
        break;
      case 'theme':
        setActivePanel('theme');
        break;
      default:
        setActivePanel(null);
    }
  }, [activeSection, setActivePanel]);

  // Role-based sidebar items
  const getSidebarItems = () => {
    const baseItems = [
      { 
        id: 'overview', 
        icon: Monitor, 
        label: language === 'ar' ? 'النظرة العامة' : 'Overview',
        active: true,
        permission: null
      },
    ];

    const conditionalItems = [
      { 
        id: 'customization', 
        icon: Palette, 
        label: language === 'ar' ? 'تحكم الرأس المتقدم' : 'Advanced Header Controls',
        active: canAccess('headerControls'),
        permission: 'headerControls'
      },
      { 
        id: 'content', 
        icon: FileText, 
        label: language === 'ar' ? 'بناء المحتوى المتقدم' : 'Advanced Body Builder',
        active: canAccess('bodyBuilder'),
        permission: 'bodyBuilder'
      },
      { 
        id: 'footer', 
        icon: Layers, 
        label: language === 'ar' ? 'مصمم التذييل المتقدم' : 'Advanced Footer Designer',
        active: canAccess('footerDesigner'),
        permission: 'footerDesigner'
      },
      { 
        id: 'theme', 
        icon: Brush, 
        label: language === 'ar' ? 'مدير المظهر الشامل' : 'Global Theme Manager',
        active: canAccess('themeManager'),
        permission: 'themeManager'
      },
      { 
        id: 'users', 
        icon: Users, 
        label: language === 'ar' ? 'إدارة المستخدمين' : 'User Management',
        active: canAccess('userManagement'),
        permission: 'userManagement'
      },
      { 
        id: 'analytics', 
        icon: BarChart3, 
        label: language === 'ar' ? 'التحليلات' : 'Analytics',
        active: canAccess('analytics'),
        permission: 'analytics'
      },
      { 
        id: 'settings', 
        icon: Settings, 
        label: language === 'ar' ? 'الإعدادات' : 'Settings',
        active: canAccess('settings'),
        permission: 'settings'
      },
    ];

    return [...baseItems, ...conditionalItems.filter(item => item.active)];
  };

  const sidebarItems = getSidebarItems();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getRoleInfo = () => {
    switch (currentRole) {
      case 'admin':
        return { 
          icon: Crown, 
          label: language === 'ar' ? 'مدير' : 'Admin',
          color: 'bg-purple-500 text-white',
          bgColor: 'bg-purple-50'
        };
      case 'editor':
        return { 
          icon: Edit3, 
          label: language === 'ar' ? 'محرر' : 'Editor',
          color: 'bg-blue-500 text-white',
          bgColor: 'bg-blue-50'
        };
      case 'viewer':
        return { 
          icon: Eye, 
          label: language === 'ar' ? 'مشاهد' : 'Viewer',
          color: 'bg-gray-500 text-white',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-16'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="text-lg font-bold text-[#2F5B3C]">
                  {language === 'ar' ? 'اللبان العماني' : 'THE FRANKINCENSE'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
                  </p>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${roleInfo.color}`}>
                    <RoleIcon className="w-3 h-3" />
                    {roleInfo.label}
                  </div>
                  {isSimulating && (
                    <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                      {language === 'ar' ? 'محاكاة' : 'SIM'}
                    </Badge>
                  )}
                </div>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSidebar}
              className="h-8 w-8 p-0"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'default' : 'ghost'}
                className={`w-full ${!sidebarOpen ? 'justify-center px-2' : 'justify-between px-3 py-2'}`}
                onClick={() => setActiveSection(item.id)}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="ml-3 truncate">{item.label}</span>
                  )}
                </div>
                {sidebarOpen && item.active && (
                  <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Role-based features indicator */}
        {sidebarOpen && (
          <div className={`mx-2 mb-2 p-3 rounded-lg ${roleInfo.bgColor} border`}>
            <div className="text-xs text-gray-600 mb-2">
              {language === 'ar' ? 'الميزات المتاحة:' : 'Available Features:'}
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'التحرير' : 'Editing'}:</span>
                <span className={canPerform('edit') ? 'text-green-600' : 'text-red-500'}>
                  {canPerform('edit') ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'النشر' : 'Publishing'}:</span>
                <span className={canPerform('publish') ? 'text-green-600' : 'text-red-500'}>
                  {canPerform('publish') ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'المظاهر' : 'Themes'}:</span>
                <span className={canPerform('accessThemes') ? 'text-green-600' : 'text-red-500'}>
                  {canPerform('accessThemes') ? '✓' : '✗'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" size="sm" asChild className="w-full">
            <a href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {sidebarOpen && (language === 'ar' ? 'العودة للموقع' : 'Back to Site')}
            </a>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {sidebarItems.find(item => item.id === activeSection)?.label || (language === 'ar' ? 'لوحة التحكم' : 'Dashboard')}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-500">
                    {language === 'ar' ? 'إدارة موقع اللبان العماني' : 'Manage your frankincense e-commerce website'}
                  </p>
                  {isSimulating && (
                    <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {language === 'ar' ? 'وضع المحاكاة' : 'Simulation Mode'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'بحث' : 'Search'}
              </Button>
              
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              
              <EditingGate language={language}>
                <Button 
                  variant={previewVisible ? "default" : "outline"} 
                  size="sm"
                  onClick={togglePreview}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewVisible ? 
                    (language === 'ar' ? 'إخفاء المعاينة' : 'Hide Preview') : 
                    (language === 'ar' ? 'عرض المعاينة' : 'Show Preview')
                  }
                </Button>
              </EditingGate>
              
              <EditingGate language={language}>
                <Button size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </Button>
              </EditingGate>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Role Simulator */}
              <RoleSimulator language={language} />
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {language === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-gray-500">
                      {language === 'ar' ? 'منتجات اللبان' : 'Frankincense products'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {language === 'ar' ? 'حالة الموقع' : 'Site Status'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">
                        {language === 'ar' ? 'مباشر' : 'Live'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {language === 'ar' ? 'الموقع متاح' : 'Website is accessible'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {language === 'ar' ? 'دورك' : 'Your Role'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <RoleIcon className={`w-4 h-4 ${roleInfo.color.includes('purple') ? 'text-purple-600' : roleInfo.color.includes('blue') ? 'text-blue-600' : 'text-gray-600'}`} />
                      <span className="text-sm font-medium">{roleInfo.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {canPerform('edit') ? 
                        (language === 'ar' ? 'يمكن التحرير' : 'Can edit') : 
                        (language === 'ar' ? 'عرض فقط' : 'View only')
                      }
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {language === 'ar' ? 'آخر تعديل' : 'Last Modified'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">
                      {language === 'ar' ? 'اليوم' : 'Today'}
                    </div>
                    <p className="text-xs text-gray-500">
                      {language === 'ar' ? 'تحديثات حديثة' : 'Recent updates'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions - Role-based */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <EditorOrHigher language={language}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveSection('customization')}
                      >
                        <Palette className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'تحكم الرأس المتقدم' : 'Advanced Header Controls'}
                      </Button>
                    </EditorOrHigher>
                    
                    <EditorOrHigher language={language}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveSection('content')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'بناء المحتوى المتقدم' : 'Advanced Body Builder'}
                      </Button>
                    </EditorOrHigher>
                    
                    <EditorOrHigher language={language}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveSection('footer')}
                      >
                        <Layers className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'مصمم التذييل المتقدم' : 'Advanced Footer Designer'}
                      </Button>
                    </EditorOrHigher>
                    
                    <EditorOrHigher language={language}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveSection('theme')}
                      >
                        <Brush className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'مدير المظهر الشامل' : 'Global Theme Manager'}
                      </Button>
                    </EditorOrHigher>
                    
                    <AdminOnly language={language}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveSection('settings')}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'إعدادات الموقع' : 'Site Settings'}
                      </Button>
                    </AdminOnly>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'ar' ? 'حالة النظام' : 'System Status'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{language === 'ar' ? 'الموقع' : 'Website'}</span>
                      <Badge variant="default" className="bg-green-500">
                        {language === 'ar' ? 'متصل' : 'Online'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{language === 'ar' ? 'خدمات API' : 'API Services'}</span>
                      <Badge variant="default" className="bg-green-500">
                        {language === 'ar' ? 'نشط' : 'Active'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{language === 'ar' ? 'كتالوج المنتجات' : 'Product Catalog'}</span>
                      <Badge variant="default" className="bg-green-500">
                        {language === 'ar' ? 'جاهز' : 'Ready'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{language === 'ar' ? 'التجارة الإلكترونية' : 'E-commerce'}</span>
                      <Badge variant="default" className="bg-green-500">
                        {language === 'ar' ? 'يعمل' : 'Functional'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Protected Content Sections */}
          <EditorOrHigher language={language}>
            {activeSection === 'customization' && (
              <AdvancedHeaderPanel />
            )}
          </EditorOrHigher>

          <EditorOrHigher language={language}>
            {activeSection === 'content' && (
              <AdvancedBodyPanel />
            )}
          </EditorOrHigher>

          <EditorOrHigher language={language}>
            {activeSection === 'footer' && (
              <AdvancedFooterPanel />
            )}
          </EditorOrHigher>

          <ThemeManagerGate language={language}>
            {activeSection === 'theme' && (
              <GlobalThemeManager
                language={language}
                onThemeChange={(theme) => console.log('Theme changed:', theme)}
                onApplyTheme={(theme) => console.log('Theme applied:', theme)}
              />
            )}
          </ThemeManagerGate>

          <UserManagementGate language={language}>
            {activeSection === 'users' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {language === 'ar' 
                        ? 'إدارة حسابات العملاء وصلاحيات المستخدمين'
                        : 'Manage customer accounts and user permissions'
                      }
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">
                        {language === 'ar' ? 'لوحة إدارة المستخدمين' : 'User Dashboard'}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {language === 'ar' 
                          ? 'ميزات إدارة المستخدمين ستكون متاحة في المراحل المستقبلية.'
                          : 'User management features will be available in future phases.'
                        }
                      </p>
                      <Badge variant="secondary">
                        {language === 'ar' ? 'ميزة مخططة' : 'Planned Feature'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </UserManagementGate>

          {activeSection === 'analytics' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'التحليلات' : 'Analytics'}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {language === 'ar' 
                      ? 'عرض أداء الموقع ورؤى العملاء'
                      : 'View website performance and customer insights'
                    }
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'ar' ? 'لوحة التحليلات' : 'Analytics Dashboard'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {language === 'ar' 
                        ? 'ميزات التحليلات والتقارير ستكون متاحة في المراحل المستقبلية.'
                        : 'Analytics and reporting features will be available in future phases.'
                      }
                    </p>
                    <Badge variant="secondary">
                      {language === 'ar' ? 'ميزة مخططة' : 'Planned Feature'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <AdminOnly language={language}>
            {activeSection === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'ar' ? 'الإعدادات' : 'Settings'}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {language === 'ar' 
                        ? 'تكوين إعدادات الموقع والتفضيلات'
                        : 'Configure your website settings and preferences'
                      }
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">
                        {language === 'ar' ? 'إعدادات الموقع' : 'Site Settings'}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {language === 'ar' 
                          ? 'الإعدادات المتقدمة وخيارات التكوين ستكون متاحة في المراحل المستقبلية.'
                          : 'Advanced settings and configuration options will be available in future phases.'
                        }
                      </p>
                      <Badge variant="secondary">
                        {language === 'ar' ? 'ميزة مخططة' : 'Planned Feature'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </AdminOnly>

          {/* Floating Resizable Preview Panel */}
          <EditingGate language={language}>
            <FloatingResizablePreviewPanel
              activePanel={activePanel}
              isVisible={previewVisible}
              onClose={hidePreview}
              editingElement={editingElement}
              previewData={previewData}
              language={language}
              onLanguageChange={(lang) => console.log('Language changed to:', lang)}
            />
          </EditingGate>
        </main>
      </div>
    </div>
  );
};

export default RoleBasedDashboard;