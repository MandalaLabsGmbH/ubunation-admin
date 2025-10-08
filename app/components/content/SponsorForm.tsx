import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageManager from './ImageManager';
import TiptapEditor from './TiptapEditor'; // Import TiptapEditor

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
}

export default function SponsorForm({ language, collectionId, type, onSave }: SponsorFormProps) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageRef, setImageRef] = useState<Record<string, string>>({});

  useEffect(() => {
    if (collectionId) {
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

  const handleSave = async () => {
    if (!selectedSponsor) return;
    const res = await fetch('/api/db/sponsor', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sponsorId: selectedSponsor.sponsorId,
        name: { ...selectedSponsor.name, [language]: name },
        description: { ...selectedSponsor.description, [language]: description },
        imageRef,
      }),
    });
    if (res.ok) {
      onSave();
    }
  };

  const title = type.charAt(0).toUpperCase() + type.slice(1);

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
          <Button onClick={handleSave}>Save {title} Data</Button>
        </div>
      )}
    </div>
  );
}