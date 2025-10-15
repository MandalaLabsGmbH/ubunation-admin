'use client'

import { useState, useEffect } from 'react'; // Import useState
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/app/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { VideoIframe } from '@/components/ui/videoIframe';
import { useTranslation } from '@/app/hooks/useTranslation';
import SplitsView from '../SplitsView';
import ImageCarouselGallery from '../ImageCarouselGallery';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { CheckCircle, X } from 'lucide-react';
import { SocialIcon } from '@/components/ui/social-icons';

// --- Type Definitions ---
interface Sponsor {
    sponsorId: number;
    name: { en: string; de: string; };
    description: { en: string; de: string; };
    organization: { type: string; collectionId: string; };
    urls: { website: string; };
    imageRef?: { 
        profile: string;
        [key: string]: string; // Allow for gallery1, gallery2, etc.
    };
    vidRef?: { [key: string]: string };
  };

interface Collection {
    collectionId: number;
    name: { en: string; de: string; };
    imageRef?: { [key: string]: string }; 
    embedRef?: { [key: string]: string };
    vidRef?: { [key: string]: string };
}

interface CampaignTemplateProps {
  collectible: {
    collectibleId: number;
    name: { en: string; de: string; };
    description: { en: string; de: string; };
    imageRef?: { url: string; img: string };
    embedRef?: { [key: string]: string };
    price?: { base: string };
  },
  sponsors: Sponsor[];
  collection: Collection | null;
}

export default function CampaignTemplate({ collectible, sponsors, collection }: CampaignTemplateProps) {
  const { translate, language } = useTranslation();
  const { addToCart } = useCart();
  const [isAddedToCartModalOpen, setIsAddedToCartModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    api.on("select", onSelect)
    api.on("reInit", onSelect) // Handle re-initialization on resize
    onSelect(); // Set initial state
  }, [api])

  const charitySponsor = sponsors.find(s => s.organization.type === 'charity');
  
  const galleryImages: string[] = [];
  if (charitySponsor?.imageRef) {
      for (let i = 1; i <= 8; i++) {
          if (charitySponsor.imageRef[`gallery${i}`]) {
              galleryImages.push(charitySponsor.imageRef[`gallery${i}`]);
          }
      }
  }

  const socialLinks: { name: string; url: string }[] = [];
  if (collectible?.embedRef) {
      let i = 1;
      while (collectible.embedRef[`social${i}`]) {
          const socialName = collectible.embedRef[`social${i}`];
          const socialUrl = collectible.embedRef[`socialUrl${i}`];
          if (socialName && socialUrl) {
              socialLinks.push({ name: socialName, url: socialUrl });
          }
          i++;
      }
  }
  
  if (!collectible) {
    return <div>Loading...</div>;
  }

  const displayName = collectible.name[language as 'en'|'de'] || collectible.name.en;
  const displayDescription = collectible.description[language as 'en'|'de'] || collectible.description.en;
  const itemPrice = parseFloat(collectible.price?.base || '0');
  
  // const handleImageClick = (imageUrl: string) => {
  //   setSelectedImage(imageUrl);
  // };

  const closeModal = () => {
    setSelectedImage(null);
  };


   // Dynamically get the raffle description based on language
  const raffleDescription = collection?.embedRef?.[language as 'en'|'de'] || collection?.embedRef?.['en'] || '';

  // Dynamically create an array of prize image URLs
  const prizes = sponsors.filter(s => s.organization.type === 'prize');
  const prizeImages = prizes.map((prize) => {
     return prize.imageRef ? prize.imageRef.profile : "https://ubunation.s3.eu-central-1.amazonaws.com/collections/founder/ubunation4.gif"
  });

  const handleAddToCart = () => {
    addToCart({
      collectibleId: collectible.collectibleId,
      name: displayName,
      imageUrl: collectible.imageRef?.img || '',
      price: itemPrice,
    });
    setIsAddedToCartModalOpen(true); // Open the custom modal instead of an alert
  };

  const handleCheckout = () => {
      setIsAddedToCartModalOpen(false);
  }

  const voices = sponsors.filter(s => s.organization.type === 'voices');
  const price = `: $${itemPrice}` || '';


  return (
    <>
      <div className="w-full">
            <section className="w-full py-12 md:py-20 bg-white">
              <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                    {displayName}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:flex gap-8">
                  <div className="md:col-span-1 lg:w-1/3">
                    <Card className="bg-card shadow-lg rounded-lg overflow-hidden">
                      <Image
                        src={collectible.imageRef?.img || ''}
                        alt={displayName}
                        width={800}
                        height={800}
                        className="w-full h-auto"
                      />
                    </Card>
                    <div className="pt-10 flex gap-2">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-transform transform hover:scale-105" onClick={handleAddToCart}>
                        {translate("campaignTemplate-buyNowButton-1")}{price}
                      </Button>
                  </div>
                  </div>
                  <div className="md:col-span-2 lg:w-2/3 flex">
                    <Card className="bg-card shadow-lg rounded-lg w-full flex flex-col">
                      <CardContent className="p-6 md:p-8 flex-grow">
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: displayDescription }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </section>

            {sponsors && sponsors.length > 0 && (
            <section className="w-full py-12 md:py-20 bg-zinc-50 dark:bg-zinc-900">
              {sponsors.map((sponsor) => (
                sponsor.organization.type === 'charity' && (
              <div key={sponsor.sponsorId} className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                    {translate("campaignTemplate-charityTitle-1")} {sponsor.name[language as 'en'|'de'] || sponsor.name.en}
                  </h2>
                </div>
                <Card className="bg-card flex flex-col-reverse lg:flex-row md:justify-center md:items-center lg:justify-start lg:items-start shadow-lg p-6 md:p-8 gap-8">
                    {/* Left Column: Text and Video */}
                    <div className="md:w-3/4 flex flex-col gap-6">
                        <div 
                            className="prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: sponsor.description[language as 'en'|'de'] || sponsor.description.en }}
                        />
                      {sponsor.vidRef?.campaignVid && (
                        <div className="mt-6">
                          <VideoIframe url={sponsor.vidRef.campaignVid} />
                        </div>
                      )}
                    </div>
                    {/* Right Column: Image */}
                    <div className="md:w-1/3 flex flex-col items-center justify-start">
                        <Link href={sponsor.urls.website || '#'} target="_blank" className="hover:underline">
                            <Image 
                                src={sponsor.imageRef?.profile || ''} 
                                alt="Charity Image"
                                className="w-full h-auto max-w-md"
                                width={500}
                                height={500}
                            />
                        </Link>
                        {socialLinks.length > 0 && (
                            <div className="flex mw-20 items-center gap-4 mt-4">
                                {socialLinks.map((link, index) => (
                                    <Link key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors">
                                        <span className="sr-only w-auto">{link.name}</span>
                                        <SocialIcon name={link.name} className='w-6 h-6' />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
                
                <div className="mt-12">
                  <ImageCarouselGallery images={galleryImages} />
                </div>
              </div>
              )))}
            </section>
            )}

            {/* --- Raffle and Rewards Section --- */}
        {sponsors && sponsors.length > 0 && (
        <section className="w-full py-12 md:py-20 bg-white">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                {translate("campaignTemplate-raffle-title-1")}
              </h2>
            </div>
            <div className="w-full flex flex-col-reverse md:flex-row justify-between gap-12 lg:gap-6 p-1">
              <div className="md:w-full">
                <Card className="bg-card flex flex-col shadow-lg w-full">
                    <CardContent className="p-6 md:p-8 flex-grow">
                        <div
                            className="prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: raffleDescription }}
                        />
                    </CardContent>
                </Card>
                <div className="mt-12">
                  <ImageCarouselGallery images={prizeImages} />
                </div>
              </div>
              {/* <div className="pl-5 md:w-1/2 flex justify-center items-center">
                {prizeImages.length > 0 ? (
                    <Carousel
                        className="w-full max-w-md"
                        opts={{ loop: true }}
                        plugins={[Autoplay({ delay: 8000, stopOnInteraction: false })]}
                    >
                        <CarouselContent>
                            {prizeImages.map((imgSrc, index) => (
                                <CarouselItem key={index}>
                                    <Card className="overflow-hidden rounded-lg shadow-2xl" onClick={() => handleImageClick(imgSrc)}>
                                        <Image 
                                            src={imgSrc} 
                                            alt={`Raffle prize ${index + 1}`}
                                            width={500}
                                            height={500}
                                            className="w-full h-full object-cover aspect-square"
                                        />
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute md:-left-8 left-2 top-1/2 -translate-y-1/2 z-10" />
                        <CarouselNext className="absolute md:-right-8 right-2 top-1/2 -translate-y-1/2 z-10" />
                    </Carousel>
                ) : (
                    // Fallback if no prize images are found
                    <Image 
                      src='/images/ubuLion.jpg' 
                      alt="Raffle placeholder"
                      className="rounded-lg shadow-2xl w-full max-w-md"
                      width={500}
                      height={500}
                    />
                )}
              </div> */}
            </div>
          </div>
        </section>
        )}

            {voices.length > 0 && (
            <section className="w-full py-12 md:py-20 bg-zinc-50 dark:bg-zinc-900">
              <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="bg-card p-10 shadow-lg rounded-lg">
                    <h2 className="text-xl font-semibold text-foreground mb-6">{translate("campaignTemplate-sponsorsTitle-1")}</h2>
                    <div dangerouslySetInnerHTML={{ __html: translate("campaignTemplate-sponsorsDescription-1") }}>
                    </div>
                      <Carousel
                        setApi={setApi}
                        className="w-full"
                        opts={{ align: "start" }}
                      >
                        <div className={`flex-auto ${voices.length <= 5 ? 'justify-center' : ''}`}>
                          <CarouselContent className="-ml-4">
                            {voices.map((sponsor) => (
                                <CarouselItem key={sponsor.sponsorId} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                                  <Card key={sponsor.sponsorId} className="bg-card pt-5 pl-5 pr-5 flex flex-col items-center h-100 lg:h-120 transform hover:-translate-y-2 transition-transform duration-300 ease-in-out hover:shadow-2xl">
                                    <Card className="aspect-square w-full justify-center items-center overflow-hidden rounded-full shadow-lg p-2">
                                      <div className="relative w-full">
                                        <Link href={`${sponsor.urls.website}`} target="_blank" className="hover:underline">
                                          <Image
                                            src={sponsor.imageRef?.profile || ''  }
                                            alt={`${sponsor.name.en} logo`}
                                            width={200}
                                            height={300}
                                            className="object-cover scale-120"
                                          />
                                        </Link>
                                      </div>
                                    </Card>
                                    <div className="flex flex-col items-center text-center mt-2">
                                        <p className="text-med font-medium">{sponsor.name.en}</p>
                                    </div>
                                      <div className="flex flex-col w-30 items-center text-center">
                                        <p className="text-sm ">{sponsor.description.en}</p>
                                    </div>
                              </Card>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                        </div>
                        {canScrollPrev && <CarouselPrevious className="absolute md:-left-8 top-1/2 -translate-y-1/2 z-10" />}
                        {canScrollNext && <CarouselNext className="absolute md:-right-8 top-1/2 -translate-y-1/2 z-10" />}
                      </Carousel>
                </Card>
              </div>
            </section>
                    )}

          <section className="w-full py-12 md:py-20 bg-white">
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-center mb-12">
                {translate("campaign-recentDonators-header-1")}
              </h2>
              <div className="max-h-[480px] overflow-y-auto pr-4">
                <div className="text-center mb-12"><p className="text-2xl text-foreground">( Last Donors Appear Here in the App )</p></div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-20 bg-zinc-50 dark:bg-zinc-900">
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <SplitsView />
            </div>
          </section>
      </div>
    
      {isAddedToCartModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <Card className="relative bg-background rounded-lg shadow-xl p-8 w-full max-w-lg mx-4 text-center">
            <button onClick={() => setIsAddedToCartModalOpen(false)} className="absolute top-4 right-4  hover:text-foreground">
              <X className="h-6 w-6" />
            </button>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-6">{translate("donateNow-popup-title-1")}</h2>
            <div>
              <p className="text-xl mb-6">{translate("donateNow-popup-description-1")}</p>
            </div>
            <div className="flex justify-center gap-4">
                <Button 
                    onClick={() => setIsAddedToCartModalOpen(false)}
                    className="w-1/2 h-auto bg-orange-500 whitespace-normal sm:whitespace-nowrap hover:bg-orange-600 px-8 py-3 text-sm font-semibold shadow-lg transition-transform transform hover:scale-105"
                >
                    {translate("donateNow-popup-continue-1")}
                </Button>
                <Button 
                    onClick={handleCheckout}
                    className="w-1/2 h-auto bg-orange-500 whitespace-normal sm:whitespace-nowrap hover:bg-orange-600 px-8 py-3 text-sm font-semibold shadow-lg transition-transform transform hover:scale-105"
                >
                    {translate("donateNow-popup-checkout-1")}
                </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Enlarged Image Modal */}
            {selectedImage && (
              <div
                className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center p-4 cursor-pointer"
                onClick={closeModal}
              >
                <Card
                  className="relative bg-background rounded-lg shadow-xl w-auto h-auto max-w-[75vw] max-h-[75vh] p-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={closeModal}
                    className="absolute -top-3 -right-3 z-10 bg-background rounded-full p-1 text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <div className="relative w-full h-full">
                    <Image
                      src={selectedImage}
                      alt="Enlarged gallery view"
                      width={1200}
                      height={800}
                      className="object-contain w-full h-full max-w-[calc(75vw-1rem)] max-h-[calc(75vh-1rem)]"
                    />
                  </div>
                </Card>
              </div>
            )}
    </>
  )
}