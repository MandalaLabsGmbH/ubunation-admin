import Link from "next/link"

export default function Footer() {

return <footer>
    <section className={ `footer pt-10 pb-10 pr-20 pl-20 md:flex md:justify-center md:flex-row md:max-w-200 md:mx-auto items-center` }>
      <div className="flex justify-center items-center">
      <p className="text-base" >
        © UBUNΛTION 2025
      </p>
      </div>
      <div className="flex justify-center items-center md:pl-20">
      <Link href="https://www.instagram.com/ubunation" className="text-base text-kloppocar-orange" >
        Instagram
      </Link>
      </div>
    </section>
</footer>
}