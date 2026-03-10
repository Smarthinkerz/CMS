import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole } from '@/types/permissions';
import { 
  Users, 
  Crown, 
  Edit3, 
  Eye, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Settings,
  Zap
} from 'lucide-react';

interface RoleSimulatorProps {
  onRoleChange?: (role: UserRole) => void;
  language?: 'en' | 'ar';
}

const RoleSimulator: React.FC<RoleSimulatorProps> = ({ 
  onRoleChange,
  language = 'en' 
}) => {
  const {
    currentUser,
    currentRole,
    simulateRole,
    stopSimulation,
    isSimulating,
    originalRole,
    canAccess,
    canPerform,
    getRolePermissions
  } = usePermissions();

  const [showDetails, setShowDetails] = useState(false);

  const roleConfig = {
    admin: {
      icon: Crown,
      label: language === 'ar' ? 'مدير' : 'Admin',
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      description: language === 'ar' ? 'صلاحيات كاملة للنظام' : 'Full system access'
    },
    editor: {
      icon: Edit3,
      label: language === 'ar' ? 'محرر' : 'Editor',
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      description: language === 'ar' ? 'تحرير المحتوى والتصميم' : 'Content and design editing'
    },
    viewer: {
      icon: Eye,
      label: language === 'ar' ? 'مشاهد' : 'Viewer',
      color: 'bg-gray-500',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-300',
      description: language === 'ar' ? 'مشاهدة فقط' : 'View-only access'
    }
  };

  const handleRoleSimulation = (role: UserRole) => {
    simulateRole(role);
    if (onRoleChange) {
      onRoleChange(role);
    }
  };

  const handleStopSimulation = () => {
    stopSimulation();
    if (onRoleChange && originalRole) {
      onRoleChange(originalRole);
    }
  };

  const getCurrentConfig = () => roleConfig[currentRole];
  const currentConfig = getCurrentConfig();
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="space-y-4" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Current Role Display */}
      <Card className={`border-2 ${currentConfig.borderColor} ${currentConfig.bgColor}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${currentConfig.color} rounded-lg`}>
                <CurrentIcon className="w-5 h-5 text-white" />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {language === 'ar' ? 'الدور النشط:' : 'Active Role:'}
                  </span>
                  <Badge variant="secondary" className={`${currentConfig.bgColor} ${currentConfig.textColor}`}>
                    {currentConfig.label}
                  </Badge>
                  
                  {isSimulating && (
                    <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
                      <Zap className="w-3 h-3 mr-1" />
                      {language === 'ar' ? 'محاكاة' : 'Simulating'}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mt-1">
                  {currentUser && (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback className="text-xs">
                          {currentUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">{currentUser.name}</span>
                    </div>
                  )}
                  
                  <span className="text-xs text-gray-500">
                    {currentConfig.description}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Settings className="w-4 h-4 mr-2" />
                {showDetails ? (language === 'ar' ? 'إخفاء' : 'Hide') : (language === 'ar' ? 'التفاصيل' : 'Details')}
              </Button>
              
              {isSimulating && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStopSimulation}
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'إيقاف المحاكاة' : 'Stop Simulation'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Switcher */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            {language === 'ar' ? 'محاكي الأدوار' : 'Role Simulator'}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {language === 'ar' 
              ? 'اختبر كيف تبدو لوحة التحكم للأدوار المختلفة'
              : 'Test how the dashboard appears for different user roles'
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(Object.keys(roleConfig) as UserRole[]).map((role) => {
              const config = roleConfig[role];
              const Icon = config.icon;
              const isActive = currentRole === role;
              
              return (
                <Card
                  key={role}
                  className={`cursor-pointer transition-all duration-200 border-2 ${
                    isActive 
                      ? `${config.borderColor} ${config.bgColor} shadow-md` 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => !isActive && handleRoleSimulation(role)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`inline-flex p-3 ${config.color} rounded-full mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="font-semibold mb-1">{config.label}</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      {config.description}
                    </p>
                    
                    {isActive ? (
                      <Badge variant="default" className="w-full justify-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {language === 'ar' ? 'نشط' : 'Active'}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="w-full justify-center hover:bg-gray-50">
                        {language === 'ar' ? 'تجربة' : 'Simulate'}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Permission Details */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              {language === 'ar' ? 'تفاصيل الصلاحيات' : 'Permission Details'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Dashboard Access */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {language === 'ar' ? 'الوصول للوحة التحكم' : 'Dashboard Access'}
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { key: 'overview', label: language === 'ar' ? 'النظرة العامة' : 'Overview' },
                  { key: 'headerControls', label: language === 'ar' ? 'تحكم الرأس' : 'Header Controls' },
                  { key: 'bodyBuilder', label: language === 'ar' ? 'بناء المحتوى' : 'Body Builder' },
                  { key: 'footerDesigner', label: language === 'ar' ? 'تصميم التذييل' : 'Footer Designer' },
                  { key: 'themeManager', label: language === 'ar' ? 'إدارة المظهر' : 'Theme Manager' },
                  { key: 'userManagement', label: language === 'ar' ? 'إدارة المستخدمين' : 'User Management' },
                  { key: 'analytics', label: language === 'ar' ? 'التحليلات' : 'Analytics' },
                  { key: 'settings', label: language === 'ar' ? 'الإعدادات' : 'Settings' },
                ].map(({ key, label }) => {
                  const hasAccess = canAccess(key);
                  return (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      {hasAccess ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={hasAccess ? 'text-gray-900' : 'text-gray-400'}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Permissions */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {language === 'ar' ? 'صلاحيات العمليات' : 'Action Permissions'}
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { key: 'edit', label: language === 'ar' ? 'تحرير' : 'Edit Content' },
                  { key: 'publish', label: language === 'ar' ? 'نشر' : 'Publish' },
                  { key: 'delete', label: language === 'ar' ? 'حذف' : 'Delete' },
                  { key: 'manageUsers', label: language === 'ar' ? 'إدارة المستخدمين' : 'Manage Users' },
                  { key: 'accessThemes', label: language === 'ar' ? 'المظاهر' : 'Access Themes' },
                  { key: 'viewAnalytics', label: language === 'ar' ? 'التحليلات' : 'View Analytics' },
                  { key: 'exportData', label: language === 'ar' ? 'تصدير البيانات' : 'Export Data' },
                  { key: 'accessSettings', label: language === 'ar' ? 'الإعدادات' : 'Access Settings' },
                ].map(({ key, label }) => {
                  const canDo = canPerform(key);
                  return (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      {canDo ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={canDo ? 'text-gray-900' : 'text-gray-400'}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content Limits */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {language === 'ar' ? 'حدود المحتوى' : 'Content Limits'}
              </h4>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {(() => {
                    const limits = getRolePermissions().contentLimits;
                    return [
                      { 
                        label: language === 'ar' ? 'أقسام' : 'Sections', 
                        value: limits.maxSections === -1 ? (language === 'ar' ? 'غير محدود' : 'Unlimited') : limits.maxSections 
                      },
                      { 
                        label: language === 'ar' ? 'صور' : 'Images', 
                        value: limits.maxImages === -1 ? (language === 'ar' ? 'غير محدود' : 'Unlimited') : limits.maxImages 
                      },
                      { 
                        label: language === 'ar' ? 'حجم الملف' : 'File Size', 
                        value: limits.maxFileSize === 0 ? (language === 'ar' ? 'غير مسموح' : 'Not allowed') : `${limits.maxFileSize}MB` 
                      },
                      { 
                        label: language === 'ar' ? 'CSS مخصص' : 'Custom CSS', 
                        value: limits.allowCustomCSS ? (language === 'ar' ? 'مسموح' : 'Allowed') : (language === 'ar' ? 'غير مسموح' : 'Not allowed') 
                      },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-gray-600">{label}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simulation Warning */}
      {isSimulating && (
        <Card className="border-2 border-orange-300 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-semibold text-orange-900">
                  {language === 'ar' ? 'وضع المحاكاة نشط' : 'Simulation Mode Active'}
                </div>
                <div className="text-sm text-orange-700">
                  {language === 'ar' 
                    ? `أنت تشاهد لوحة التحكم بصلاحيات ${roleConfig[currentRole].label}. الدور الأصلي: ${originalRole ? roleConfig[originalRole].label : 'غير معروف'}`
                    : `You're viewing the dashboard with ${roleConfig[currentRole].label} permissions. Original role: ${originalRole ? roleConfig[originalRole].label : 'Unknown'}`
                  }
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleStopSimulation}
                className="ml-auto border-orange-400 text-orange-700 hover:bg-orange-100"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إيقاف' : 'Stop'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoleSimulator;