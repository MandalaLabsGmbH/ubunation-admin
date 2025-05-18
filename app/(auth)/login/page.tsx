import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Form from './form';

export default async function LoginPage() {
 const session = await getServerSession();
 console.log(session);
 if(session) {
    redirect("/")
 }
 return (
    <div className="page">
    <div className="headerBannerImage">
        <Image alt='Header Banner Image' src="/images/carheader.jpg"  width={0}
  height={0}
  sizes="100vw"
  style={{ width: '100%', height: 'auto' }}/>
    </div>

    
   <Form /> 
   </div>
 );
}