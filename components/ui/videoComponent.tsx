export default async function VideoComponent(url: string ) {
   
    return (
      <video controls preload="none" aria-label="Video player">
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    )
  }