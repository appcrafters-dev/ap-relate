import Logo from "@/components/logo";

export default function OnboardingLayout({ children }) {
  return (
    <main className="mx-auto my-8 max-w-4xl space-y-12 px-4 py-12">
      <div className="mx-auto max-w-xs px-8">
        <Logo />
      </div>
      {children}
    </main>
  );
}
