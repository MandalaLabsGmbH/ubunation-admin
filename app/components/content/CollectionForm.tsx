/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageManager from './ImageManager';
import TiptapEditor from './TiptapEditor';
import { Loader2, Upload } from 'lucide-react'; // <-- Import icons
import { toast } from 'sonner'; // <-- Import toast for error messages

interface Collection {
// ... existing interface ...
  collectionId: number;
  name: { [key: string]: string };
  description: { [key: string]: string };
  imageRef: Record<string, string>;
}

interface CollectionFormProps {
// ... existing interface ...
  language: string;
  collections: Collection[];
  selectedCollection: Collection | null;
  setSelectedCollection: (collection: Collection | null) => void;
  onSave: () => void;
  onDeploy: (data: any) => void;
}

export default function CollectionForm({ language, collections, selectedCollection, setSelectedCollection, onSave, onDeploy }: CollectionFormProps) {
  // ... existing state ...
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageRef, setImageRef] = useState<Record<string, string>>({});
  
  // --- FIX: Add loading state for the save button ---
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // ... existing effect ...
    if (selectedCollection) {
      setName(selectedCollection.name?.[language] || '');
      setDescription(selectedCollection.description?.[language] || '');
      setImageRef(selectedCollection.imageRef || {});
    } else {
      setName('');
      setDescription('');
      setImageRef({});
    }
  }, [selectedCollection, language]);

  const handleImageChange = (key: string, newUrl: string) => {
    // ... existing handler ...
    setImageRef((prev) => ({ ...prev, [key]: newUrl }));
  };

  // Prepares the data object for saving or deploying
  const prepareDataPayload = () => {
    if (!selectedCollection) return null;
    return {
      collectionId: selectedCollection.collectionId,
      name: { ...selectedCollection.name, [language]: name },
      description: { ...selectedCollection.description, [language]: description },
      imageRef,
    };
  };

  // --- FIX: Add full try/catch and loading state to handleSave ---
  const handleSave = async () => {
    const payload = prepareDataPayload();
    if (!payload) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/db/collection', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSave();
        toast.success('Collection saved successfully!');
      } else {
        // Handle HTTP errors
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to save (status: ${res.status})`);
      }
    } catch (error: any) {
      // Handle network errors and thrown errors
      console.error("Save error:", error);
      toast.error(error.message || 'An unknown error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeploy = () => {
    const payload = prepareDataPayload();
    if (payload) {
      onDeploy(payload);
    }
  };

  return (
    <div className="p-4 my-4 border rounded-lg">
      <h2 className="text-xl font-bold">Choose a Collection</h2>
      <div className="flex items-center gap-4 my-4">
        {/* ... existing Select ... */}
        <Select
          onValueChange={(value) => {
            const collection = collections.find(c => c.collectionId.toString() === value) || null;
            setSelectedCollection(collection);
          }}
          value={selectedCollection?.collectionId.toString() || ""}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Collection" />
          </SelectTrigger>
          <SelectContent>
            {collections.map((collection) => (
              <SelectItem key={collection.collectionId} value={collection.collectionId.toString()}>
                {collection.name?.[language] || `Collection ID: ${collection.collectionId}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedCollection && (
        <div className="space-y-4">
          <div>
{/* ... existing code ... */}
            <label className="font-semibold">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="font-semibold">Description</label>
            <TiptapEditor value={description} onChange={setDescription} />
          </div>
          <ImageManager imageRef={imageRef} onImageChange={handleImageChange} />
          
          {/* --- UPDATE BUTTONS --- */}
          <div className="flex items-center gap-3">
            {/* --- FIX: Add loading state to Save button --- */}
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
            <Button variant="outline" onClick={handleDeploy}>
              <Upload className="mr-2 h-4 w-4" />
              Deploy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

