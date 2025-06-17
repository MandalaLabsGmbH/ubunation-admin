'use client'

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import UserButton from './UserButton'; // Ensure this path is correct

// Define the props the template will accept
interface CampaignTemplateProps {
  title: string;
  imageUrl: string;
  descriptionHtml: string;
}

type Tab = 'overview' | 'splits';

export default function CampaignTemplate({ title, imageUrl, descriptionHtml }: CampaignTemplateProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      {/* Top Header Section */}
      <Card className="bg-card shadow-lg rounded-lg mb-8">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-32">
              <UserButton label="Donate" route="/purchase" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{title}</h1>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
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

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          // We now use a grid to hold two separate cards
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Image Card */}
            <div className="md:col-span-1">
              <Card className="bg-card shadow-lg rounded-lg overflow-hidden">
                {/* The Image component now dictates the size of the card */}
                <Image
                  src={imageUrl}
                  alt={title}
                  width={800} // Intrinsic width of the image
                  height={800} // Intrinsic height of the image
                  className="w-full h-auto" // Ensures the image is responsive
                />
              </Card>
            </div>

            {/* Right Column: Description Card */}
            <div className="md:col-span-2">
              <Card className="bg-card shadow-lg rounded-lg w-full">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Description</h2>
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