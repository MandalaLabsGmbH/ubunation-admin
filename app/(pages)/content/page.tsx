'use client';

import { useState } from 'react';
import ContentDropdowns from '@/app/components/content/ContentDropdowns';
import ModifyProjectModal from '@/app/components/content/ModifyProjectModal';
import ModifyCollectionModal from '@/app/components/content/ModifyCollectionModal';
import ModifyCollectibleModal from '@/app/components/content/ModifyCollectibleModal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Define types for the data
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
}

export interface Collectible {
  collectibleId: number;
  label: { en: string };
  name: { en: string };
  description: { en: string };
  imageRef: { url: string };
  price: { base: number };
}

export default function ContentPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedCollectible, setSelectedCollectible] = useState<Collectible | null>(null);

  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isCollectionModalOpen, setCollectionModalOpen] = useState(false);
  const [isCollectibleModalOpen, setCollectibleModalOpen] = useState(false);
  
  const router = useRouter();

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
          onProjectSelect={setSelectedProject}
          onCollectionSelect={setSelectedCollection}
          onCollectibleSelect={setSelectedCollectible}
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
        />
      )}
      {isCollectionModalOpen && selectedCollection && (
        <ModifyCollectionModal
          collection={selectedCollection}
          onClose={() => setCollectionModalOpen(false)}
        />
      )}
      {isCollectibleModalOpen && selectedCollectible && (
        <ModifyCollectibleModal
          collectible={selectedCollectible}
          onClose={() => setCollectibleModalOpen(false)}
        />
      )}
    </div>
  );
}