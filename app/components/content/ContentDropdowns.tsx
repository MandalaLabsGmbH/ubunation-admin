'use client';

import { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Project, Collection, Collectible } from '@/app/(pages)/content/page';

interface ContentDropdownsProps {
    projects: Project[];
    collections: Collection[];
    collectibles: Collectible[];
    setCollections: (collections: Collection[]) => void;
    setCollectibles: (collectibles: Collectible[]) => void;
    onProjectSelect: (project: Project | null) => void;
    onCollectionSelect: (collection: Collection | null) => void;
    onCollectibleSelect: (collectible: Collectible | null) => void;
    isLoading: { projects: boolean; collections: boolean; collectibles: boolean; };
    setIsLoading: (loadingState: { projects: boolean; collections: boolean; collectibles: boolean; }) => void;
}

export default function ContentDropdowns({ 
    projects, collections, collectibles, 
    setCollections, setCollectibles,
    onProjectSelect, onCollectionSelect, onCollectibleSelect,
    isLoading, setIsLoading
}: ContentDropdownsProps) {

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedCollectibleId, setSelectedCollectibleId] = useState<string | null>(null);

  // Effect to handle resetting when the parent's data (projects) changes after a save
  useEffect(() => {
    setSelectedProjectId(null);
    setSelectedCollectionId(null);
    setSelectedCollectibleId(null);
  }, [projects]);


  // Handler for when a project is selected
  const handleProjectChange = useCallback((projectId: string) => {
    if (!projectId) return;
    
    setSelectedProjectId(projectId);
    // Clear all downstream state and selections
    setCollections([]);
    setCollectibles([]);
    setSelectedCollectionId(null);
    setSelectedCollectibleId(null);
    onCollectionSelect(null);
    onCollectibleSelect(null);

    const project = projects.find(p => p.projectId.toString() === projectId) || null;
    onProjectSelect(project);

    // Trigger collection fetching in the parent
    const fetchCollections = async () => {
        setIsLoading({ ...isLoading, collections: true });
        try {
            const collectiblesRes = await fetch(`/api/db/collectible?projectId=${projectId}`);
            if (!collectiblesRes.ok) throw new Error('Failed to fetch collectibles for project');
            const projectCollectibles = await collectiblesRes.json();
            
            if (!Array.isArray(projectCollectibles)) {
                throw new Error("Received non-array data for project collectibles");
            }

            const uniqueCollectionIds = [...new Set(projectCollectibles.map(c => c.collectionId))];
            if (uniqueCollectionIds.length > 0) {
                const collectionPromises = uniqueCollectionIds.map(id =>
                    fetch(`/api/db/collection?collectionId=${id}`).then(res => res.json())
                );
                const resolvedCollections = await Promise.all(collectionPromises);
                setCollections(resolvedCollections.filter(c => c));
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
            setCollections([]);
        } finally {
            setIsLoading({ ...isLoading, collections: false });
        }
    };
    fetchCollections();
  }, [projects, onProjectSelect, onCollectionSelect, onCollectibleSelect, setCollections, setCollectibles, setIsLoading, isLoading]);
  
  // Handler for when a collection is selected
  const handleCollectionChange = useCallback((collectionId: string) => {
    if (!collectionId) return;

    setSelectedCollectionId(collectionId);
    setCollectibles([]);
    setSelectedCollectibleId(null);
    onCollectibleSelect(null);

    const collection = collections.find(c => c.collectionId.toString() === collectionId) || null;
    onCollectionSelect(collection);
    
    const fetchCollectibles = async () => {
        setIsLoading({ ...isLoading, collectibles: true });
        try {
            const response = await fetch(`/api/db/collectible?collectionId=${collectionId}`);
            if (!response.ok) throw new Error('Failed to fetch collectibles');
            const data = await response.json();
            setCollectibles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setCollectibles([]);
        } finally {
            setIsLoading({ ...isLoading, collectibles: false });
        }
    };
    fetchCollectibles();
  }, [collections, onCollectionSelect, onCollectibleSelect, setCollectibles, setIsLoading, isLoading]);
  
  // Handler for when a collectible is selected
  const handleCollectibleChange = useCallback((collectibleId: string) => {
      setSelectedCollectibleId(collectibleId);
      const collectible = collectibles.find(c => c.collectibleId.toString() === collectibleId) || null;
      onCollectibleSelect(collectible);
  }, [collectibles, onCollectibleSelect]);


  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div>
        <Label htmlFor="project-select">Select Project</Label>
        <Select onValueChange={handleProjectChange} value={selectedProjectId || ''} disabled={isLoading.projects}>
          <SelectTrigger id="project-select">
            <SelectValue placeholder={isLoading.projects ? "Loading projects..." : "Select a project..."} />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.projectId} value={project.projectId.toString()}>{project.name.en}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProjectId && (
        <div>
            <Label htmlFor="collection-select">Collections</Label>
            <Select onValueChange={handleCollectionChange} value={selectedCollectionId || ''} disabled={isLoading.collections}>
                <SelectTrigger id="collection-select">
                    <SelectValue placeholder={isLoading.collections ? "Loading collections..." : "Select a collection..."} />
                </SelectTrigger>
                <SelectContent>
                    {collections.length > 0 ? (
                        collections.map((collection) => (
                            <SelectItem key={collection.collectionId} value={collection.collectionId.toString()}>{collection.name.en}</SelectItem>
                        ))
                    ) : (
                        <SelectItem value="none" disabled>No collections found</SelectItem>
                    )}
                </SelectContent>
            </Select>
        </div>
      )}
      
      {selectedCollectionId && (
        <div>
            <Label htmlFor="collectible-select">Collectibles</Label>
            <Select onValueChange={handleCollectibleChange} value={selectedCollectibleId || ''} disabled={isLoading.collectibles}>
                <SelectTrigger id="collectible-select">
                    <SelectValue placeholder={isLoading.collectibles ? "Loading collectibles..." : "Select a collectible..."} />
                </SelectTrigger>
                <SelectContent>
                     {collectibles.length > 0 ? (
                        collectibles.map((collectible) => (
                            <SelectItem key={collectible.collectibleId} value={collectible.collectibleId.toString()}>{collectible.name.en}</SelectItem>
                        ))
                    ) : (
                        <SelectItem value="none" disabled>No collectibles found</SelectItem>
                    )}
                </SelectContent>
            </Select>
        </div>
      )}
    </div>
  );
}