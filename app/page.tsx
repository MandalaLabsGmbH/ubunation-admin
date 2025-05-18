import { Collectible } from "./collectible"
import { chakraPetch } from './fonts'

export default function RootPage() {
  const chakra = chakraPetch;
  

  return <div>
    <section className="Collectible Preview pt-6"><Collectible /></section>
    <section className={`${chakra.className} pt-6 flex justify-center items-center` }>
      <p className="text-2xl font-bold" >
        Check out more collectibles soon!
      </p>
      </section>
      <section className={`${chakra.className} pt-6 flex justify-center items-center` }>
      <a className="text-2xl font-bold underline" >
        Download our app soon!
      </a>
      </section>
    
  </div>
  
 }