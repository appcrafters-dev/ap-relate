import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="bg-tfm-primary-900 py-16">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between p-4 py-8">
        <div className="w-full text-center md:w-auto md:text-left">
          <h3 className="mb-4 font-brand text-3xl font-medium text-white">
            Total Family Management
          </h3>
          <nav className="my-4 flex flex-col items-center space-y-2 font-subheading font-semibold uppercase text-white md:flex-row md:space-x-6 md:space-y-0">
            <Link className="hover:text-gray-200" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="hover:text-gray-200" href="/client-waiver">
              Terms of Service
            </Link>
            <Link className="hover:text-gray-200" href="/contact-us">
              Contact Us
            </Link>
          </nav>
        </div>
        <small className="w-full text-center font-accent text-xs tracking-wider text-white md:text-left">
          &copy; {new Date().getFullYear()} TFM
        </small>
      </div>
    </footer>
  );
}
