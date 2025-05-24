import { Collectible } from "./collectible"
import { inter, interTight } from './fonts'
import { getServerSession } from 'next-auth';

async function getCollectibleUrl(): Promise<string | null> { // Declare return type as Promise<string | null>
  try {
    const session = await getServerSession(); // Make sure getServerSession is properly imported and configured
    const userEmail = session?.user?.name; // Use optional chaining for safety

    if (!userEmail) {
      console.warn("User email not found in session.");
      return null; // Return null if no user email
    }

    // --- Fetch User Data ---
    const userResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/db/user?email=${userEmail}`, {
      method: 'GET',
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      throw new Error(`Failed to fetch user: ${userResponse.status} - ${errorText}`);
    }
    const userData = await userResponse.json();
    const userId = userData.userId;

    if (!userId) {
      console.warn("User ID not found for email:", userEmail);
      return null;
    }

    // --- Fetch User Collectible Data ---
    const userCollectibleResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/db/userCollectible?userId=${userId}`, {
      method: 'GET'
    });

    if (!userCollectibleResponse.ok) {
      const errorText = await userCollectibleResponse.text();
      throw new Error(`Failed to fetch user collectible: ${userCollectibleResponse.status} - ${errorText}`);
    }
    const userCollectibleData = await userCollectibleResponse.json();
    const collectibleId = userCollectibleData.collectibleId;

    if (!collectibleId) {
      console.warn("Collectible ID not found for user:", userId);
      return null;
    }

    // --- Fetch Collectible Data ---
    const collectibleResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/db/collectible?collectibleId=${collectibleId}`, {
      method: 'GET'
    });

    if (!collectibleResponse.ok) {
      const errorText = await collectibleResponse.text();
      throw new Error(`Failed to fetch collectible details: ${collectibleResponse.status} - ${errorText}`);
    }
    const collectibleData = await collectibleResponse.json();
    const collectibleUrl = collectibleData.objectUrl;

    return collectibleUrl; // This now returns from the main async function
  } catch (error) {
    console.error("Error in getCollectibleUrl:", error);
    // Depending on your error handling strategy, you might rethrow, return null, or a default value
    return null; // Return null on error, or throw error if you want to propagate it
  }
}

export default async function RootPage() {
  const check = await getCollectibleUrl();
  console.log(JSON.stringify(check));
  const interFont = inter;
  const interTightFont = interTight;
  const getUrl = await getCollectibleUrl()

  return <div>
    <section className="Collectible Preview pt-6"><Collectible url={getUrl ? getUrl : 'https://deins.s3.eu-central-1.amazonaws.com/Objects3d/kloppocar/KloppoCar_01.gltf'} /></section>
    <section className={`${interTightFont.className} flex justify-center items-center` }>
      <p className="text-2xl" >
        Wer sammelt, gewinnt
      </p>
      </section>
      <section className={`${interFont.className}`}>
       <div className="flex justify-center items-center"> <p className=" pt-6 text-l text-bold font" >
         Und du hast gerade deinen ersten Schritt gemacht
        </p></div>
        <div className="flex justify-center items-center max-w-200 mx-auto"> <p className=" pt-6 text-l font" >
         Mit jeder weiteren Karte wächst deine Chance auf das Treffen mit <span className='font-bold'>Jürgen Klopp und andere exklusive Preise.</span> Tausche, sammle und sichere dir deinen Platz, sobald unsere App verfügbar ist. Wenn es soweit ist, informieren wir dich.
        </p></div>
      </section>
    
  </div>
  
 }