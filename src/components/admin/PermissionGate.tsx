import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionID, UserRole } from '@/types/permissions';
import { 
  Shield, 
  Lock, 
  Crown, 
  Edit3, 
  Eye, 
  AlertTriangle,
  ArrowUp,
  Zap
} from 'lucide-react';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: PermissionID;
  role?: UserRole;
  feature?: string;
  action?: string;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
  upgradeMessage?: string;
  language?: 'en' | 'ar';
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permission,
  role,
  feature,
  action,
  fallback,
  showUpgrade = true,
  upgradeMessage,
  language = 'en'
}) => {
  const permissions = usePermissions();

  // Check permissions
  let hasAccess = true;
  let upgradeRequired: UserRole | undefined;
  let reasonMessage = '';

  if (permission) {
    hasAccess = permissions.hasPermission(permission);
    if (!hasAccess) {
      reasonMessage = `Missing permission: ${permission}`;
    }
  }

  if (role) {
    const roleCheck = permissions.currentRole === role || 
                    (role === 'editor' && permissions.isAdmin) ||
                    (role === 'viewer' && (permissions.isAdmin || permissions.isEditor));
    hasAccess = hasAccess && roleCheck;
    if (!roleCheck) {
      upgradeRequired = role;
      reasonMessage = `Requires ${role} role or higher`;
    }
  }

  if (feature) {
    const featureAccess = permissions.canAccess(feature);
    hasAccess = hasAccess && featureAccess;
    if (!featureAccess) {
      reasonMessage = `No access to ${feature}`;
      // Determine upgrade path
      if (permissions.isViewer) {
        upgradeRequired = 'editor';
      } else if (permissions.isEditor) {
        upgradeRequired = 'admin';
      }
    }
  }

  if (action) {
    const actionAccess = permissions.canPerform(action);
    hasAccess = hasAccess && actionAccess;
    if (!actionAccess) {
      reasonMessage = `Cannot perform ${action}`;
      if (permissions.isViewer) {
        upgradeRequired = 'editor';
      } else if (permissions.isEditor && ['delete', 'manageUsers', 'accessSettings'].includes(action)) {
        upgradeRequired = 'admin';
      }
    }
  }

  // If access is granted, render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // Custom fallback
  if (fallback && !showUpgrade) {
    return <>{fallback}</>;
  }

  // Default upgrade/permission denied UI
  const getRoleConfig = (roleType: UserRole) => {
    switch (roleType) {
      case 'admin':
        return {
          icon: Crown,
          label: language === 'ar' ? 'مدير' : 'Admin',
          color: 'text-purple-600',
          bg: 'bg-purple-50',
          border: 'border-purple-300'
        };
      case 'editor':
        return {
          icon: Edit3,
          label: language === 'ar' ? 'محرر' : 'Editor',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-300'
        };
      case 'viewer':
        return {
          icon: Eye,
          label: language === 'ar' ? 'مشاهد' : 'Viewer',
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-300'
        };
    }
  };

  const currentRoleConfig = getRoleConfig(permissions.currentRole);
  const CurrentRoleIcon = currentRoleConfig.icon;

  const upgradeRoleConfig = upgradeRequired ? getRoleConfig(upgradeRequired) : null;
  const UpgradeRoleIcon = upgradeRoleConfig?.icon;

  if (showUpgrade) {
    return (
      <Card className={`border-2 border-dashed ${upgradeRoleConfig?.border || 'border-gray-300'} ${upgradeRoleConfig?.bg || 'bg-gray-50'}`}>
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Lock className="w-12 h-12 text-gray-400" />
              {upgradeRoleConfig && (
                <div className={`absolute -top-2 -right-2 p-1 ${upgradeRoleConfig.color.replace('text-', 'bg-').replace('-600', '-500')} rounded-full`}>
                  <UpgradeRoleIcon className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            {language === 'ar' ? 'صلاحية مطلوبة' : 'Permission Required'}
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            {upgradeMessage || (
              language === 'ar' 
                ? `هذه الميزة تتطلب صلاحيات ${upgradeRoleConfig?.label || 'أعلى'}`
                : `This feature requires ${upgradeRoleConfig?.label || 'higher'} permissions`
            )}
          </p>

          {/* Current vs Required Role */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${currentRoleConfig.bg} ${currentRoleConfig.border} border`}>
                <CurrentRoleIcon className={`w-4 h-4 ${currentRoleConfig.color}`} />
                <span className={`text-sm font-medium ${currentRoleConfig.color}`}>
                  {currentRoleConfig.label}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {language === 'ar' ? 'دورك الحالي' : 'Your current role'}
              </div>
            </div>

            <ArrowUp className="w-6 h-6 text-gray-400" />

            {upgradeRoleConfig && (
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${upgradeRoleConfig.bg} ${upgradeRoleConfig.border} border`}>
                  <UpgradeRoleIcon className={`w-4 h-4 ${upgradeRoleConfig.color}`} />
                  <span className={`text-sm font-medium ${upgradeRoleConfig.color}`}>
                    {upgradeRoleConfig.label}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {language === 'ar' ? 'مطلوب' : 'Required'}
                </div>
              </div>
            )}
          </div>

          {/* Simulation Button (only if simulating) */}
          {permissions.isSimulating && upgradeRequired && (
            <Button
              onClick={() => permissions.simulateRole(upgradeRequired)}
              className={`${upgradeRoleConfig?.color.replace('text-', 'bg-').replace('-600', '-500')} hover:${upgradeRoleConfig?.color.replace('text-', 'bg-').replace('-600', '-600')} text-white`}
            >
              <Zap className="w-4 h-4 mr-2" />
              {language === 'ar' ? `محاكاة دور ${upgradeRoleConfig?.label}` : `Simulate ${upgradeRoleConfig?.label} Role`}
            </Button>
          )}

          {/* Help text */}
          {!permissions.isSimulating && (
            <div className="text-xs text-gray-500 mt-3">
              {language === 'ar' 
                ? 'اتصل بالمدير لترقية صلاحياتك'
                : 'Contact an administrator to upgrade your permissions'
              }
            </div>
          )}

          {/* Technical details (for development) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-gray-400 cursor-pointer">
                {language === 'ar' ? 'تفاصيل تقنية' : 'Technical Details'}
              </summary>
              <div className="text-xs text-gray-500 mt-2 bg-gray-100 p-2 rounded">
                <div><strong>Reason:</strong> {reasonMessage}</div>
                {permission && <div><strong>Permission:</strong> {permission}</div>}
                {role && <div><strong>Role Required:</strong> {role}</div>}
                {feature && <div><strong>Feature:</strong> {feature}</div>}
                {action && <div><strong>Action:</strong> {action}</div>}
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    );
  }

  // Simple fallback
  return fallback ? <>{fallback}</> : null;
};

export default PermissionGate;

// Convenience components for common permission patterns
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode; language?: 'en' | 'ar' }> = ({ 
  children, 
  fallback,
  language 
}) => (
  <PermissionGate role="admin" fallback={fallback} language={language}>
    {children}
  </PermissionGate>
);

export const EditorOrHigher: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode; language?: 'en' | 'ar' }> = ({ 
  children, 
  fallback,
  language 
}) => {
  const permissions = usePermissions();
  const hasAccess = permissions.isAdmin || permissions.isEditor;
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  return (
    <PermissionGate role="editor" fallback={fallback} language={language}>
      {children}
    </PermissionGate>
  );
};

export const ViewerOrHigher: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode; language?: 'en' | 'ar' }> = ({ 
  children, 
  fallback,
  language 
}) => (
  <PermissionGate role="viewer" fallback={fallback} language={language}>
    {children}
  </PermissionGate>
);

// Feature-specific gates
export const ThemeManagerGate: React.FC<{ children: React.ReactNode; language?: 'en' | 'ar' }> = ({ children, language }) => (
  <PermissionGate 
    feature="themeManager" 
    upgradeMessage={
      language === 'ar' 
        ? 'مدير المظهر متاح للمحررين والمديرين فقط'
        : 'Theme Manager is available to Editors and Admins only'
    }
    language={language}
  >
    {children}
  </PermissionGate>
);

export const UserManagementGate: React.FC<{ children: React.ReactNode; language?: 'en' | 'ar' }> = ({ children, language }) => (
  <PermissionGate 
    feature="userManagement" 
    upgradeMessage={
      language === 'ar' 
        ? 'إدارة المستخدمين متاحة للمديرين فقط'
        : 'User Management is available to Admins only'
    }
    language={language}
  >
    {children}
  </PermissionGate>
);

export const EditingGate: React.FC<{ children: React.ReactNode; language?: 'en' | 'ar' }> = ({ children, language }) => (
  <PermissionGate 
    action="edit" 
    upgradeMessage={
      language === 'ar' 
        ? 'تحرير المحتوى متاح للمحررين والمديرين فقط'
        : 'Content editing is available to Editors and Admins only'
    }
    language={language}
  >
    {children}
  </PermissionGate>
);