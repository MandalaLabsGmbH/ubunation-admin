import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ImageGallery from './ImageGallery';

interface ImageManagerProps {
  imageRef: Record<string, string>;
  onImageChange: (key: string, newUrl: string) => void;
  excludeKeys?: string[];
}

export default function ImageManager({ imageRef, onImageChange, excludeKeys = [] }: ImageManagerProps) {
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageKey, setSelectedImageKey] = useState<string | null>(null);
  const [isViewerOpen, setViewerOpen] = useState(false);
  const [viewedImageUrl, setViewedImageUrl] = useState<string | null>(null);

  const images = Object.entries(imageRef).filter(([key]) => !excludeKeys.includes(key));

  const handleOpenGallery = (key: string) => {
    setSelectedImageKey(key);
    setGalleryOpen(true);
  };

  const handleSelectImage = (newUrl: string) => {
    if (selectedImageKey) {
      onImageChange(selectedImageKey, newUrl);
    }
    setGalleryOpen(false);
  };

  const openImageViewer = (url: string) => {
    setViewedImageUrl(url);
    setViewerOpen(true);
  };

  return (
    <div className="p-4 my-4 border rounded-lg">
      <h3 className="text-lg font-bold">Edit Media</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {images.map(([key, url]) => (
          <div key={key} className="relative">
            <p className="text-sm font-semibold capitalize">{key}</p>
            <Image
              src={url}
              alt={key}
              width={200}
              height={200}
              className="object-cover rounded-md cursor-pointer"
              onClick={() => openImageViewer(url)}
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => handleOpenGallery(key)}
            >
              Change Image
            </Button>
          </div>
        ))}
      </div>

      {isGalleryOpen && (
        <ImageGallery
          onSelect={handleSelectImage}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      {isViewerOpen && viewedImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative">
            <button
              onClick={() => setViewerOpen(false)}
              className="absolute top-2 right-2 text-white bg-black rounded-full p-1"
            >
              &times;
            </button>
            <Image
              src={viewedImageUrl}
              alt="Full size"
              width={800}
              height={800}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}