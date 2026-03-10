/**
 * Version History Panel Component
 * Interactive timeline UI for managing panel version history with undo/rollback functionality
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  RotateCcw, 
  Undo, 
  Redo, 
  Save, 
  Search, 
  Filter,
  Tag,
  User,
  GitBranch,
  Eye,
  Download,
  Upload,
  Trash2,
  Compare,
  FileText,
  Calendar,
  Activity,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  RefreshCw
} from 'lucide-react';
import { 
  PanelType, 
  VersionEntry, 
  VersionHistory, 
  VersionDiff, 
  ActionType,
  VersioningHookReturn 
} from '@/types/versioning';
import { formatDistanceToNow, format } from 'date-fns';

interface VersionHistoryPanelProps {
  panelType: PanelType;
  versioningHook: VersioningHookReturn;
  language?: 'en' | 'ar';
  onPreviewVersion?: (versionId: string) => void;
  onCompareVersions?: (versionId1: string, versionId2: string) => void;
  className?: string;
}

const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({
  panelType,
  versioningHook,
  language = 'en',
  onPreviewVersion,
  onCompareVersions,
  className = ''
}) => {
  const {
    versionHistory,
    isLoading,
    error,
    canUndo,
    canRedo,
    undo,
    redo,
    rollbackToVersion,
    saveVersion,
    currentState,
    isAutoSaveEnabled,
    enableAutoSave,
    disableAutoSave,
    compareWithCurrent
  } = versioningHook;

  // Local state for UI interactions
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [filterAction, setFilterAction] = useState<ActionType | 'all'>('all');
  const [showTags, setShowTags] = useState(false);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());

  // Memoized filtered and sorted versions
  const filteredVersions = useMemo(() => {
    if (!versionHistory?.versions) return [];

    let filtered = versionHistory.versions;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(version => 
        version.metadata.description.toLowerCase().includes(query) ||
        version.metadata.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        version.metadata.userName?.toLowerCase().includes(query)
      );
    }

    // Apply action filter
    if (filterAction !== 'all') {
      filtered = filtered.filter(version => version.metadata.action === filterAction);
    }

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => b.metadata.timestamp - a.metadata.timestamp);
  }, [versionHistory?.versions, searchQuery, filterAction]);

  // Action type configurations
  const actionConfig = {
    create: { icon: PlayCircle, color: 'bg-green-500', textColor: 'text-green-700', label: 'Created' },
    update: { icon: RefreshCw, color: 'bg-blue-500', textColor: 'text-blue-700', label: 'Updated' },
    delete: { icon: Trash2, color: 'bg-red-500', textColor: 'text-red-700', label: 'Deleted' },
    style_change: { icon: Eye, color: 'bg-purple-500', textColor: 'text-purple-700', label: 'Styled' },
    content_change: { icon: FileText, color: 'bg-orange-500', textColor: 'text-orange-700', label: 'Content' },
    layout_change: { icon: GitBranch, color: 'bg-indigo-500', textColor: 'text-indigo-700', label: 'Layout' },
    theme_change: { icon: Eye, color: 'bg-pink-500', textColor: 'text-pink-700', label: 'Theme' },
    rollback: { icon: RotateCcw, color: 'bg-yellow-500', textColor: 'text-yellow-700', label: 'Rollback' },
    restore: { icon: CheckCircle, color: 'bg-emerald-500', textColor: 'text-emerald-700', label: 'Restored' }
  };

  // Handle version selection for comparison
  const handleVersionSelect = (versionId: string) => {
    if (!isComparisonMode) return;

    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      } else if (prev.length < 2) {
        return [...prev, versionId];
      } else {
        return [prev[1], versionId]; // Replace first selection
      }
    });
  };

  // Toggle version expansion
  const toggleVersionExpansion = (versionId: string) => {
    setExpandedVersions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(versionId)) {
        newSet.delete(versionId);
      } else {
        newSet.add(versionId);
      }
      return newSet;
    });
  };

  // Handle save current state
  const handleSaveCurrentState = async () => {
    try {
      await saveVersion(
        currentState,
        'Manual save',
        ['manual-save', new Date().toISOString().split('T')[0]]
      );
    } catch (error) {
      console.error('Failed to save version:', error);
    }
  };

  // Render version entry
  const renderVersionEntry = (version: VersionEntry, index: number) => {
    const isCurrentVersion = versionHistory?.currentVersionId === version.metadata.id;
    const isSelected = selectedVersions.includes(version.metadata.id);
    const isExpanded = expandedVersions.has(version.metadata.id);
    const config = actionConfig[version.metadata.action] || actionConfig.update;
    const Icon = config.icon;

    return (
      <div
        key={version.metadata.id}
        className={`relative p-4 rounded-lg border transition-all duration-200 ${
          isCurrentVersion 
            ? 'border-blue-500 bg-blue-50' 
            : isSelected
            ? 'border-green-500 bg-green-50'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        } ${isComparisonMode ? 'cursor-pointer' : ''}`}
        onClick={() => isComparisonMode && handleVersionSelect(version.metadata.id)}
      >
        {/* Timeline connector */}
        {index < filteredVersions.length - 1 && (
          <div className="absolute left-8 top-12 w-0.5 h-8 bg-gray-300" />
        )}

        <div className="flex items-start gap-3">
          {/* Action icon */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full ${config.color} flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Version header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900 truncate">
                  {version.metadata.description}
                </h4>
                {isCurrentVersion && (
                  <Badge variant="default" className="text-xs bg-blue-500">
                    Current
                  </Badge>
                )}
                {version.metadata.isAutoSave && (
                  <Badge variant="secondary" className="text-xs">
                    Auto
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVersionExpansion(version.metadata.id);
                  }}
                >
                  <Eye className="w-3 h-3" />
                </Button>
                
                {!isCurrentVersion && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      rollbackToVersion(version.metadata.id);
                    }}
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Version metadata */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(version.metadata.timestamp, { addSuffix: true })}
              </span>
              
              {version.metadata.userName && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {version.metadata.userName}
                </span>
              )}
              
              <span className={`flex items-center gap-1 ${config.textColor}`}>
                <Activity className="w-3 h-3" />
                {config.label}
              </span>
            </div>

            {/* Tags */}
            {version.metadata.tags && version.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {version.metadata.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline" className="text-xs">
                    <Tag className="w-2 h-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Expanded details */}
            {isExpanded && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">Version ID:</span>
                    <div className="font-mono text-gray-600">
                      {version.metadata.id.slice(-8)}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Timestamp:</span>
                    <div className="text-gray-600">
                      {format(version.metadata.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                    </div>
                  </div>
                </div>
                
                {version.metadata.parentVersionId && (
                  <div className="mt-2">
                    <span className="font-medium">Parent:</span>
                    <div className="font-mono text-gray-600">
                      {version.metadata.parentVersionId.slice(-8)}
                    </div>
                  </div>
                )}

                {/* Preview button */}
                <div className="mt-3 flex gap-2">
                  {onPreviewVersion && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPreviewVersion(version.metadata.id)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const diff = compareWithCurrent(version.metadata.id);
                      console.log('Version diff:', diff);
                    }}
                  >
                    <Compare className="w-3 h-3 mr-1" />
                    Compare
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-48">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading version history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-48">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>Error: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {language === 'ar' ? 'تاريخ الإصدارات' : 'Version History'}
              <Badge variant="secondary" className="text-xs">
                {panelType}
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {language === 'ar' 
                ? 'إدارة وتتبع إصدارات اللوحة'
                : 'Manage and track panel versions'
              }
            </p>
          </div>

          {/* Auto-save toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={isAutoSaveEnabled ? "default" : "outline"}
              size="sm"
              onClick={isAutoSaveEnabled ? disableAutoSave : enableAutoSave}
            >
              {isAutoSaveEnabled ? (
                <PauseCircle className="w-4 h-4 mr-1" />
              ) : (
                <PlayCircle className="w-4 h-4 mr-1" />
              )}
              {language === 'ar' 
                ? (isAutoSaveEnabled ? 'إيقاف الحفظ التلقائي' : 'تفعيل الحفظ التلقائي')
                : (isAutoSaveEnabled ? 'Auto-save ON' : 'Auto-save OFF')
              }
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
          >
            <Undo className="w-4 h-4 mr-1" />
            {language === 'ar' ? 'تراجع' : 'Undo'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
          >
            <Redo className="w-4 h-4 mr-1" />
            {language === 'ar' ? 'إعادة' : 'Redo'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveCurrentState}
          >
            <Save className="w-4 h-4 mr-1" />
            {language === 'ar' ? 'حفظ الحالة الحالية' : 'Save Current'}
          </Button>

          <Button
            variant={isComparisonMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setIsComparisonMode(!isComparisonMode);
              setSelectedVersions([]);
            }}
          >
            <Compare className="w-4 h-4 mr-1" />
            {language === 'ar' ? 'مقارنة' : 'Compare'}
          </Button>
        </div>

        {/* Search and filters */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={language === 'ar' ? 'البحث في الإصدارات...' : 'Search versions...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value as ActionType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">{language === 'ar' ? 'جميع الإجراءات' : 'All Actions'}</option>
              <option value="create">{language === 'ar' ? 'إنشاء' : 'Create'}</option>
              <option value="update">{language === 'ar' ? 'تحديث' : 'Update'}</option>
              <option value="style_change">{language === 'ar' ? 'تغيير النمط' : 'Style Change'}</option>
              <option value="content_change">{language === 'ar' ? 'تغيير المحتوى' : 'Content Change'}</option>
              <option value="rollback">{language === 'ar' ? 'تراجع' : 'Rollback'}</option>
            </select>
          </div>

          {/* Comparison mode info */}
          {isComparisonMode && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {language === 'ar' 
                  ? `اختر إصدارين للمقارنة. المحدد: ${selectedVersions.length}/2`
                  : `Select two versions to compare. Selected: ${selectedVersions.length}/2`
                }
              </p>
              {selectedVersions.length === 2 && onCompareVersions && (
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => onCompareVersions(selectedVersions[0], selectedVersions[1])}
                >
                  <Compare className="w-4 h-4 mr-1" />
                  {language === 'ar' ? 'مقارنة الإصدارات' : 'Compare Versions'}
                </Button>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Version timeline */}
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {filteredVersions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>
                  {language === 'ar' 
                    ? 'لا توجد إصدارات متاحة'
                    : 'No versions available'
                  }
                </p>
              </div>
            ) : (
              filteredVersions.map((version, index) => renderVersionEntry(version, index))
            )}
          </div>
        </ScrollArea>

        {/* Statistics */}
        {versionHistory && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {versionHistory.versions.length}
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'ar' ? 'إجمالي الإصدارات' : 'Total Versions'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {versionHistory.versions.filter(v => !v.metadata.isAutoSave).length}
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'ar' ? 'حفظ يدوي' : 'Manual Saves'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {versionHistory.versions.filter(v => v.metadata.action === 'rollback').length}
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'ar' ? 'تراجعات' : 'Rollbacks'}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VersionHistoryPanel;