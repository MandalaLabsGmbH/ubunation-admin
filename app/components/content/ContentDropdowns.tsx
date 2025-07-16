'use client';

import { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Define the types for the data structures
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

interface ContentDropdownsProps {
  onProjectSelect: (project: Project | null) => void;
  onCollectionSelect: (collection: Collection | null) => void;
  onCollectibleSelect: (collectible: Collectible | null) => void;
}

export default function ContentDropdowns({ onProjectSelect, onCollectionSelect, onCollectibleSelect }: ContentDropdownsProps) {
  // State for the fetched data
  const [projects, setProjects] = useState<Project[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);

  // State for the selected IDs
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedCollectibleId, setSelectedCollectibleId] = useState<string | null>(null);

  // State for loading indicators
  const [isProjectsLoading, setProjectsLoading] = useState(true);
  const [isCollectionsLoading, setCollectionsLoading] = useState(false);
  const [isCollectiblesLoading, setCollectiblesLoading] = useState(false);

  // --- DATA FETCHING EFFECTS ---

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        const response = await fetch('/api/db/project');
        if (!response.ok) throw new Error(`Failed to fetch projects: ${response.statusText}`);
        const data = await response.json();
        // **FIX**: Ensure the response is an array before setting state
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Fetch Collections for the selected project
  useEffect(() => {
    // Reset downstream state when project changes
    setCollections([]);
    setCollectibles([]);
    setSelectedCollectionId(null);
    setSelectedCollectibleId(null);
    onCollectionSelect(null);
    onCollectibleSelect(null);

    if (!selectedProjectId) return;

    const fetchCollectionsForProject = async () => {
      setCollectionsLoading(true);
      try {
        const collectiblesRes = await fetch(`/api/db/collectible?projectId=${selectedProjectId}`);
        if (!collectiblesRes.ok) throw new Error('Failed to fetch collectibles for project');
        const projectCollectibles = await collectiblesRes.json();
        
        // **FIX**: Ensure projectCollectibles is an array before using .map
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
        } else {
            setCollections([]);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
        setCollections([]);
      } finally {
        setCollectionsLoading(false);
      }
    };

    fetchCollectionsForProject();
  }, [selectedProjectId, onCollectionSelect, onCollectibleSelect]);

  // Fetch Collectibles for the selected collection
  useEffect(() => {
    setCollectibles([]);
    setSelectedCollectibleId(null);
    onCollectibleSelect(null);

    if (!selectedCollectionId) return;

    const fetchCollectiblesForCollection = async () => {
      setCollectiblesLoading(true);
      try {
        const response = await fetch(`/api/db/collectible?collectionId=${selectedCollectionId}`);
        if (!response.ok) throw new Error('Failed to fetch collectibles');
        const data = await response.json();
        // **FIX**: Ensure data is an array
        setCollectibles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setCollectibles([]);
      } finally {
        setCollectiblesLoading(false);
      }
    };
    
    fetchCollectiblesForCollection();
  }, [selectedCollectionId, onCollectibleSelect]);


  // --- CALLBACK HANDLERS FOR SELECTION CHANGES ---

  const handleProjectChange = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
    const project = projects.find(p => p.projectId.toString() === projectId) || null;
    onProjectSelect(project);
  }, [projects, onProjectSelect]);
  
  const handleCollectionChange = useCallback((collectionId: string) => {
      setSelectedCollectionId(collectionId);
      const collection = collections.find(c => c.collectionId.toString() === collectionId) || null;
      onCollectionSelect(collection);
  }, [collections, onCollectionSelect]);

  const handleCollectibleChange = useCallback((collectibleId: string) => {
    setSelectedCollectibleId(collectibleId);
    const collectible = collectibles.find(c => c.collectibleId.toString() === collectibleId) || null;
    onCollectibleSelect(collectible);
  }, [collectibles, onCollectibleSelect]);


  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div>
        <Label htmlFor="project-select">Select Project</Label>
        <Select onValueChange={handleProjectChange} value={selectedProjectId || ''} disabled={isProjectsLoading}>
          <SelectTrigger id="project-select">
            <SelectValue placeholder={isProjectsLoading ? "Loading projects..." : "Select a project..."} />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.projectId} value={project.projectId.toString()}>
                {project.name.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProjectId && (
        <div>
          <Label htmlFor="collection-select">Collections</Label>
          <Select onValueChange={handleCollectionChange} value={selectedCollectionId || ''} disabled={isCollectionsLoading}>
            <SelectTrigger id="collection-select">
              <SelectValue placeholder={isCollectionsLoading ? "Loading collections..." : "Select a collection..."} />
            </SelectTrigger>
            <SelectContent>
              {collections.length > 0 ? collections.map((collection) => (
                <SelectItem key={collection.collectionId} value={collection.collectionId.toString()}>
                  {collection.name.en}
                </SelectItem>
              )) : <SelectItem value="none" disabled>No collections found</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedCollectionId && (
        <div>
          <Label htmlFor="collectible-select">Collectibles</Label>
          <Select onValueChange={handleCollectibleChange} value={selectedCollectibleId || ''} disabled={isCollectiblesLoading}>
            <SelectTrigger id="collectible-select">
              <SelectValue placeholder={isCollectiblesLoading ? "Loading collectibles..." : "Select a collectible..."} />
            </SelectTrigger>
            <SelectContent>
              {collectibles.length > 0 ? collectibles.map((collectible) => (
                <SelectItem key={collectible.collectibleId} value={collectible.collectibleId.toString()}>
                  {collectible.name.en}
                </SelectItem>
              )) : <SelectItem value="none" disabled>No collectibles found</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}