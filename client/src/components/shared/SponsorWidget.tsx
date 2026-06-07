import Link from "next/link";

export default function SponsorWidget() {
  return (
    <Link href={'https://p.skin.place/svojke'} target="_blank">
      <video
        autoPlay
        loop
        muted
        playsInline
        width="400px"
      >
        <source src="https://countersite.gg/banner.webm" type="video/webm" />
        Tvoj browser ne podržava video.
      </video>
    </Link>
    )
}