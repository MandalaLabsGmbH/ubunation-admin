'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CampaignTemplate from '@/app/components/CampaignTemplate';
import ModifyCollectibleModal from '@/app/components/content/ModifyCollectibleModal';
import { Collectible } from '@/app/(pages)/content/page';

interface PreviewPageClientProps {
  collectible: Collectible;
}

export default function PreviewPageClient({ collectible }: PreviewPageClientProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  // This function is called when the modification modal is closed.
  const handleModalClose = () => {
    setModalOpen(false);
    // Refresh the page data from the server to show the latest changes.
    router.refresh();
  };

  const handleSaveSuccess = () => {
      setModalOpen(false); // Close the modal
      router.refresh(); // Tell Next.js to re-fetch the data for this page
  };

  // Safely extract the English strings for rendering.
  // Provide default fallbacks in case the data is missing.
  const nameEn = collectible.name?.en || 'No Name Provided';
  const descriptionHtmlEn = collectible.description?.en || '<p>No description available.</p>';
  const imageUrl = collectible.imageRef?.url || '/images/placeholder.png'; // A fallback image

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Link href="/content" className="text-blue-600 hover:underline font-semibold">
          &larr; Back to Content
        </Link>
        <Button onClick={() => setModalOpen(true)}>Modify Collectible</Button>
      </div>

      {/* Pass the extracted English strings to the display template */}
      <CampaignTemplate
        collectibleId={collectible.collectibleId}
        name={nameEn}
        imageUrl={imageUrl}
        descriptionHtml={descriptionHtmlEn}
      />

      {/* The modal is only rendered when the button is clicked */}
      {isModalOpen && (
        <ModifyCollectibleModal
          collectible={collectible}
          onClose={handleModalClose}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}