import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Image as ImageIcon, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_COPY } from '@/lib/constants';
interface ImageUploaderProps {
  onImageUpload: (imageUrl: string | null) => void; // Allow null for removing image
  uploadedImage: string | null;
}
export function ImageUploader({ onImageUpload, uploadedImage }: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            onImageUpload(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        console.warn('Invalid file type. Please upload a PNG or JPG image.');
        alert('Invalid file type. Please upload a PNG or JPG image.'); // User feedback
      }
    }
  }, [onImageUpload]);
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            onImageUpload(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        console.warn('Invalid file type. Please upload a PNG or JPG image.');
        alert('Invalid file type. Please upload a PNG or JPG image.'); // User feedback
      }
    }
  }, [onImageUpload]);
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);
  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);
  const handleRemoveImage = useCallback(() => {
    onImageUpload(null); // Pass null to remove the image
  }, [onImageUpload]);
  return (
    <div className="w-full max-w-2xl mx-auto content-spacing-y">
      {uploadedImage ?
        <div className="relative group card-base p-4 flex flex-col items-center justify-center min-h-[200px]">
          <img
            src={uploadedImage}
            alt="Uploaded palette preview"
            className="max-w-full max-h-[400px] object-contain rounded-md shadow-sm" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Remove image">
            <XCircle className="h-6 w-6" />
          </Button>
        </div> :
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "card-base p-8 text-center border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ease-in-out",
            isDragOver ?
            "border-aura-blue bg-aura-blue/10 shadow-lg scale-[1.01]" :
            "border-gray-300 dark:border-gray-700 hover:border-aura-blue/70 hover:bg-gray-50 dark:hover:bg-gray-800"
          )}>
          <Label htmlFor="file-upload" className="flex flex-col items-center justify-center space-y-4 h-full w-full cursor-pointer">
            <UploadCloud className={cn("w-12 h-12 text-gray-400 transition-colors duration-200", isDragOver && "text-aura-blue")} />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Drag & drop your palette here
            </p>
            <p className="text-sm text-gray-500">
              or
            </p>
            <Button asChild variant="outline" className="btn-outline-primary">
              <span>Browse files</span>
            </Button>
            <Input
              id="file-upload"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="sr-only" />
            <p className="text-xs text-gray-400 mt-2">
              PNG, JPG up to 5MB
            </p>
          </Label>
        </div>
      }
    </div>
  );
}
