export default function DescriptionBlurb({
  heading = "Every family deserves to have healthy, happy and connected relationships.",
  subheading = "A new kind of family meeting",
  description = "Imagine having a trusted coach to guide conversations about your vision, values and game plan for the most important aspects of your life. TFM offers ongoing 90-minute sessions of virtual family coaching. Convenient, modern support to talk about the things you care about most.",
}) {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {subheading && (
          <h2 className="font-accent text-base uppercase tracking-wider text-tfm-secondary">
            {subheading}
          </h2>
        )}
        <h3 className="mt-2 font-brand text-4xl leading-8 text-tfm-primary sm:text-5xl">
          {heading}
        </h3>
        <p className="prose prose-lg mt-5 max-w-full text-gray-600">
          {description}
        </p>
      </div>
    </section>
  );
}
