'use client'

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
// import { useCart } from '@/app/contexts/CartContext';
import { Button } from '@/components/ui/button';

interface CampaignTemplateProps {
  collectibleId: number;
  name: string;
  imageUrl: string;
  descriptionHtml: string;
}

type Tab = 'overview' | 'splits';

export default function CampaignTemplate({ name, imageUrl, descriptionHtml }: CampaignTemplateProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  // const { addToCart } = useCart();

  // const handleAddToCart = () => {
  //   addToCart({
  //     collectibleId: collectibleId,
  //     name: name,
  //     imageUrl: imageUrl,
  //     price: 9.99,
  //   });
  //   alert(`${name} has been added to your cart!`);
  // };

   const handleAddToCart = () => {
    alert(`${name} would have been added to your cart in the real app!`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <Card className="bg-card shadow-lg rounded-lg mb-8">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-48 flex gap-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-transform transform hover:scale-105" onClick={handleAddToCart}>Add to Cart</Button>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{name}</h1>
          </div>
        </CardContent>
      </Card>

       <div className="border-b border-border mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 text-sm font-medium transition-colors
              ${activeTab === 'overview'
                ? 'border-b-2 border-primary text-primary'
                : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('splits')}
            className={`py-4 px-1 text-sm font-medium transition-colors
              ${activeTab === 'splits'
                ? 'border-b-2 border-primary text-primary'
                : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Splits
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1">
              <Card className="bg-card shadow-lg rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={name}
                  width={800}
                  height={800}
                  className="w-full h-auto"
                />
              </Card>
            </div>
            <div className="md:col-span-2">
              <Card className="bg-card shadow-lg rounded-lg w-full">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Description</h2>
                  {/* FIX: Use dangerouslySetInnerHTML to render the HTML string */}
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'splits' && (
          <Card className="bg-card shadow-lg rounded-lg">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Coming soon!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}