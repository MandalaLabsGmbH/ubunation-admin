/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageManager from './ImageManager';
import TiptapEditor from './TiptapEditor';
import Link from 'next/link';
import { Loader2, Upload } from 'lucide-react'; // <-- Import icons
import { toast } from 'sonner'; // <-- Import toast

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
  onDeploy: (data: any) => void; // <-- Add onDeploy prop
}

export default function CollectibleForm({ language, collectionId, onSave, onDeploy }: CollectibleFormProps) {
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [selectedCollectible, setSelectedCollectible] = useState<Collectible | null>(null);
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [imageRef, setImageRef] = useState<Record<string, string>>({});

  // --- FIX: Add loading state for the save button ---
  const [isSaving, setIsSaving] = useState(false);

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

  // Prepares the data object for saving or deploying
  const prepareDataPayload = () => {
    if (!selectedCollectible) return null;
    return {
      collectibleId: selectedCollectible.collectibleId,
      name: { ...selectedCollectible.name, [language]: name },
      label: { ...selectedCollectible.label, [language]: label },
      description: { ...selectedCollectible.description, [language]: description },
      imageRef,
    };
  };

  // --- FIX: Add full try/catch and loading state to handleSave ---
  const handleSave = async () => {
    const payload = prepareDataPayload();
    if (!payload) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/db/collectible', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSave();
        toast.success('Collectible saved successfully!');
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

  // --- Add handleDeploy function ---
  const handleDeploy = () => {
    const payload = prepareDataPayload();
    if (payload) {
      onDeploy(payload);
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
          <div className="py-5">
          <Link href={`/preview/campaign/${selectedCollectible?.collectibleId}/?lang=${language}`} target='_blank'><button className="w-100 mt-4 bg-orange-500 hover:bg-orange-600 px-8 py-3 font-semibold shadow-lg transition-transform transform hover:scale-105" >Collectible Page Preview</button></Link>
          </div>
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
          
          {/* --- UPDATE BUTTONS --- */}
          <div className="flex items-center gap-3">
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

