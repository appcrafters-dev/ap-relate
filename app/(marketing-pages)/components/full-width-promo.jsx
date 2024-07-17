import { LinkButton } from "@/components/ui/buttons";

export default function FullWidthPromo({ title, subtitle, buttons = [] }) {
  return (
    <div className="relative bg-gray-800 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://journal.totalfamily.io/content/images/size/w2000/2024/01/Photo_2023-12-08_165823.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-tfm-primary bg-opacity-75"
      />
      <div className="relative mx-auto flex max-w-lg flex-col items-center space-y-6 pt-12 text-center">
        <h2 className="font-brand text-5xl font-medium leading-tight tracking-tight text-white sm:text-8xl">
          {title}
        </h2>
        <p className="my-4 font-subheading text-lg font-medium uppercase tracking-tight text-gray-200">
          {subtitle}
        </p>
        {buttons.map((btn) => (
          <LinkButton
            key={btn.href}
            href={btn.href}
            primary={btn.primary || false}
          >
            {btn.text}
          </LinkButton>
        ))}
      </div>
    </div>
  );
}
