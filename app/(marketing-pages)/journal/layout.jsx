import NewsletterSignup from "./sign-up";

export default function JournalLayout({ children }) {
  return (
    <div className="container mt-20 space-y-16 py-16">
      {children}
      <NewsletterSignup />
    </div>
  );
}
