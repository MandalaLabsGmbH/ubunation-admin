'use client';

import { useState, useEffect, useCallback } from 'react';
import ContentDropdowns from '@/app/components/content/ContentDropdowns';
import ModifyProjectModal from '@/app/components/content/ModifyProjectModal';
import ModifyCollectionModal from '@/app/components/content/ModifyCollectionModal';
import ModifyCollectibleModal from '@/app/components/content/ModifyCollectibleModal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Types remain the same
export interface Project {
  projectId: number;
  name: { en: string };
  location: string;
}
export interface Collection {
  collectionId: number;
  name: { en: string };
  description: { en: string };
  imageRef: { url: string };
  projectId: number;
}
export interface Collectible {
  collectibleId: number;
  label: { en: string };
  name: { en: string };
  description: { en: string };
  imageRef: { url: string };
  price: { base: number };
  collectionId: number;
}

export default function ContentPage() {
    // --- STATE MANAGEMENT ---
    const [projects, setProjects] = useState<Project[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [collectibles, setCollectibles] = useState<Collectible[]>([]);

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    const [selectedCollectible, setSelectedCollectible] = useState<Collectible | null>(null);

    const [isProjectModalOpen, setProjectModalOpen] = useState(false);
    const [isCollectionModalOpen, setCollectionModalOpen] = useState(false);
    const [isCollectibleModalOpen, setCollectibleModalOpen] = useState(false);
    
    const [isLoading, setIsLoading] = useState({ projects: true, collections: false, collectibles: false });

    const router = useRouter();

    // --- DATA FETCHING ---
    const fetchProjects = useCallback(async () => {
        setIsLoading(prev => ({ ...prev, projects: true }));
        try {
            const response = await fetch('/api/db/project');
            if (!response.ok) throw new Error('Failed to fetch projects');
            const data = await response.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setProjects([]);
        } finally {
            setIsLoading(prev => ({ ...prev, projects: false }));
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // --- CALLBACKS ---
    const handleSaveSuccess = () => {
        setProjectModalOpen(false);
        setCollectionModalOpen(false);
        setCollectibleModalOpen(false);
        // Re-fetch all projects, which will cascade updates down the dropdowns
        fetchProjects();
        // Reset selections to force user to re-select from the updated list
        setSelectedProject(null);
        setSelectedCollection(null);
        setSelectedCollectible(null);
    };

    const handlePreview = () => {
        if (selectedCollectible) {
            router.push(`/preview/${selectedCollectible.collectibleId}`);
        }
    };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>
      <div className="space-y-4">
        <ContentDropdowns
          projects={projects}
          collections={collections}
          collectibles={collectibles}
          setCollections={setCollections}
          setCollectibles={setCollectibles}
          onProjectSelect={setSelectedProject}
          onCollectionSelect={setSelectedCollection}
          onCollectibleSelect={setSelectedCollectible}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <div className="flex space-x-2">
            {selectedProject && (
              <Button onClick={() => setProjectModalOpen(true)}>Modify Project</Button>
            )}
            {selectedCollection && (
              <Button onClick={() => setCollectionModalOpen(true)}>Modify Collection</Button>
            )}
            {selectedCollectible && (
                <>
                    <Button onClick={() => setCollectibleModalOpen(true)}>Modify Collectible</Button>
                    <Button variant="secondary" onClick={handlePreview}>Preview</Button>
                </>
            )}
        </div>
      </div>

      {isProjectModalOpen && selectedProject && (
        <ModifyProjectModal
          project={selectedProject}
          onClose={() => setProjectModalOpen(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
      {isCollectionModalOpen && selectedCollection && (
        <ModifyCollectionModal
          collection={selectedCollection}
          onClose={() => setCollectionModalOpen(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
      {isCollectibleModalOpen && selectedCollectible && (
        <ModifyCollectibleModal
          collectible={selectedCollectible}
          onClose={() => setCollectibleModalOpen(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}