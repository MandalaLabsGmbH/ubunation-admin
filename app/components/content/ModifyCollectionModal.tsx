'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { X } from 'lucide-react';
import { Collection } from '@/app/(pages)/content/page';

interface ModifyCollectionModalProps {
  collection: Collection;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function ModifyCollectionModal({ collection, onClose, onSaveSuccess }: ModifyCollectionModalProps) {
    const [name, setName] = useState(collection.name.en);
    const [description, setDescription] = useState(collection.description.en);
    const [imageUrl, setImageUrl] = useState(collection.imageRef?.url || '');
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSaving(true);
        try {
            const res = await fetch(`/api/db/collection`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    collectionId: collection.collectionId, 
                    name: { en: name }, 
                    description: { en: description },
                    imageRef: { url: imageUrl }
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to save collection.');
            }
            onSaveSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <Card className="relative w-full max-w-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X /></button>
                <CardHeader>
                    <CardTitle>Modify Collection: {collection.name.en}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="imageUrl">Image Link</Label>
                            <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="description">Description (HTML)</Label>
                            {/* CHANGE: Replaced Input with Textarea */}
                            <Textarea 
                                id="description" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                rows={10} 
                                placeholder="Enter collection description with HTML tags..."
                            />
                        </div>
                        {error && <p className="text-sm text-destructive text-center">{error}</p>}
                        <div className="flex justify-end space-x-2 pt-2">
                            <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>Cancel</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}