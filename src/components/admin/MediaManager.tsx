/**
 * Media Manager Component
 * Comprehensive file management with drag-and-drop, usage tracking, and Frankincense branding
 */

import React, { useState, useCallback, useRef } from 'react';
import { useMediaManager } from '@/hooks/useMediaManager';
import { MediaFile, MediaFolder, DragDropState } from '@/types/media';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Folder,
  FolderPlus,
  MoreVertical,
  Edit3,
  Trash2,
  Copy,
  Download,
  Eye,
  Grid3X3,
  List,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  Clock,
  MapPin,
  Tag,
  Star,
  RefreshCw,
  Plus,
  ChevronLeft,
  Home
} from 'lucide-react';

interface MediaManagerProps {
  onSelectFile?: (file: MediaFile) => void;
  onSelectMultiple?: (files: MediaFile[]) => void;
  allowMultiple?: boolean;
  acceptedTypes?: string[];
  maxFileSize?: number;
  language?: 'en' | 'ar';
  className?: string;
}

const MediaManager: React.FC<MediaManagerProps> = ({
  onSelectFile,
  onSelectMultiple,
  allowMultiple = false,
  acceptedTypes = ['image/*', 'video/*', 'audio/*'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  language = 'en',
  className = ''
}) => {
  const mediaManager = useMediaManager();
  const {
    files,
    folders,
    usage,
    selectedFiles,
    currentFolder,
    viewMode,
    sortBy,
    sortOrder,
    searchQuery,
    filterType,
    uploads,
    isLoading,
    error,
    uploadFile,
    deleteFile,
    updateFile,
    renameFile,
    replaceFile,
    createFolder,
    deleteFolder,
    selectFile,
    selectMultipleFiles,
    toggleFileSelection,
    setViewMode,
    setSorting,
    setSearchQuery,
    setFilterType,
    setCurrentFolder,
    trackFileUsage,
    untrackFileUsage,
    getFileUsage
  } = mediaManager;

  // Component state
  const [dragState, setDragState] = useState<DragDropState>({
    isDragActive: false,
    isDragAccept: false,
    isDragReject: false
  });
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState<{ fileId: string; currentName: string } | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [showFileDetailsDialog, setShowFileDetailsDialog] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameValue, setRenameValue] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File type icons
  const getFileIcon = (file: MediaFile) => {
    switch (file.type) {
      case 'image':
        return <ImageIcon className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Music className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle drag and drop
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const items = Array.from(e.dataTransfer.items);
    const hasFiles = items.some(item => item.kind === 'file');
    const validTypes = items.every(item => 
      item.kind !== 'file' || acceptedTypes.some(type => 
        type === '*/*' || item.type.match(type.replace('*', '.*'))
      )
    );

    setDragState({
      isDragActive: hasFiles,
      isDragAccept: hasFiles && validTypes,
      isDragReject: hasFiles && !validTypes
    });
  }, [acceptedTypes]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragState({
        isDragActive: false,
        isDragAccept: false,
        isDragReject: false
      });
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragState({
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false
    });

    const droppedFiles = Array.from(e.dataTransfer.files);
    await handleFileUpload(droppedFiles);
  }, [currentFolder]);

  // Handle file upload
  const handleFileUpload = useCallback(async (fileList: File[]) => {
    for (const file of fileList) {
      // Validate file size
      if (file.size > maxFileSize) {
        console.error(`File ${file.name} is too large. Max size: ${formatFileSize(maxFileSize)}`);
        continue;
      }

      // Validate file type
      const isValidType = acceptedTypes.some(type => 
        type === '*/*' || file.type.match(type.replace('*', '.*'))
      );
      
      if (!isValidType) {
        console.error(`File ${file.name} is not an accepted type`);
        continue;
      }

      try {
        const mediaFile = await uploadFile(file, currentFolder);
        
        // Auto-select uploaded file for single selection mode
        if (!allowMultiple && onSelectFile) {
          onSelectFile(mediaFile);
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }
  }, [uploadFile, currentFolder, maxFileSize, acceptedTypes, allowMultiple, onSelectFile]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      handleFileUpload(Array.from(fileList));
    }
    // Reset input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileUpload]);

  // File operations
  const handleFileClick = useCallback((file: MediaFile) => {
    if (allowMultiple) {
      toggleFileSelection(file.id);
    } else {
      selectFile(file.id);
      if (onSelectFile) {
        onSelectFile(file);
      }
    }
  }, [allowMultiple, toggleFileSelection, selectFile, onSelectFile]);

  const handleRenameFile = useCallback(async () => {
    if (showRenameDialog) {
      await renameFile(showRenameDialog.fileId, renameValue);
      setShowRenameDialog(null);
      setRenameValue('');
    }
  }, [showRenameDialog, renameValue, renameFile]);

  const handleDeleteFile = useCallback(async () => {
    if (showDeleteDialog) {
      deleteFile(showDeleteDialog);
      setShowDeleteDialog(null);
    }
  }, [showDeleteDialog, deleteFile]);

  const handleReplaceFile = useCallback(async (fileId: string, newFile: File) => {
    try {
      await replaceFile(fileId, newFile);
    } catch (error) {
      console.error('Failed to replace file:', error);
    }
  }, [replaceFile]);

  const handleCreateFolder = useCallback(async () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim(), currentFolder);
      setNewFolderName('');
      setShowCreateFolderDialog(false);
    }
  }, [newFolderName, createFolder, currentFolder]);

  // Filter and sort files
  const filteredAndSortedFiles = React.useMemo(() => {
    let filtered = files.filter(file => {
      // Folder filter
      if (file.folder !== currentFolder) return false;
      
      // Type filter
      if (filterType !== 'all' && file.type !== filterType) return false;
      
      // Search filter
      if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      return true;
    });

    // Sort files
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = a.uploadedAt - b.uploadedAt;
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [files, currentFolder, filterType, searchQuery, sortBy, sortOrder]);

  // Get current folder path
  const getCurrentFolderPath = useCallback(() => {
    const path: MediaFolder[] = [];
    let folderId = currentFolder;
    
    while (folderId) {
      const folder = folders.find(f => f.id === folderId);
      if (folder) {
        path.unshift(folder);
        folderId = folder.parentId;
      } else {
        break;
      }
    }
    
    return path;
  }, [currentFolder, folders]);

  const currentFolderPath = getCurrentFolderPath();
  const currentFolderObject = folders.find(f => f.id === currentFolder);
  const subFolders = folders.filter(f => f.parentId === currentFolder);

  // Get file usage info
  const getFileUsageInfo = useCallback((fileId: string) => {
    const fileUsage = getFileUsage(fileId);
    const locations = fileUsage.map(u => `${u.location.section}/${u.location.component}`);
    return {
      count: fileUsage.length,
      locations: [...new Set(locations)]
    };
  }, [getFileUsage]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {language === 'ar' ? 'مدير الوسائط' : 'Media Manager'}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  {language === 'ar' 
                    ? 'إدارة ملفات THE FRANKINCENSE'
                    : 'Manage THE FRANKINCENSE media files'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Upload button */}
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'رفع ملفات' : 'Upload Files'}
              </Button>

              {/* Create folder button */}
              <Button 
                variant="outline" 
                onClick={() => setShowCreateFolderDialog(true)}
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'مجلد جديد' : 'New Folder'}
              </Button>

              {/* View mode toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={language === 'ar' ? 'البحث في الملفات...' : 'Search files...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200"
              />
            </div>

            {/* Type filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm min-w-[120px]"
            >
              <option value="all">{language === 'ar' ? 'جميع الملفات' : 'All Files'}</option>
              <option value="image">{language === 'ar' ? 'صور' : 'Images'}</option>
              <option value="video">{language === 'ar' ? 'فيديو' : 'Videos'}</option>
              <option value="audio">{language === 'ar' ? 'صوت' : 'Audio'}</option>
              <option value="document">{language === 'ar' ? 'مستندات' : 'Documents'}</option>
            </select>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'ترتيب' : 'Sort'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSorting('name', sortOrder)}>
                  {language === 'ar' ? 'الاسم' : 'Name'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSorting('date', sortOrder)}>
                  {language === 'ar' ? 'التاريخ' : 'Date'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSorting('size', sortOrder)}>
                  {language === 'ar' ? 'الحجم' : 'Size'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSorting('type', sortOrder)}>
                  {language === 'ar' ? 'النوع' : 'Type'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSorting(sortBy, 'asc')}>
                  <ArrowUp className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تصاعدي' : 'Ascending'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSorting(sortBy, 'desc')}>
                  <ArrowDown className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تنازلي' : 'Descending'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          {/* Breadcrumb navigation */}
          {currentFolder && (
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentFolder(undefined)}
                className="px-2"
              >
                <Home className="w-4 h-4" />
              </Button>
              {currentFolderPath.map((folder, index) => (
                <React.Fragment key={folder.id}>
                  <ChevronLeft className="w-3 h-3 text-gray-400" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentFolder(folder.id)}
                    className="px-2 text-gray-600 hover:text-gray-900"
                  >
                    {folder.name}
                  </Button>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Upload progress */}
          {uploads.length > 0 && (
            <div className="mb-4 space-y-2">
              {uploads.map((upload) => (
                <div key={upload.fileId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{upload.fileName}</span>
                      <span className="text-gray-500">{upload.progress}%</span>
                    </div>
                    <Progress 
                      value={upload.progress} 
                      className={`h-2 ${
                        upload.status === 'error' ? '[&>div]:bg-red-500' :
                        upload.status === 'completed' ? '[&>div]:bg-green-500' :
                        '[&>div]:bg-amber-500'
                      }`}
                    />
                    {upload.error && (
                      <p className="text-xs text-red-600 mt-1">{upload.error}</p>
                    )}
                  </div>
                  {upload.status === 'completed' && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Drag and drop area */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragState.isDragActive
                ? dragState.isDragAccept
                  ? 'border-green-400 bg-green-50'
                  : 'border-red-400 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
              }
              ${filteredAndSortedFiles.length === 0 && subFolders.length === 0 ? 'mb-0' : 'mb-6'}
            `}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center
                ${dragState.isDragActive
                  ? dragState.isDragAccept
                    ? 'bg-green-100'
                    : 'bg-red-100'
                  : 'bg-gradient-to-br from-amber-100 to-orange-200'
                }
              `}>
                <Upload className={`
                  w-8 h-8
                  ${dragState.isDragActive
                    ? dragState.isDragAccept
                      ? 'text-green-600'
                      : 'text-red-600'
                    : 'text-amber-600'
                  }
                `} />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900 mb-1">
                  {dragState.isDragActive
                    ? dragState.isDragAccept
                      ? (language === 'ar' ? 'اتركها هنا...' : 'Drop files here...')
                      : (language === 'ar' ? 'نوع ملف غير مدعوم' : 'File type not supported')
                    : (language === 'ar' ? 'اسحب وأفلت الملفات هنا' : 'Drag & drop files here')
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'ar' 
                    ? `أو انقر لتحديد الملفات (حد أقصى ${formatFileSize(maxFileSize)})`
                    : `or click to select files (max ${formatFileSize(maxFileSize)})`
                  }
                </p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'اختر الملفات' : 'Choose Files'}
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple={allowMultiple}
              accept={acceptedTypes.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Folders and files grid/list */}
          {(subFolders.length > 0 || filteredAndSortedFiles.length > 0) && (
            <ScrollArea className="h-96">
              <div className={`
                ${viewMode === 'grid' 
                  ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4' 
                  : 'space-y-2'
                }
              `}>
                {/* Folders */}
                {subFolders.map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => setCurrentFolder(folder.id)}
                    className={`
                      group cursor-pointer rounded-lg border border-gray-200 hover:border-amber-300 
                      hover:shadow-md transition-all duration-200 bg-white
                      ${viewMode === 'grid' ? 'p-4 text-center' : 'p-3 flex items-center gap-3'}
                    `}
                  >
                    <div className={`
                      ${viewMode === 'grid' 
                        ? 'w-12 h-12 mx-auto mb-2' 
                        : 'w-8 h-8 flex-shrink-0'
                      } 
                      rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 
                      flex items-center justify-center
                    `}>
                      <Folder className="w-6 h-6 text-amber-700" />
                    </div>
                    
                    <div className={viewMode === 'grid' ? 'text-center' : 'flex-1 min-w-0'}>
                      <p className="font-medium text-gray-900 truncate">{folder.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(folder.createdAt)}
                      </p>
                    </div>

                    {viewMode === 'list' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle rename folder
                            }}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'إعادة تسمية' : 'Rename'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFolder(folder.id);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'حذف' : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}

                {/* Files */}
                {filteredAndSortedFiles.map((file) => {
                  const isSelected = selectedFiles.includes(file.id);
                  const usageInfo = getFileUsageInfo(file.id);
                  
                  return (
                    <div
                      key={file.id}
                      onClick={() => handleFileClick(file)}
                      className={`
                        group cursor-pointer rounded-lg border transition-all duration-200 bg-white
                        ${isSelected 
                          ? 'border-amber-400 shadow-md bg-amber-50' 
                          : 'border-gray-200 hover:border-amber-300 hover:shadow-md'
                        }
                        ${viewMode === 'grid' ? 'p-4 text-center' : 'p-3 flex items-center gap-3'}
                      `}
                    >
                      {/* File thumbnail/icon */}
                      <div className={`
                        ${viewMode === 'grid' 
                          ? 'w-20 h-20 mx-auto mb-3' 
                          : 'w-12 h-12 flex-shrink-0'
                        } 
                        rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center
                      `}>
                        {file.type === 'image' && file.thumbnailUrl ? (
                          <img 
                            src={file.thumbnailUrl} 
                            alt={file.alt || file.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="text-gray-400">
                            {getFileIcon(file)}
                          </div>
                        )}
                      </div>

                      {/* File info */}
                      <div className={`
                        ${viewMode === 'grid' ? 'text-center' : 'flex-1 min-w-0'}
                      `}>
                        <p className={`
                          font-medium text-gray-900 
                          ${viewMode === 'grid' ? 'text-sm mb-1' : 'text-base truncate mb-1'}
                        `}>
                          {file.name}
                        </p>
                        
                        <div className={`
                          text-xs text-gray-500 
                          ${viewMode === 'grid' ? 'space-y-1' : 'flex items-center gap-2'}
                        `}>
                          <span>{formatFileSize(file.size)}</span>
                          {viewMode === 'list' && (
                            <>
                              <span>•</span>
                              <span>{formatDate(file.uploadedAt)}</span>
                              {usageInfo.count > 0 && (
                                <>
                                  <span>•</span>
                                  <Badge variant="secondary" className="text-xs px-1 py-0">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {usageInfo.count}
                                  </Badge>
                                </>
                              )}
                            </>
                          )}
                        </div>

                        {viewMode === 'grid' && (
                          <div className="mt-2 flex flex-wrap gap-1 justify-center">
                            <Badge variant="outline" className="text-xs">
                              {file.type}
                            </Badge>
                            {usageInfo.count > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                <MapPin className="w-2 h-2 mr-1" />
                                {usageInfo.count}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* File actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`
                              ${viewMode === 'grid' 
                                ? 'absolute top-2 right-2 opacity-0 group-hover:opacity-100' 
                                : 'opacity-0 group-hover:opacity-100'
                              } transition-opacity
                            `}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowFileDetailsDialog(file.id);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowRenameDialog({ fileId: file.id, currentName: file.name });
                              setRenameValue(file.name);
                            }}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'إعادة تسمية' : 'Rename'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(file.url);
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'نسخ الرابط' : 'Copy URL'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              const a = document.createElement('a');
                              a.href = file.url;
                              a.download = file.name;
                              a.click();
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'تحميل' : 'Download'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteDialog(file.id);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'حذف' : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {/* Empty state */}
          {filteredAndSortedFiles.length === 0 && subFolders.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد ملفات' : 'No files yet'}
              </p>
              <p className="text-gray-500">
                {language === 'ar' 
                  ? 'ابدأ برفع ملفات THE FRANKINCENSE'
                  : 'Start by uploading your first THE FRANKINCENSE files'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'إنشاء مجلد جديد' : 'Create New Folder'}
            </DialogTitle>
            <DialogDescription>
              {language === 'ar' 
                ? 'أدخل اسم المجلد الجديد'
                : 'Enter the name for the new folder'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="folderName">
                {language === 'ar' ? 'اسم المجلد' : 'Folder Name'}
              </Label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: صور المنتجات' : 'e.g. Product Images'}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateFolderDialog(false)}>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              {language === 'ar' ? 'إنشاء' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename File Dialog */}
      <Dialog open={!!showRenameDialog} onOpenChange={() => setShowRenameDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'إعادة تسمية الملف' : 'Rename File'}
            </DialogTitle>
            <DialogDescription>
              {language === 'ar' 
                ? 'أدخل الاسم الجديد للملف'
                : 'Enter the new name for this file'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="fileName">
                {language === 'ar' ? 'اسم الملف' : 'File Name'}
              </Label>
              <Input
                id="fileName"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(null)}>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleRenameFile}
              disabled={!renameValue.trim() || renameValue === showRenameDialog?.currentName}
            >
              {language === 'ar' ? 'حفظ' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete File Dialog */}
      <AlertDialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'ar' ? 'حذف الملف' : 'Delete File'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'ar' 
                ? 'هل أنت متأكد من حذف هذا الملف؟ لا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to delete this file? This action cannot be undone.'
              }
              {showDeleteDialog && (() => {
                const usageInfo = getFileUsageInfo(showDeleteDialog);
                if (usageInfo.count > 0) {
                  return (
                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-sm text-amber-800 font-medium">
                        {language === 'ar' 
                          ? `⚠️ هذا الملف مستخدم في ${usageInfo.count} موقع`
                          : `⚠️ This file is used in ${usageInfo.count} location(s)`
                        }
                      </p>
                      <ul className="mt-1 text-xs text-amber-700">
                        {usageInfo.locations.map((location, index) => (
                          <li key={index}>• {location}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return null;
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteFile}
              className="bg-red-600 hover:bg-red-700"
            >
              {language === 'ar' ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* File Details Dialog */}
      {showFileDetailsDialog && (() => {
        const file = files.find(f => f.id === showFileDetailsDialog);
        if (!file) return null;

        const usageInfo = getFileUsageInfo(file.id);

        return (
          <Dialog open={true} onOpenChange={() => setShowFileDetailsDialog(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {getFileIcon(file)}
                  {file.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* File preview */}
                {file.type === 'image' && file.url && (
                  <div className="text-center">
                    <img 
                      src={file.url} 
                      alt={file.alt || file.name}
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
                    />
                  </div>
                )}

                {/* File information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="font-medium text-gray-900">
                      {language === 'ar' ? 'اسم الملف' : 'File Name'}
                    </Label>
                    <p className="mt-1 text-gray-600">{file.name}</p>
                  </div>
                  
                  <div>
                    <Label className="font-medium text-gray-900">
                      {language === 'ar' ? 'نوع الملف' : 'File Type'}
                    </Label>
                    <p className="mt-1 text-gray-600">{file.mimeType}</p>
                  </div>
                  
                  <div>
                    <Label className="font-medium text-gray-900">
                      {language === 'ar' ? 'حجم الملف' : 'File Size'}
                    </Label>
                    <p className="mt-1 text-gray-600">{formatFileSize(file.size)}</p>
                  </div>
                  
                  <div>
                    <Label className="font-medium text-gray-900">
                      {language === 'ar' ? 'تاريخ الرفع' : 'Upload Date'}
                    </Label>
                    <p className="mt-1 text-gray-600">{formatDate(file.uploadedAt)}</p>
                  </div>

                  {file.dimensions && (
                    <div>
                      <Label className="font-medium text-gray-900">
                        {language === 'ar' ? 'الأبعاد' : 'Dimensions'}
                      </Label>
                      <p className="mt-1 text-gray-600">
                        {file.dimensions.width} × {file.dimensions.height}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <Label className="font-medium text-gray-900">
                      {language === 'ar' ? 'المواقع المستخدمة' : 'Used In'}
                    </Label>
                    {usageInfo.count > 0 ? (
                      <div className="mt-1 space-y-1">
                        {usageInfo.locations.map((location, index) => (
                          <Badge key={index} variant="secondary" className="text-xs mr-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {location}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-gray-500 text-sm">
                        {language === 'ar' ? 'غير مستخدم' : 'Not used anywhere'}
                      </p>
                    )}
                  </div>
                </div>

                {/* File URL */}
                <div>
                  <Label className="font-medium text-gray-900">
                    {language === 'ar' ? 'رابط الملف' : 'File URL'}
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input 
                      value={file.url} 
                      readOnly 
                      className="font-mono text-xs"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(file.url)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowFileDetailsDialog(null)}>
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })()}

      {/* Selected files action bar */}
      {allowMultiple && selectedFiles.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {language === 'ar' 
                ? `تم تحديد ${selectedFiles.length} ملف`
                : `${selectedFiles.length} file(s) selected`
              }
            </span>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm"
                onClick={() => {
                  const selected = files.filter(f => selectedFiles.includes(f.id));
                  if (onSelectMultiple) {
                    onSelectMultiple(selected);
                  }
                }}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                <Check className="w-4 h-4 mr-1" />
                {language === 'ar' ? 'استخدام المحدد' : 'Use Selected'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => selectMultipleFiles([])}
              >
                <X className="w-4 h-4 mr-1" />
                {language === 'ar' ? 'إلغاء التحديد' : 'Clear Selection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManager;