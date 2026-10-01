import Link from "next/link";

export default function SponsorWidget() {
  return (
    <Link href={'https://p.skin.place/svojke'} target="_blank" className="block size-full">
      <video
        autoPlay
        loop
        muted
        playsInline
        width={1000}
        height={300}
        className="size-full"
      >
        <source src="https://countersite.gg/banner.webm" type="video/webm" />
        Tvoj browser ne podržava video.
      </video>
    </Link>
    )
}