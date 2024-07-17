import Logo from "./logo";
import { Button, LinkButton } from "@/components/ui/buttons";
import VideoCallReview from "./video-call-review";

export default function VideoCallMessage({
  show = true,
  title = "Loading...",
  message = "Please wait while we load the meeting",
  returnTo = {
    href: "/dashboard",
    text: "Go back to your dashboard",
  },
  showReview = false,
  room = null,
  userName = null,
  children = null,
}) {
  return (
    <div className="min-h-screen w-full flex-col">
      {show && (
        <header className="mt-12 inline-flex w-full items-center justify-center p-4">
          <Logo width={200} height={20} />
        </header>
      )}
      {show && (
        <main className="mt-12 flex w-full flex-col items-center justify-center">
          {title && <h1 className="text-center text-2xl font-bold">{title}</h1>}
          {children}
          {showReview ? (
            <VideoCallReview room={room} userName={userName} />
          ) : (
            message && (
              <div className="z-50 mx-auto flex w-full max-w-md flex-col space-y-4 p-4">
                <p className="text-center">{message}</p>
                {title.includes("Goodbye") && (
                  <Button onClick={() => window.location.reload()}>
                    Join again
                  </Button>
                )}

                {returnTo.href && (
                  <LinkButton primary href={returnTo.href}>
                    {returnTo.text}
                  </LinkButton>
                )}
              </div>
            )
          )}
        </main>
      )}
    </div>
  );
}
