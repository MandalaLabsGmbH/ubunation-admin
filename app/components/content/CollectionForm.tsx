import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageManager from './ImageManager';
import TiptapEditor from './TiptapEditor'; // Import TiptapEditor

interface Collection {
  collectionId: number;
  name: { [key: string]: string };
  description: { [key: string]: string };
  imageRef: Record<string, string>;
}

interface CollectionFormProps {
  language: string;
  collections: Collection[];
  selectedCollection: Collection | null;
  setSelectedCollection: (collection: Collection | null) => void;
  onSave: () => void;
}

export default function CollectionForm({ language, collections, selectedCollection, setSelectedCollection, onSave }: CollectionFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageRef, setImageRef] = useState<Record<string, string>>({});

  useEffect(() => {
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
    setImageRef((prev) => ({ ...prev, [key]: newUrl }));
  };

  const handleSave = async () => {
    if (!selectedCollection) return;
    const res = await fetch('/api/db/collection', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collectionId: selectedCollection.collectionId,
        name: { ...selectedCollection.name, [language]: name },
        description: { ...selectedCollection.description, [language]: description },
        imageRef,
      }),
    });
    if (res.ok) {
      onSave();
    }
  };

  return (
    <div className="p-4 my-4 border rounded-lg">
      <h2 className="text-xl font-bold">Choose a Collection</h2>
      <div className="flex items-center gap-4 my-4">
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
            <label className="font-semibold">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="font-semibold">Description</label>
            <TiptapEditor value={description} onChange={setDescription} />
          </div>
          <ImageManager imageRef={imageRef} onImageChange={handleImageChange} />
          <Button onClick={handleSave}>Save Collection Data</Button>
        </div>
      )}
    </div>
  );
}