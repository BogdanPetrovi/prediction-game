import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div className="hidden 2xl:block">
        <Image
          className="absolute left-6 top-100 -z-10"
          width={300}
          height={300}
          alt="logo"
          src={'/event_logo.png'}
        />
      </div>
      <div className="hidden 2xl:block">
        <Image
          className="absolute right-6 top-100 -z-10"
          width={300}
          height={300}
          alt="logo"
          src={'/event_logo.png'}
        />
      </div>
    </>
  );
}