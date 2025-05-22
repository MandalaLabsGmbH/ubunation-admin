import Link from "next/link"

export default function Footer() {

return <footer>
    <section className={ `footer pt-10 pb-10 pr-20 pl-20 md:flex md:justify-between items-center` }>
      <div className="flex justify-center items-center">
      <p className="text-base" >
        © Kloppocar 2025
      </p>
      </div>
      <div className="flex justify-center items-center">
      <Link href="" className="text-base text-kloppocar-orange" >
        Bedingungen
      </Link>
       </div>
       <div className="flex justify-center items-center">
      <Link href="" className="text-base text-kloppocar-orange" >
        Datenschutz!
      </Link>
      </div>
      <div className="flex justify-center items-center">
      <Link href="" className="text-base text-kloppocar-orange" >
        Instagram
      </Link>
      </div>
    </section>
</footer>
}