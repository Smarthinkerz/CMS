import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  File,
  Trash2,
  Eye,
  Download,
  Search,
  Filter,
  Grid,
  List,
  FolderPlus,
  Edit2,
  Copy,
  Share2,
  MoreHorizontal,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useUniversalCMS } from '@/contexts/UniversalCMSContext';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  size: number;
  url: string;
  thumbnail?: string;
  uploadedAt: Date;
  alt?: string;
  caption?: string;
  tags: string[];
  folder?: string;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  id: string;
}

const UniversalMediaLibrary: React.FC = () => {
  const { trackEvent } = useUniversalCMS();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'hero-banner.jpg',
      type: 'image',
      size: 245760,
      url: '/placeholder-image.jpg',
      thumbnail: '/placeholder-image.jpg',
      uploadedAt: new Date('2024-01-15'),
      alt: 'Hero banner image',
      caption: 'Main website hero banner',
      tags: ['banner', 'hero', 'homepage'],
      folder: 'banners'
    },
    {
      id: '2',
      name: 'product-demo.mp4',
      type: 'video',
      size: 1048576,
      url: '/placeholder-video.mp4',
      uploadedAt: new Date('2024-01-14'),
      alt: 'Product demonstration video',
      tags: ['product', 'demo', 'video'],
      folder: 'videos'
    },
    {
      id: '3',
      name: 'company-brochure.pdf',
      type: 'document',
      size: 512000,
      url: '/placeholder-document.pdf',
      uploadedAt: new Date('2024-01-13'),
      tags: ['brochure', 'company', 'marketing'],
      folder: 'documents'
    }
  ]);
  
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get unique folders
  const folders = ['all', ...new Set(mediaFiles.map(f => f.folder).filter(Boolean))];

  // Filter files based on search and folder
  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  // File type icons
  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Drag and drop setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      handleFileUpload(acceptedFiles);
    },
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.flac'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md', '.csv'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.ms-excel': ['.xls', '.xlsx']
    },
    maxSize: 50 * 1024 * 1024, // 50MB limit
    multiple: true
  });

  const handleFileUpload = async (files: File[]) => {
    const newUploadProgress: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
      id: Math.random().toString(36).substring(7)
    }));

    setUploadProgress(prev => [...prev, ...newUploadProgress]);
    setShowUploadModal(true);

    // Simulate upload process
    for (const uploadItem of newUploadProgress) {
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev =>
            prev.map(item =>
              item.id === uploadItem.id ? { ...item, progress } : item
            )
          );
        }

        // Create media file object
        const newMediaFile: MediaFile = {
          id: Math.random().toString(36).substring(7),
          name: uploadItem.file.name,
          type: getFileType(uploadItem.file.type),
          size: uploadItem.file.size,
          url: URL.createObjectURL(uploadItem.file),
          thumbnail: uploadItem.file.type.startsWith('image/') ? URL.createObjectURL(uploadItem.file) : undefined,
          uploadedAt: new Date(),
          tags: [],
          folder: 'uploads'
        };

        setMediaFiles(prev => [...prev, newMediaFile]);
        
        setUploadProgress(prev =>
          prev.map(item =>
            item.id === uploadItem.id ? { ...item, status: 'completed' as const } : item
          )
        );

        trackEvent('media_uploaded', { fileName: newMediaFile.name, type: newMediaFile.type });
      } catch (error) {
        setUploadProgress(prev =>
          prev.map(item =>
            item.id === uploadItem.id ? { ...item, status: 'error' as const } : item
          )
        );
      }
    }

    // Clear completed uploads after delay
    setTimeout(() => {
      setUploadProgress([]);
      setShowUploadModal(false);
    }, 2000);
  };

  const getFileType = (mimeType: string): MediaFile['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document';
    return 'other';
  };

  const handleDeleteFiles = () => {
    if (selectedFiles.length === 0) return;
    
    setMediaFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
    setSelectedFiles([]);
    trackEvent('media_deleted', { count: selectedFiles.length });
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(f => f.id));
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleFileUpdate = (fileId: string, updates: Partial<MediaFile>) => {
    setMediaFiles(prev =>
      prev.map(file =>
        file.id === fileId ? { ...file, ...updates } : file
      )
    );
    trackEvent('media_updated', { fileId, updates: Object.keys(updates) });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
          <p className="text-muted-foreground">
            Manage all your website assets in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(Array.from(e.target.files));
              }
            }}
          />
          <Button variant="outline" size="sm">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            {folders.map(folder => (
              <option key={folder} value={folder}>
                {folder === 'all' ? 'All Folders' : folder}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {selectedFiles.length > 0 && (
            <>
              <Badge variant="secondary">
                {selectedFiles.length} selected
              </Badge>
              <Button variant="destructive" size="sm" onClick={handleDeleteFiles}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-muted-foreground">
          or <Button variant="link" className="p-0 h-auto">browse files</Button> to upload
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Supports: Images, Videos, Audio, Documents (Max 50MB per file)
        </p>
      </div>

      {/* File Grid/List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredFiles.length} files
          </p>
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {selectedFiles.length === filteredFiles.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <Card 
                key={file.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedFiles.includes(file.id) ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square mb-2 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {file.thumbnail ? (
                      <img 
                        src={file.thumbnail} 
                        alt={file.alt || file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {file.type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file);
                      }}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <Card 
                key={file.id}
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  selectedFiles.includes(file.id) ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                        {file.thumbnail ? (
                          <img 
                            src={file.thumbnail} 
                            alt={file.alt || file.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          getFileIcon(file.type)
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                        </p>
                        {file.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {file.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{file.type}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(file);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upload Progress Modal */}
      {showUploadModal && uploadProgress.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 max-h-96">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Uploading Files
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {uploadProgress.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {item.file.name}
                        </p>
                        {item.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                        {item.status === 'error' && (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <Progress value={item.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {item.status === 'uploading' && `${item.progress}%`}
                        {item.status === 'completed' && 'Upload complete'}
                        {item.status === 'error' && 'Upload failed'}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* File Details Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-2/3 max-w-4xl max-h-[90vh]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                File Details
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* File Preview */}
                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      {selectedFile.thumbnail ? (
                        <img 
                          src={selectedFile.thumbnail} 
                          alt={selectedFile.alt || selectedFile.name}
                          className="max-w-full max-h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-muted-foreground">
                          {getFileIcon(selectedFile.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy URL
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="filename">File Name</Label>
                      <Input
                        id="filename"
                        value={selectedFile.name}
                        onChange={(e) =>
                          handleFileUpdate(selectedFile.id, { name: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="alt-text">Alt Text</Label>
                      <Input
                        id="alt-text"
                        value={selectedFile.alt || ''}
                        onChange={(e) =>
                          handleFileUpdate(selectedFile.id, { alt: e.target.value })
                        }
                        placeholder="Descriptive text for accessibility"
                      />
                    </div>

                    <div>
                      <Label htmlFor="caption">Caption</Label>
                      <Textarea
                        id="caption"
                        value={selectedFile.caption || ''}
                        onChange={(e) =>
                          handleFileUpdate(selectedFile.id, { caption: e.target.value })
                        }
                        placeholder="File caption or description"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        value={selectedFile.tags.join(', ')}
                        onChange={(e) =>
                          handleFileUpdate(selectedFile.id, { 
                            tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                          })
                        }
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">File Size</p>
                        <p className="text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">File Type</p>
                        <p className="text-muted-foreground">{selectedFile.type}</p>
                      </div>
                      <div>
                        <p className="font-medium">Uploaded</p>
                        <p className="text-muted-foreground">
                          {selectedFile.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Folder</p>
                        <p className="text-muted-foreground">
                          {selectedFile.folder || 'Root'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UniversalMediaLibrary;