'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import NonUserButton from "@/app/components/NonUserButton";
import { useTranslation } from '@/app/hooks/useTranslation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
  type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Loader2 } from 'lucide-react';

// --- Helper component for spinners ---
const SectionSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

// --- Type Definitions (no change) ---
interface Collectible {
  collectibleId: number;
  name: { en: string; de: string; };
  description: { en: string; de: string; };
  imageRef?: {
    url: string;
    img: string;
  };
}

interface Collection {
  collectionId: number;
  name: { en: string; de: string; };
  description: { en: string; de: string; };
  imageRef?: {
    url: string;
    img: string;
  };
}

// Component no longer receives props
export default function HomePageClient() {
  const { translate, language } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [api, setApi] = useState<CarouselApi>()

  // --- State for Data ---
  const [featuredCollectibles, setFeaturedCollectibles] = useState<Collectible[]>([]);
  const [featuredCollections, setFeaturedCollections] = useState<Collection[]>([]);
  const [collectionCollectibleIds, setCollectionCollectibleIds] = useState<number[]>([]);
  
  // --- Granular Loading States ---
  const [loadingStates, setLoadingStates] = useState({
    hero: true,
    projects: true,
    donators: true,
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      const collectionsRes = await fetch('/api/db/collection?limit=2');
      const collectionsData = await collectionsRes.json();
      
      const idsPromises = collectionsData.map(async (collection: Collection) => {
        const res = await fetch(`/api/db/collectible?collectionId=${collection.collectionId}`);
        const collectibles = await res.json();
        return collectibles.length > 0 ? collectibles[0].collectibleId : null;
      });
      const resolvedIds = (await Promise.all(idsPromises)).filter(id => id !== null);

      setFeaturedCollections(collectionsData);
      setCollectionCollectibleIds(resolvedIds as number[]);
      setLoadingStates(prev => ({...prev, hero: false}));
    };

    const fetchProjectsData = async () => {
      const res = await fetch('/api/db/collectible');
      const data = await res.json();
      setFeaturedCollectibles(data.slice(0, 3));
      setLoadingStates(prev => ({...prev, projects: false}));
    };

    const fetchDonatorsData = async () => {

      setLoadingStates(prev => ({...prev, donators: false}));
    };

    fetchHeroData().catch(console.error);
    fetchProjectsData().catch(console.error);
    fetchDonatorsData().catch(console.error);

  }, []);
 
  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      console.log("Carousel slide changed to:", api.selectedScrollSnap() + 1)
    })
  }, [api])

  const getLocalizedString = (obj: { en: string; de: string; }, lang: 'en' | 'de') => {
    return obj[lang] || obj.en;
  };

  return (
    <div className="font-sans">

        <section className="w-full pt-5 bg-zinc-50 dark:bg-zinc-900">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                  <p className="text-3xl sm:text-4xl font-bold text-red-500 tracking-tight">
                    MAIN PAGE PREVIEW
                  </p>
            </div>
          </div>
        </section>

        <section className="w-full">
              <div className="w-full h-60 relative">
                 <Image src="/images/ubuCover.jpeg" alt="coverImage" fill style={{objectFit:"cover"}}/>
              </div>
        </section>

        {/* --- Hero Section --- */}
        <section className="w-full py-12 md:py-20 bg-zinc-50 dark:bg-zinc-900">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                {translate("homePageClient-featuredProjectTitle-1")}
              </h2>
            </div>
            {loadingStates.hero ? <SectionSpinner /> : (
              <Carousel className="w-full" opts={{align: "start",loop: true,}} plugins={[Autoplay({delay: 8000,})]}>
                <CarouselContent>
                  {featuredCollections.map((collection, index) => (
                    <CarouselItem key={collection.collectionId}>
                      <div className="w-full flex flex-col md:flex-row justify-between gap-8 md:gap-12 lg:gap-6 p-1">
                        {collection.imageRef && (
                          <div className="md:w-1/2 flex justify-center items-center">
                            <Link href={`/preview/campaign/${collectionCollectibleIds[index]}`} className="hover:underline">
                              <Image 
                                src={collection.imageRef.img} 
                                alt="hero collection"
                                className="rounded-lg shadow-2xl w-full max-w-md"
                                width={500}
                                height={500}
                              />
                            </Link>
                          </div>
                        )}
                        <div className="w-full">
                          <Card className="bg-card flex flex-col shadow-lg h-full">
                            <div className="py-5 pl-10 pr-10 text-left flex flex-col flex-grow justify-between min-h-0">
                               <div className="overflow-y-auto"
                                 dangerouslySetInnerHTML={{ __html: collection ? getLocalizedString(collection.description, language) : "Default description..." }}
                               >
                              </div>
                              <div className="mt-auto pt-4">
                                <NonUserButton label={translate("homePageClient-learnMoreButton-1")} route={`/campaign/${collectionCollectibleIds[index]}`} />
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="pt-4">
                <CarouselDots />
                </div>
              </Carousel>
            )}
          </div>
        </section>

         {/* --- About Section (Static, no loading needed) --- */}
        <section id="about" className="w-full py-12 md:py-20 bg-background">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                {translate("homePageClient-aboutTitle-1")}
              </h2>
            </div>
            <div className="w-full flex flex-col-reverse md:flex-row justify-between gap-8 md:gap-12 lg:gap-6 p-1">
              <div className="md:w-full flex">
                <Card className="bg-card flex flex-col shadow-lg h-full">
                  <div className="py-5 pl-10 pr-10 text-left flex flex-col flex-grow justify-between">
                    <div
                      className="mb-8"
                      dangerouslySetInnerHTML={{ __html: translate("homePageClient-aboutDescription-1") }}
                    />
                    <NonUserButton label={translate("homePageClient-learnMoreButton-1")} route='https://www.ubunation.com/' isLink={true} />
                  </div>
                </Card>
              </div>
               <div className="md:w-1/2">
                <Link href='https://www.ubunation.com/' target='_blank' className="hover:underline">
                  <Image 
                    src='/images/logoBig.png' 
                    alt="About Us"
                    className="rounded-lg shadow-2xl w-full max-w-md"
                    width={500}
                    height={500}
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- Charity Campaigns Section --- */}
        <section id="projects" className="w-full py-12 md:py-20 bg-zinc-50 dark:bg-zinc-900">
          <div className="container flex-grow p-6 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                {translate("homePageClient-projectsTitle-1")}
              </h2>
            </div>
            {loadingStates.projects ? <SectionSpinner /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCollectibles.map(collectible => (
                  <Link key={collectible.collectibleId} href={`/preview/campaign/${collectible.collectibleId}`}>
                    <Card className="bg-card w-full flex flex-col overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl">
                        {collectible.imageRef && (
                              <Image 
                                  src={collectible.imageRef.img}
                                  alt={getLocalizedString(collectible.name, language)} 
                                  className="w-full h-56 object-cover"
                                  width={500}
                                  height={500}
                              />
                        )}
                        <div className="bg-blue-600 text-white text-center py-2 font-semibold">
                            {getLocalizedString(collectible.name, language)}
                        </div>
                        <CardContent className="flex-grow text-center">
                            <p className="pt-6">
                                {getLocalizedString(collectible.description, language).replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                            </p>
                        </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* --- Last Donators Section --- */}
        <section className="w-full py-12 md:py-20 bg-background">
          <div className="container flex-grow p-6 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                {translate("homePageClient-donatorsTitle-1")}
              </h2>
            </div>
            <div className="text-center mb-12"><p className="text-2xl text-foreground">( Last Donators Appear Here in the App )</p></div>
          </div>
        </section>
    </div>
  );
}