import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image'
import { headers } from 'next/headers'; // 1. Import the headers function
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import UserButton from "@/app/components/UserButton";

async function getCollectibleUrl(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }

  try {
    const requestHeaders = await headers();
    const cookie = requestHeaders.get('cookie');
    const apiHeaders = new Headers();
    if (cookie) {
      apiHeaders.append('Cookie', cookie);
    }
    
    const userCollectibleResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/db/userCollectible`, {
      method: 'GET',
      headers: apiHeaders
    });

    if (!userCollectibleResponse.ok) {
      const errorText = await userCollectibleResponse.text();
      console.error("Failed to fetch user collectible:", userCollectibleResponse.status, errorText);
      return null;
    }
    const userCollectibleData = await userCollectibleResponse.json();
    const collectibleId = userCollectibleData.collectibleId;

    if (!collectibleId) {
      console.warn("Collectible ID not found for user.");
      return "Collectible ID not found for user";
    }

    const collectibleResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/db/collectible?collectibleId=${collectibleId}`, {
      method: 'GET',
      headers: apiHeaders, 
    });

    if (!collectibleResponse.ok) {
      const errorText = await collectibleResponse.text();
      console.error("Failed to fetch collectible details:", collectibleResponse.status, errorText);
      return null;
    }
    const collectibleData = await collectibleResponse.json();
    return collectibleData.objectUrl;

  } catch (error) {
    console.error("Error in getCollectibleUrl:", error);
    return null;
  }
}

export default async function UBUNΛTIONRootPage() {
  const check = await getCollectibleUrl();
  console.log('Collectible URL check result:', JSON.stringify(check));
  return (
    <div className="text-gray-800 font-sans">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* --- Hero Section --- */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20 md:mb-32">
          {/* Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              ULT Dream Careers Lion Collection by <span className="text-blue-600">UBUNɅTION</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Get ready for the groundbreaking ULT Dream Careers Lion Collection, where dreams meet impact! Backed by the leading web3 investment firm, LGD DAO, UBUNΛTION is set to make a lasting impact on the lives of underprivileged children in Kenya. Your chance to empower youth, enable education, and make a difference just around the corner. The ULT Dream Careers collection features 10,000 unique digital collectible Lions representing diverse dream careers, all securely stored on the Polygon blockchain. Your donation not only gets you an exclusive digital collectible but also brings life-changing opportunities to the most deserving youth.
            </p>
             <UserButton label="Create Now & Get Your ULT NFT" route='/purchase' />
          </div>
          
          {/* Image Content */}
          <div className="md:w-1/2 flex justify-center">
            <Image 
              src="/images/collect.png" 
              alt="ULT Dream Careers Lion" 
              className="rounded-lg shadow-2xl w-full max-w-md"
              width={500}
              height={500}
            />
          </div>
        </section>

        {/* --- Charity Campaigns Section --- */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Discover UBUNΛTION: Uniting Hearts, Changing Lives –
            </h2>
            <p className="text-xl text-muted-foreground mt-2">
              Explore Our Current Charity Campaigns!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <Card className="bg-white w-full flex flex-col overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl">
                <Image 
                    src="/images/collect.png" 
                    alt="Dream Careers Lion Collection" 
                    className="w-full h-56 object-cover"
                    width={500}
                    height={500}
                />
                 <div className="bg-blue-600 text-white text-center py-2 font-semibold">
                    ULT Dream Careers Lion Collection
                </div>
              <CardContent className="flex-grow text-center">
                <div className="mt-4">
                  <UserButton label="Buy Now" route='/purchase' />
                </div>
                <p className="pt-6 text-gray-600">
                  Empower Change, Join Our Mission to Build a Brighter Future through &apos;Access, Education and Dream for a Brighter Future!&apos;
                </p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="bg-white w-full flex flex-col overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl">
                <Image 
                    src="/images/collect.png" 
                    alt="WFA Springbok" 
                    className="w-full h-56 object-cover"
                    width={500}
                    height={500}
                />
                 <div className="bg-green-500 text-white text-center py-2 font-semibold">
                    WFA Springbok
                </div>
               <CardContent className="flex-grow text-center">
                <div className="mt-4">
                <UserButton label="Buy Now" route='/purchase' />
                </div>
                <p className="pt-6 text-gray-600">
                  Empower Cape Town&apos;s Youth. Support &apos;We Love Football Academy Foundation for Positive Change!&apos;
                </p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="bg-white w-full flex flex-col overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl">
                 <Image
                    src="/images/collect.png"
                    alt="UBUNΛTION Founders Token" 
                    className="w-full h-56 object-cover"
                    width={500}
                    height={500}
                />
                 <div className="bg-indigo-600 text-white text-center py-2 font-semibold">
                    UBUNΛTION Founders Token
                </div>
              <CardContent className="flex-grow text-center">
                <div className="mt-4">
                  <UserButton label="Buy Now" route='/purchase' />
                </div>
                <p className="pt-6 text-gray-600">
                    Join the Movement. Become a UBUNΛTION Founding Partner and Fuel Our &apos;Quest for Good&apos;.
                </p>
              </CardContent>
            </Card>

          </div>
        </section>
      </main>
    </div>
  );
}
