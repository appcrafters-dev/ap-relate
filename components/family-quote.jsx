import { prettyDate } from "lib/date";
import { classNames } from "lib/utils";

function Avatar({ src, name }) {
  if (src) {
    return (
      <img
        className="h-10 w-10 rounded-full object-cover ring-1 ring-white lg:h-20 lg:w-20 lg:ring-2"
        src={src}
        alt={name + " Avatar"}
      />
    );
  } else {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-tfm-sand ring-2 ring-white lg:h-16 lg:w-16">
        <span className="text-xl font-medium uppercase leading-none tracking-widest text-white lg:text-3xl">
          {name && name.charAt(0)}
        </span>
      </span>
    );
  }
}

export default function FamilyQuote({ quote, rightAlign = false }) {
  return (
    <div className="mx-auto flex max-w-xl rounded bg-white p-8 align-middle shadow-md transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl lg:p-12">
      <div
        className={classNames(
          "relative lg:flex lg:items-center",
          rightAlign ? "flex-row-reverse" : ""
        )}
      >
        <div className="hidden lg:block lg:flex-shrink-0">
          <Avatar
            src={quote.family_member.avatar_url}
            name={quote.family_member.first_name}
          />
        </div>

        <div
          className={classNames(
            "relative",
            rightAlign ? "lg:mr-10" : "lg:ml-10"
          )}
        >
          <blockquote className="relative">
            <div className="text-lg font-medium leading-6 text-gray-600">
              <p>
                &quot;
                <span dangerouslySetInnerHTML={{ __html: quote.quote }} />
                &quot;
              </p>
            </div>
            <footer className="mt-8">
              <div className="flex">
                <div className="flex-shrink-0 lg:hidden">
                  <Avatar
                    src={quote.family_member.avatar_url}
                    name={quote.family_member.first_name}
                  />
                </div>
                <div className="ml-4 lg:ml-0">
                  <div className="font-subheading text-base font-bold text-tfm-primary">
                    {quote.family_member.first_name}
                  </div>
                  <div className="font-accent text-xs tracking-wide text-black text-opacity-50">
                    {prettyDate(quote.date)}
                  </div>
                </div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
