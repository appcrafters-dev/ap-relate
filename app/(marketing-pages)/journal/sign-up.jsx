import { Button } from "@/components/ui/buttons";
import { TfmInput } from "@/components/ui/forms";
import { InboxIcon } from "@heroicons/react/20/solid";

export default function NewsletterSignup() {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center space-y-8 py-8">
      <h2 className="text-center font-brand text-4xl tracking-tight sm:text-5xl lg:text-left xl:text-6xl">
        Sign up for our newsletter
      </h2>
      <form className="relative block w-full items-center">
        <TfmInput
          id="newsletter_email"
          type="email"
          placeholder="Enter your email..."
          required
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 transform">
          <Button type="submit" primary small Icon={InboxIcon}>
            Subscribe
          </Button>
        </div>
      </form>
    </section>
  );
}
