export default async function VideoComponent() {
    const src = "https://www.youtube.com/embed/EUlZLJy-3-0?si=dL7QR2dtLTudnMZ0&amp;controls=0&amp;autoplay=1"
   
    return <iframe height='250' style={{ width: '100%', height: '250' }} src={src} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
  }