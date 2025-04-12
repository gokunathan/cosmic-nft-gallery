
import React, { useCallback } from 'react';
import { useCreateNFT } from '@/context/CreateNFTContext';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { FileUp, Image, Film, Music, Box, AlertCircle, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_FILE_TYPES = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
  'video/*': ['.mp4', '.webm'],
  'audio/*': ['.mp3', '.wav', '.flac'],
  'model/gltf-binary': ['.glb'],
  'model/gltf+json': ['.gltf'],
};

const StepUpload = () => {
  const { formData, addAssetFile, removeAssetFile } = useCreateNFT();
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    acceptedFiles.forEach(file => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File too large', {
          description: `${file.name} exceeds the maximum file size of 50MB.`
        });
        return;
      }
      
      addAssetFile(file);
    });
  }, [addAssetFile]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        const { file, errors } = rejection;
        
        if (errors[0]?.code === 'file-too-large') {
          toast.error('File too large', {
            description: `${file.name} exceeds the maximum file size of 50MB.`
          });
        } else if (errors[0]?.code === 'file-invalid-type') {
          toast.error('Invalid file type', {
            description: `${file.name} is not a supported file type.`
          });
        } else {
          toast.error('File rejected', {
            description: errors[0]?.message || 'Unknown error'
          });
        }
      });
    }
  });
  
  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) {
      return sizeInBytes + ' B';
    } else if (sizeInBytes < 1024 * 1024) {
      return (sizeInBytes / 1024).toFixed(1) + ' KB';
    } else {
      return (sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };
  
  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith('image')) return <Image size={16} />;
    if (fileType.startsWith('video')) return <Film size={16} />;
    if (fileType.startsWith('audio')) return <Music size={16} />;
    if (fileType.includes('gltf') || fileType.includes('glb')) return <Box size={16} />;
    return <FileUp size={16} />;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Upload Files</h2>
        <p className="text-gray-300 mb-4">
          Upload your artwork to create an NFT. We support images, videos, audio, and 3D models.
        </p>
      </div>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-neon-purple bg-neon-purple/10' 
            : 'border-gray-600 hover:border-neon-purple/50 hover:bg-gray-800/30'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center py-10">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4
            ${isDragActive ? 'bg-neon-purple/20' : 'bg-gray-800'}`}
          >
            <FileUp size={28} className={isDragActive ? 'text-neon-purple' : 'text-gray-300'} />
          </div>
          
          <p className="text-lg font-medium text-white mb-1">
            {isDragActive ? 'Drop files here' : 'Drag and drop your files here'}
          </p>
          
          <p className="text-gray-400 mb-4 max-w-md">
            Supported formats: PNG, JPG, GIF, SVG, MP4, WebM, MP3, WAV, GLB, GLTF.
            Max file size: 50MB.
          </p>
          
          <Button variant="outline">
            Browse Files
          </Button>
        </div>
      </div>
      
      {formData.assetPreviews.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-medium text-white mb-4">
            Uploaded Files ({formData.assetPreviews.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.assetPreviews.map((preview) => (
              <Card key={preview.id} className="overflow-hidden bg-black/40 border border-white/10">
                <div className="relative aspect-square bg-black flex items-center justify-center">
                  {preview.fileType === 'image' && (
                    <img 
                      src={preview.previewUrl} 
                      alt={preview.name} 
                      className="w-full h-full object-contain"
                    />
                  )}
                  
                  {preview.fileType === 'video' && (
                    <video 
                      src={preview.previewUrl} 
                      className="w-full h-full object-contain"
                      controls
                    />
                  )}
                  
                  {preview.fileType === 'audio' && (
                    <div className="w-full h-full flex items-center justify-center flex-col p-4">
                      <Music size={64} className="text-gray-400 mb-4" />
                      <audio 
                        src={preview.previewUrl} 
                        controls
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  {preview.fileType === '3d' && (
                    <div className="w-full h-full flex items-center justify-center flex-col">
                      <Box size={64} className="text-gray-400" /> {/* Changed from Cube to Box */}
                      <p className="text-gray-300 mt-2">3D Model Preview</p>
                    </div>
                  )}
                  
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full w-8 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAssetFile(preview.id);
                    }}
                  >
                    <X size={16} />
                  </Button>
                  
                  <Badge
                    className={`absolute top-2 left-2 ${
                      preview.fileType === 'image' ? 'bg-blue-500' : 
                      preview.fileType === 'video' ? 'bg-red-500' : 
                      preview.fileType === 'audio' ? 'bg-green-500' : 
                      'bg-purple-500'
                    }`}
                  >
                    {preview.fileType}
                  </Badge>
                </div>
                
                <div className="p-3 border-t border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-white font-medium truncate">{preview.name}</p>
                  </div>
                  <p className="text-xs text-gray-400">{formatFileSize(preview.size)}</p>
                  <Progress value={100} className="h-1 mt-2" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg flex gap-3">
        <AlertCircle size={20} className="text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-300 font-medium">Tips for better NFTs</p>
          <ul className="text-blue-200/80 text-sm mt-1 list-disc pl-4">
            <li>Use high-resolution images (at least 1500×1500 pixels)</li>
            <li>Keep file sizes reasonable for faster loading</li>
            <li>Use lossless formats (PNG, FLAC) for best quality</li>
            <li>For 3D models, optimize mesh and textures</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StepUpload;
