'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { Project } from '@/app/(pages)/content/page';

interface ModifyProjectModalProps {
  project: Project;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function ModifyProjectModal({ project, onClose, onSaveSuccess }: ModifyProjectModalProps) {
    const [name, setName] = useState(project.name.en);
    const [location, setLocation] = useState(project.location || '');
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSaving(true);
        try {
            const res = await fetch(`/api/db/project`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: project.projectId,
                    name: { en: name },
                    location
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to save project.');
            }
            // FIX: onSaveSuccess is now called after a successful save
            onSaveSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setIsSaving(false); // Only stop loading on error
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <Card className="relative w-full max-w-lg">
                <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X /></button>
                <CardHeader>
                    <CardTitle>Modify Project: {project.name.en}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
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