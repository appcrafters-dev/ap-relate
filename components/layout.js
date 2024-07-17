import Logo from "./logo";
import Image from "next/legacy/image";

export function Layout({ children }) {
  return (
    <>
      <div className="h-full">
        <main className="h-full">{children}</main>
      </div>
    </>
  );
}

export function ErrorLayout({ children }) {
  return (
    <>
      <div className="grid h-full min-h-screen w-full lg:grid-cols-2">
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm space-y-8">
            <Logo href="/" width={180} height={50} />
            {children}
          </div>
        </div>
        <div className="relative hidden lg:block">
          <Image
            className="h-full w-full object-cover"
            src="/img/vw-van.jpeg"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </>
  );
}
