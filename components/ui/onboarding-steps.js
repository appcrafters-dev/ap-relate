import { CheckCircleIcon } from "@heroicons/react/20/solid";

export default function OnboardingSteps({ steps, currentStep }) {
  const stepsArray = Object.values(steps);
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {stepsArray.map((key, idx) => (
          <li key={idx} className="md:flex-1">
            {idx < currentStep ? (
              <div className="group flex flex-col border-l-4 border-tfm-secondary py-2 pl-4  md:border-l-0 md:border-b-4 md:pl-0 md:pb-4 md:pt-0">
                <span className="inline-flex items-center font-brand text-sm font-semibold uppercase tracking-wider text-tfm-secondary md:justify-between">
                  Step {idx + 1}{" "}
                  {idx + 1 < currentStep && (
                    <CheckCircleIcon className="ml-2 h-4 w-4" />
                  )}
                </span>
                <span className="pt-1 text-sm font-medium">{key.title}</span>
              </div>
            ) : (
              <div className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 md:border-l-0 md:border-b-4 md:pl-0 md:pt-0 md:pb-4">
                <span className="font-brand text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Step {idx + 1}
                </span>
                <span className="pt-1 text-sm font-medium">{key.title}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
