import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function ImageGallery({ onSelect, onClose }: ImageGalleryProps) {
  const [images, setImages] = useState<{ key: string; url: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/s3')
      .then((res) => res.json())
      .then(setImages);
  }, []);

  const handleConfirm = () => {
    if (selectedImage) {
      if (window.confirm('Are you sure you want to update this image?')) {
        onSelect(selectedImage);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-11/12 max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Select an Image</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
          {images.map((image) => (
            <div
              key={image.key}
              className={`cursor-pointer p-2 border-2 ${selectedImage === image.url ? 'border-blue-500' : 'border-transparent'}`}
              onClick={() => setSelectedImage(image.url)}
            >
              <Image
                src={image.url}
                alt={image.key.split('/').pop() || ''}
                width={150}
                height={150}
                className="object-cover rounded-md"
              />
              <p className="text-xs text-center mt-1">{image.key.split('/').pop()}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6 space-x-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!selectedImage}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}