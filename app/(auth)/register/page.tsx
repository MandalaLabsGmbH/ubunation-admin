import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { chakraPetch } from '../../fonts'
import Form from './form';
import Image from 'next/image';
import { Suspense } from 'react'

export default async function RegisterPage() {
 const session = await getServerSession();
 const chakra = chakraPetch;
 if(session) {
    redirect("/")
 }
 return (
  <div className="page">
      <section className="headerBannerImage">
          <Image alt='Header Banner Image' src="/images/carheader.jpg"  width={0}
    height={0}
    sizes="100vw"
    style={{ width: '100%', height: 'auto' }}/>
      </section>
      <section className="registerVid pt-6 flex justify-center items-center h-150" >
      <Suspense fallback={<p>Loading video...</p>}>
      <video className="h-150" autoPlay muted loop preload="none" aria-label="Video player">
        <source src={'https://deins.s3.eu-central-1.amazonaws.com/video/card/spinCard.mp4'} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      </Suspense>
      {/* Other content of the page */}
    </section>
    <section className={`${chakra.className} pt-6 flex justify-center items-center` }>
      <p className="text-6xl font-bold" >
        DEINS
      </p>
      </section>
     <Form /> 
     </div>
 );
}