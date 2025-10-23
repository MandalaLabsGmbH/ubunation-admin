/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CollectionForm from '@/app/components/content/CollectionForm';
import CollectibleForm from '@/app/components/content/CollectibleForm';
import SponsorForm from '@/app/components/content/SponsorForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ConfirmDeployModal from '@/app/components/content/ConfirmDeployModal';
import { toast, Toaster } from 'sonner'; // Using sonner for toast notifications

// Define the shape of the data to be deployed
interface DeployPayload {
  endpoint: string;
  data: any;
}

export default function AppContentPage() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [lastSaved, setLastSaved] = useState<Record<string, Date | null>>({
    en: null,
    de: null,
  });

  // --- State for Deployment Modal ---
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [deployPayload, setDeployPayload] = useState<DeployPayload | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null); // <-- FIX 1: Add state for error
  // --- END ---

  useEffect(() => {
    // Original useEffect to fetch collections
    if (language) {
      fetch('/api/db/collection?getAll=true')
        .then((res) => res.json())
        .then(setCollections);
    }
  }, [language]);

  const handleSaveAll = () => {
    // This is a placeholder. You'll need to trigger the save functions
    // in each of the child components (CollectionForm, CollectibleForm, etc.)
    console.log('Saving all changes...');
    setLastSaved((prev) => ({ ...prev, [language]: new Date() }));
  };

  // --- Functions for Deployment Flow ---
  /**
   * Called by child forms when "Deploy" is clicked.
   * Sets the payload and opens the confirmation modal.
   */
  const handleDeployClick = (endpoint: string, data: any) => {
    setDeployPayload({ endpoint, data });
    setDeployError(null); // Clear any previous errors
    setIsDeployModalOpen(true);
  };

  /**
   * Called when the user clicks "Cancel" in the modal.
   */
  const handleCancelDeploy = () => {
    setIsDeployModalOpen(false);
    setDeployPayload(null);
    setIsDeploying(false);
    setDeployError(null); // Clear error on close
  };

  /**
   * Called when the user clicks "Proceed" in the modal.
   * Sends the data to our new secure API endpoint.
   */
  const handleConfirmDeploy = async () => {
    if (!deployPayload) return;

    setIsDeploying(true);
    setDeployError(null); // Clear previous errors
    toast.loading('Deploying content to live server...');

    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deployPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Deployment failed');
      }

      // Success
      toast.success('Content successfully deployed to live server!');
      handleCancelDeploy(); // Closes modal and resets state

    } catch (error: any) {
      console.error("Deployment error:", error);
      const errorMessage = `Deployment failed: ${error.message}`;
      toast.error(errorMessage);
      setDeployError(errorMessage); // <-- FIX 1: Set error message to display in modal
      setIsDeploying(false); // Keep modal open on error
    }
  };
  // --- END ---

  return (
    <div>
      <h1 className="text-3xl font-bold">App Content</h1>
      <p className="mt-2">Modify the Ubunation App&apos;s Content Below</p>

      {/* --- Toaster for notifications --- */}
      <Toaster position="top-right" richColors />

      <div className="my-6">
        <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Your Language
        </label>
        <Select onValueChange={(value) => {
          setLanguage(value);
          i18n.changeLanguage(value);
        }} value={language}>
          <SelectTrigger id="language-select" className="w-64">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {language && (
        <>
          <Link href={`/preview/main/?lang=${language}`} target='_blank'><button className="w-100 mt-4 bg-orange-500 hover:bg-orange-600 px-8 py-3 font-semibold shadow-lg transition-transform transform hover:scale-105" >Main Page Preview</button></Link>
          <CollectionForm
            language={language}
            collections={collections}
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
            onSave={() => setLastSaved((prev) => ({ ...prev, [language]: new Date() }))}
            // <-- FIX 2: Wrap handleDeployClick in an arrow function to match expected prop type -->
            onDeploy={(data: any) => handleDeployClick('Collection/updateCollectionByCollectionId', data)}
          />

          {selectedCollection && (
            <>
              <CollectibleForm
                language={language}
                collectionId={selectedCollection.collectionId}
                onSave={() => setLastSaved((prev) => ({ ...prev, [language]: new Date() }))}
                // <-- FIX 2: Wrap handleDeployClick in an arrow function -->
                onDeploy={(data: any) => handleDeployClick('Collectible/updateCollectibleByCollectibleId', data)}
              />
              <SponsorForm
                language={language}
                collectionId={selectedCollection.collectionId}
                type="voices"
                onSave={() => setLastSaved((prev) => ({ ...prev, [language]: new Date() }))}
                // <-- FIX 2: Wrap handleDeployClick in an arrow function -->
                onDeploy={(data: any) => handleDeployClick('Sponsor/updateSponsorBySponsorId', data)}
              />
              <SponsorForm
                language={language}
                collectionId={selectedCollection.collectionId}
                type="charity"
                onSave={() => setLastSaved((prev) => ({ ...prev, [language]: new Date() }))}
                // <-- FIX 2: Wrap handleDeployClick in an arrow function -->
                onDeploy={(data: any) => handleDeployClick('Sponsor/updateSponsorBySponsorId', data)}
              />
            </>
          )}

          <div className="mt-8">
            <Button onClick={handleSaveAll}>Save All</Button>
            {lastSaved[language] && (
              <p className="mt-2 text-sm text-gray-500">
                Last saved ({language}): {lastSaved[language]?.toLocaleString()}
              </p>
            )}
          </div>
        </>
      )}

      {/* --- Deployment Modal --- */}
      <ConfirmDeployModal
        isOpen={isDeployModalOpen}
        isLoading={isDeploying}
        onClose={handleCancelDeploy}
        onConfirm={handleConfirmDeploy}
        title="Update Live Content" // <-- FIX 1: Pass title prop
        error={deployError}      // <-- FIX 1: Pass error prop
      />
    </div>
  );
}

