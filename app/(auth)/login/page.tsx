import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Form from './form';

export default async function LoginPage() {
 const session = await getServerSession();
 console.log(session);
 if(session) {
    redirect("/")
 }
 return (
   <Form /> 
 );
}