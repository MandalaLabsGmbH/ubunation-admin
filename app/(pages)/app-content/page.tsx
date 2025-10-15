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


export default function AppContentPage() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [lastSaved, setLastSaved] = useState<Record<string, Date | null>>({
    en: null,
    de: null,
  });

  useEffect(() => {
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

  return (
    <div>
      <h1 className="text-3xl font-bold">App Content</h1>
      <p className="mt-2">Modify the Ubunation App&apos;s Content Below</p>

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
          />

          {selectedCollection && (
            <>
              <CollectibleForm
                language={language}
                collectionId={selectedCollection.collectionId}
                onSave={() => setLastSaved((prev) => ({ ...prev, [language]: new Date() }))}
              />
              <SponsorForm
                language={language}
                collectionId={selectedCollection.collectionId}
                type="voices"
                onSave={() => setLastSaved((prev) => ({ ...prev, [language]: new Date() }))}
              />
              <SponsorForm
                language={language}
                collectionId={selectedCollection.collectionId}
                type="charity"
                onSave={() => setLastSaved((prev) => ({ ...prev, [language]: new Date() }))}
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
    </div>
  );
}