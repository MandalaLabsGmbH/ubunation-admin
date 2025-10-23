/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageManager from './ImageManager';
import TiptapEditor from './TiptapEditor';
import { Loader2, Upload } from 'lucide-react'; // <-- Import icons
import { toast } from 'sonner'; // <-- Import toast

interface Sponsor {
  sponsorId: number;
  name: { [key: string]: string };
  description: { [key: string]: string };
  imageRef: Record<string, string>;
}

interface SponsorFormProps {
  language: string;
  collectionId: number;
  type: 'voices' | 'charity';
  onSave: () => void;
  onDeploy: (data: any) => void; // <-- Add onDeploy prop
}

export default function SponsorForm({ language, collectionId, type, onSave, onDeploy }: SponsorFormProps) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageRef, setImageRef] = useState<Record<string, string>>({});

  // --- FIX: Add loading state for the save button ---
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (collectionId) {
      // Note: Your API seems to fetch by `type` and `collectionId`, which might be incorrect.
      // The API route in your provided files only seems to support `collectionId`.
      // I am keeping your original fetch URL here.
      fetch(`/api/db/sponsor?type=${type}&collectionId=${collectionId}`)
        .then((res) => res.json())
        .then(data => {
          setSponsors(Array.isArray(data) ? data : []);
          setSelectedSponsor(null);
        });
    }
  }, [collectionId, type]);

  useEffect(() => {
    if (selectedSponsor) {
      setName(selectedSponsor.name?.[language] || '');
      setDescription(selectedSponsor.description?.[language] || '');
      setImageRef(selectedSponsor.imageRef || {});
    } else {
      setName('');
      setDescription('');
      setImageRef({});
    }
  }, [selectedSponsor, language]);

  const handleImageChange = (key: string, newUrl: string) => {
    setImageRef((prev) => ({ ...prev, [key]: newUrl }));
  };

  // Prepares the data object for saving or deploying
  const prepareDataPayload = () => {
    if (!selectedSponsor) return null;
    return {
      sponsorId: selectedSponsor.sponsorId,
      name: { ...selectedSponsor.name, [language]: name },
      description: { ...selectedSponsor.description, [language]: description },
      imageRef,
    };
  };

  const title = type.charAt(0).toUpperCase() + type.slice(1);

  // --- FIX: Add full try/catch and loading state to handleSave ---
  const handleSave = async () => {
    const payload = prepareDataPayload();
    if (!payload) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/db/sponsor', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSave();
        toast.success(`${title} data saved successfully!`);
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
      <h2 className="text-xl font-bold">Edit {title}</h2>
      <div className="flex items-center gap-4 my-4">
        <Select
          onValueChange={(value) => {
            const sponsor = sponsors.find(s => s.sponsorId.toString() === value) || null;
            setSelectedSponsor(sponsor);
          }}
          value={selectedSponsor?.sponsorId.toString() || ""}
          disabled={!sponsors.length}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder={`Select ${title}`} />
          </SelectTrigger>
          <SelectContent>
            {sponsors.map((sponsor) => (
              <SelectItem key={sponsor.sponsorId} value={sponsor.sponsorId.toString()}>
                {sponsor.name?.[language] || `Sponsor ID: ${sponsor.sponsorId}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedSponsor && (
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="font-semibold">Description</label>
            <TiptapEditor value={description} onChange={setDescription} />
          </div>
          <ImageManager
            imageRef={imageRef}
            onImageChange={handleImageChange}
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

