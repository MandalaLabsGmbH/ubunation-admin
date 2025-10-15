import CampaignTemplate from '@/app/components/preview/CampaignTemplate';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// --- Type Definitions ---
interface Collectible {
  collectibleId: number;
  collectionId: number;
  name: { en: string; de: string; };
  description: { en: string; de: string; };
  imageRef?: {
    url: string;
    img: string;
  };
  price?: { base: string };
}

interface Sponsor {
    sponsorId: number;
    name: { en: string; de: string; };
    description: { en: string; de: string; };
    organization: { type: string; collectionId: string; };
    urls: { website: string; };
    imageRef?: { profile: string; };
    vidRef?: { [key: string]: string };
  };

// MODIFIED: Updated Collection type
interface Collection {
    collectionId: number;
    name: { en: string; de: string; };
    imageRef?: { [key: string]: string };
    embedRef?: { [key: string]: string };
    vidRef?: { [key: string]: string };
}

type CampaignPageProps = {
  params: Promise<{ id: string }>;
};

// --- Data Fetching Functions ---
async function getCollectible(id: string): Promise<Collectible | null> {
    try {
        const baseUrl = process.env.NEXTAUTH_URL;
        const res = await fetch(`${baseUrl}/api/db/collectible?collectibleId=${id}`, { cache: 'no-store' });
        
        if (!res.ok) {
            console.error(`API call failed with status: ${res.status}`);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error("Error in getCollectible:", error);
        return null;
    }
}

async function getSponsors(collectionId: number): Promise<Sponsor[]> {
    if (!collectionId) return [];
    try {
        const baseUrl = process.env.NEXTAUTH_URL;
        const res = await fetch(`${baseUrl}/api/db/sponsor?collectionId=${collectionId}`, { cache: 'no-store' });

        if (!res.ok) {
            console.error(`API call failed with status: ${res.status}`);
            return [];
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error in getSponsors:", error);
        return [];
    }
}

async function getCollection(id: number): Promise<Collection | null> {
    try {
        const baseUrl = process.env.NEXTAUTH_URL;
        const res = await fetch(`${baseUrl}/api/db/collection?collectionId=${id}`, { cache: 'no-store' });
        if (!res.ok) {
            console.error(`API call failed with status: ${res.status}`);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error("Error in getCollection:", error);
        return null;
    }
}

// --- Skeleton Component (no change) ---
function CampaignPageSkeleton() {
    return (
        <div className="w-full max-w-7xl mx-auto py-8 px-4 animate-pulse">
            <div className="bg-muted h-20 rounded-lg mb-8"></div>
            <div className="border-b border-border mb-8">
                <div className="flex space-x-8">
                    <div className="h-12 w-24 bg-muted rounded-t-lg"></div>
                    <div className="h-12 w-24 bg-muted rounded-t-lg"></div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1">
                    <div className="bg-muted rounded-lg aspect-square"></div>
                    <div className="pt-10 flex gap-2">
                        <div className="w-full bg-muted h-14 rounded-full"></div>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <div className="bg-muted rounded-lg w-full p-8">
                        <div className="h-8 bg-muted/50 rounded w-1/3 mb-6"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-muted/50 rounded w-full"></div>
                            <div className="h-4 bg-muted/50 rounded w-full"></div>
                            <div className="h-4 bg-muted/50 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Async Data Component (MODIFIED) ---
async function CampaignData({ id }: { id: string }) {
    const collectible = await getCollectible(id);

    if (!collectible || !collectible.imageRef?.img || !collectible.name?.en) {
        notFound();
    }
    
    // Fetch sponsors and collection data in parallel
    const [sponsors, collection] = await Promise.all([
        getSponsors(collectible.collectionId),
        getCollection(collectible.collectionId)
    ]);

    return (
        <CampaignTemplate collectible={collectible} sponsors={sponsors} collection={collection} />
    );
}

// --- Main Page Component (no change) ---
export default async function CampaignPage({ params }: CampaignPageProps) {
    const { id } = await params;
    return (
        <Suspense fallback={<CampaignPageSkeleton />}>
            <CampaignData id={id} />
        </Suspense>
    );
}