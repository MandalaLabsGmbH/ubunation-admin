import { notFound } from 'next/navigation';
import PreviewPageClient from './previewPageClient';
import { Collectible } from '@/app/components/content/ContentDropdowns'; // Reuse the type

async function getCollectible(id: string): Promise<Collectible | null> {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/db/collectible?collectibleId=${id}`, {
            // Fetch fresh data every time for the preview
            cache: 'no-store' 
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

export default async function PreviewPage({ params }: { params: { id: string } }) {
    const collectible = await getCollectible(params.id);

    // If no collectible is found, show a 404 page.
    if (!collectible) {
        notFound();
    }

    // Pass the full collectible object to the client component.
    return (
        <PreviewPageClient collectible={collectible} />
    );
}