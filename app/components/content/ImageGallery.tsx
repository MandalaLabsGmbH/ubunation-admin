import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ImageGalleryProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function ImageGallery({ onSelect, onClose }: ImageGalleryProps) {
  const [images, setImages] = useState<{ key: string; url: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/s3')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch images (status: ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          // If the API returns something other than an array
          throw new Error("Invalid data format received from API.");
        }
      })
      .catch((err) => {
        console.error("Error fetching images for gallery:", err);
        setError("Could not load images. Please check the server logs.");
        setImages([]); // Ensure images is an empty array on error
      })
      .finally(() => {
        setIsLoading(false);
      });
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
      <div className="bg-background p-6 rounded-lg w-11/12 max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Select an Image</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-h-96 overflow-y-auto min-h-[10rem] p-2">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="col-span-full flex justify-center items-center text-destructive">
              <p>{error}</p>
            </div>
          ) : images.length > 0 ? (
            images.map((image) => (
              <div
                key={image.key}
                className={`cursor-pointer p-1 border-2 rounded-md ${selectedImage === image.url ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setSelectedImage(image.url)}
              >
                <Image
                  src={image.url}
                  alt={image.key.split('/').pop() || ''}
                  width={150}
                  height={150}
                  className="object-cover rounded-md aspect-square"
                />
                <p className="text-xs text-center mt-1 truncate">{image.key.split('/').pop()}</p>
              </div>
            ))
          ) : (
             <div className="col-span-full flex justify-center items-center text-muted-foreground">
                <p>No images found in the gallery.</p>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6 space-x-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!selectedImage}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}
