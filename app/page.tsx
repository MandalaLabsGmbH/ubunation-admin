import { getServerSession } from 'next-auth';

export default async function RootPage() {
  const session = await getServerSession();
  console.log(session);
  return <div>hello, world!</div>
 }