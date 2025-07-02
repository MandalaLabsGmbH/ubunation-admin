import CampaignTemplate from '@/app/components/CampaignTemplate';
import { notFound } from 'next/navigation';

// Define a type for a single collectible
interface Collectible {
  collectibleId: number;
  name: string;
  description: string;
  imageRef?: {
    url: string;
  };
}

async function getCollectible(id: string): Promise<Collectible | null> {
    // This server-side function fetches data for a single collectible.
    try {
        // The API route is public, so we don't need to pass auth headers.
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/db/collectible?collectibleId=${id}`, {
            cache: 'no-store' // This ensures the page is dynamically rendered with fresh data.
        });

        if (!res.ok) {
            console.error(`Failed to fetch collectible ${id}:`, await res.text());
            return null;
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching collectible:", error);
        return null;
    }
}

// The parameter name in `params` MUST match the dynamic folder name `[id]`
export default async function CampaignPage({ params }: { params: { id: string } }) {
    // We use params.id here now
    const collectible = await getCollectible(params.id);

    // If no collectible is found, or if it's missing essential data, show a 404 page.
    // Added a check for collectible.name to prevent the error.
    if (!collectible || !collectible.imageRef?.url || !collectible.name) {
        notFound();
    }

    // Pass the properties of the collectible object as individual props
    // to the CampaignTemplate.
    return (
        <CampaignTemplate
            collectibleId={collectible.collectibleId}
            name={collectible.name}
            imageUrl={collectible.imageRef.url}
            descriptionHtml={collectible.description}
        />
    );
}
