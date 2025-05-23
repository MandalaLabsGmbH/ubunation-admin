import { Collectible } from "./collectible"
import { inter, interTight } from './fonts'

export default async function RootPage() {
  const interFont = inter;
  const interTightFont = interTight;

  return <div>
    <section className="Collectible Preview pt-6"><Collectible /></section>
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