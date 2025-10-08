import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageManager from './ImageManager';
import TiptapEditor from './TiptapEditor'; // Import TiptapEditor

interface Collectible {
  collectibleId: number;
  name: { [key: string]: string };
  label: { [key: string]: string };
  description: { [key: string]: string };
  imageRef: Record<string, string>;
}

interface CollectibleFormProps {
  language: string;
  collectionId: number;
  onSave: () => void;
}

export default function CollectibleForm({ language, collectionId, onSave }: CollectibleFormProps) {
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [selectedCollectible, setSelectedCollectible] = useState<Collectible | null>(null);
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [imageRef, setImageRef] = useState<Record<string, string>>({});

  useEffect(() => {
    if (collectionId) {
      fetch(`/api/db/collectible?collectionId=${collectionId}`)
        .then((res) => res.json())
        .then((data) => {
          setCollectibles(Array.isArray(data) ? data : []);
          setSelectedCollectible(null);
        });
    }
  }, [collectionId]);

  useEffect(() => {
    if (selectedCollectible) {
      setName(selectedCollectible.name?.[language] || '');
      setLabel(selectedCollectible.label?.[language] || '');
      setDescription(selectedCollectible.description?.[language] || '');
      setImageRef(selectedCollectible.imageRef || {});
    } else {
      setName('');
      setLabel('');
      setDescription('');
      setImageRef({});
    }
  }, [selectedCollectible, language]);

  const handleImageChange = (key: string, newUrl: string) => {
    setImageRef((prev) => ({ ...prev, [key]: newUrl }));
  };

  const handleSave = async () => {
    if (!selectedCollectible) return;
    const res = await fetch('/api/db/collectible', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collectibleId: selectedCollectible.collectibleId,
        name: { ...selectedCollectible.name, [language]: name },
        label: { ...selectedCollectible.label, [language]: label },
        description: { ...selectedCollectible.description, [language]: description },
        imageRef,
      }),
    });
    if (res.ok) {
      onSave();
    }
  };

  return (
    <div className="p-4 my-4 border rounded-lg">
      <h2 className="text-xl font-bold">Choose a Collectible from the Collection</h2>
      <div className="flex items-center gap-4 my-4">
        <Select
          onValueChange={(value) => {
            const collectible = collectibles.find(c => c.collectibleId.toString() === value) || null;
            setSelectedCollectible(collectible);
          }}
          value={selectedCollectible?.collectibleId.toString() || ""}
          disabled={!collectibles.length}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Collectible" />
          </SelectTrigger>
          <SelectContent>
            {collectibles.map((collectible) => (
              <SelectItem key={collectible.collectibleId} value={collectible.collectibleId.toString()}>
                {collectible.name?.[language] || `Collectible ID: ${collectible.collectibleId}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedCollectible && (
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="font-semibold">Label</label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div>
            <label className="font-semibold">Description</label>
            <TiptapEditor value={description} onChange={setDescription} />
          </div>
          <ImageManager
            imageRef={imageRef}
            onImageChange={handleImageChange}
            excludeKeys={['url']}
          />
          <Button onClick={handleSave}>Save Collectible Data</Button>
        </div>
      )}
    </div>
  );
}