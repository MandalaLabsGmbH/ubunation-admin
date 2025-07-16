// This is a simplified example. You would create similar modals for Collection and Collectible.
'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { Collection } from '@/app/(pages)/content/page';

interface ModifyCollectionModalProps {
  collection: Collection;
  onClose: () => void;
}

export default function ModifyCollectionModal({ collection, onClose }: ModifyCollectionModalProps) {
    const [name, setName] = useState(collection.name.en);
    const [description, setDescription] = useState(collection.description.en);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        await fetch(`/api/db/collection`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collectionId: collection.collectionId, name: { en: name }, location }),
        });
        onClose();
    };
    
    // const handleCancel = () => {
    //     if (showConfirm) {
    //         onClose();
    //     } else {
    //         setShowConfirm(true);
    //     }
    // };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <Card className="relative w-full max-w-lg">
                <button onClick={onClose} className="absolute top-4 right-4"><X /></button>
                <CardHeader>
                    <CardTitle>Modify collection</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="location">Description</Label>
                            <Input id="location" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="flex justify-end space-x-2">
                           {showConfirm ? (
                                <>
                                    <p>Are you sure?</p>
                                    <Button variant="destructive" onClick={onClose}>Yes</Button>
                                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>No</Button>
                                </>
                           ) : (
                                <>
                                    <Button type="button" variant="ghost" onClick={() => setShowConfirm(true)}>Cancel</Button>
                                    <Button type="submit">Save</Button>
                                </>
                           )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
