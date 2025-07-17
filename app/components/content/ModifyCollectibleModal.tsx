'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { X } from 'lucide-react';
import { Collectible } from '@/app/(pages)/content/page';

interface ModifyCollectibleModalProps {
  collectible: Collectible;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function ModifyCollectibleModal({ collectible, onClose, onSaveSuccess }: ModifyCollectibleModalProps) {
    const [name, setName] = useState(collectible.name.en);
    const [label, setLabel] = useState(collectible.label.en);
    const [description, setDescription] = useState(collectible.description.en);
    const [imageUrl, setImageUrl] = useState(collectible.imageRef?.url || '');
    const [price, setPrice] = useState(collectible.price?.base.toString() || '0.00');
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        const priceValue = parseFloat(price);
        if (isNaN(priceValue)) {
            setError("Price must be a valid number.");
            return;
        }
        setIsSaving(true);
        try {
            const res = await fetch(`/api/db/collectible`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    collectibleId: collectible.collectibleId, 
                    name: { en: name }, 
                    label: { en: label },
                    description: { en: description },
                    imageRef: { url: imageUrl },
                    price: { base: priceValue }
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to save collectible.');
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
                    <CardTitle>Modify Collectible: {collectible.name.en}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="label">Label</Label>
                                <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
                            </div>
                             <div>
                                <Label htmlFor="imageUrl">Image Link</Label>
                                <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                            </div>
                             <div>
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="description">Description (HTML)</Label>
                            {/* CHANGE: Replaced Input with Textarea */}
                            <Textarea 
                                id="description" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                rows={8}
                                placeholder="Enter collectible description with HTML tags..."
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