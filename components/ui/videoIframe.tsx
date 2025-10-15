interface VideoIframeProps {
  url: string;
}

export function VideoIframe({ url }: VideoIframeProps) {
  return (
    // This container enforces a 16:9 aspect ratio and scales with width
    <div className="aspect-video w-full">
      <iframe
        src={url}
        title="Campaign Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg"
      ></iframe>
    </div>
  );
}