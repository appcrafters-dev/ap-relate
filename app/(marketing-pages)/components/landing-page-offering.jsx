import {
  ClockIcon,
  MapPinIcon,
  AcademicCapIcon,
  HeartIcon,
  CakeIcon,
} from "@heroicons/react/24/outline";
import ImageContainer from "./image-container";
import WorkshopsList from "./session-list";

const strategyFeatures = [
  {
    name: "Eight 90-minute sessions",
    description:
      "Research-backed sessions to discover your family's vision and values.",
    icon: ClockIcon,
  },
  {
    name: "Private, virtual meetings for couples (or singles)",
    description:
      "Video calls built right into our platform, flexible to everyone's schedule.",
    icon: MapPinIcon,
  },
  {
    name: "Led by experienced Coaches",
    description:
      "Intelligent and empathetic coaches who are experts in well-being.",
    icon: AcademicCapIcon,
  },
];
const implementationFeatures = [
  {
    name: "Celebrate key milestones",
    description:
      "A digital record of your family's story, moments, and memories.",
    icon: CakeIcon,
  },
  {
    name: "Share with loved ones",
    description: "Continue a legacy of love and connection.",
    icon: HeartIcon,
  },
];

function Features({ features }) {
  return (
    <dl className="mx-auto mt-10 max-w-lg space-y-10 px-4">
      {features.map((item, idx) => (
        <div key={idx} className="relative">
          <dt>
            <div className="absolute flex h-9 w-9 items-center justify-center rounded bg-tfm-primary-500 bg-opacity-80 text-white">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="ml-12 font-subheading text-lg font-semibold uppercase leading-6 text-gray-700">
              {item.name}
            </p>
          </dt>
          <dd className="ml-12 mt-2 text-base text-gray-500">
            {item.description}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Workshop({
  features,
  title,
  subtitle,
  description,
  img,
  imgWidth,
  imgSwap,
  imgAlt,
  screenshot = false,
}) {
  return (
    <div className="mt-12 lg:mt-24 lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:items-center lg:gap-8">
      <div
        className={
          imgSwap ? "-mx-2 my-10 lg:col-start-2 lg:my-0" : "-mx-2 my-10 lg:my-0"
        }
        aria-hidden="true"
      >
        {screenshot ? (
          <div className="mx-8">
            <ImageContainer url="totalfamily.io" imgSrc={img} imgAlt={imgAlt} />
          </div>
        ) : (
          <img
            className={
              img.endsWith(".svg")
                ? "relative mx-auto"
                : "relative mx-auto rounded shadow-xl"
            }
            width={imgWidth}
            src={img}
            alt={imgAlt}
          />
        )}
      </div>
      <div className={imgSwap && "lg:col-start-1"}>
        <h2 className="font-accent text-sm uppercase tracking-wider text-tfm-secondary">
          {subtitle}
        </h2>
        <h3 className="font-brand text-4xl text-tfm-primary sm:text-5xl">
          {title}
        </h3>
        <p className="mt-3 text-lg text-gray-500">{description}</p>
        <Features features={features} />
      </div>
    </div>
  );
}

export default function LandingPageOffering({
  hideConnect = false,
  hideCompass = false,
}) {
  return (
    <div className="overflow-hidden py-16 lg:py-24">
      <div className="relative mx-auto max-w-xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        {hideConnect ? null : (
          <Workshop
            subtitle="A unique Membership"
            title="Strengthen the Foundation"
            description="Every client starts with our signature series of sessions, a way to apply an intentional strategy to the most valuable asset in your life. These first eight sessions are designed to help heads of households define their family's success."
            img="/img/coach_with_couple_alt.jpg"
            imgWidth={500}
            imgAlt="Coach with Couple on Video Call"
            imgSwap={true}
            features={strategyFeatures}
          />
        )}
        <WorkshopsList
          workshops={[
            {
              title: "Family Welcome",
              description: "We seek to understand before being understood.",
              img: "/img/Welcome_horizontal.png",
            },
            {
              title: "Vision",
              description:
                "What does success look like in your most important roles?",
              img: "/img/Vision_horizontal.png",
            },
            {
              title: "Values",
              description:
                "Values come first, and all else follows - in business, in career, and in life.",
              img: "/img/Values-horizontal.png",
            },
            {
              title: "Social Fitness",
              description:
                "Time spent discussing your most important relationships.",
              img: "/img/SocialFitness_horizontal.png",
            },
            {
              title: "Family Coaching",
              description:
                "Dynamic sessions to help you stay on track and grow together.",
              img: "/img/Communication.png",
            },
            {
              title: "Family Coaching",
              description:
                "Dynamic sessions to help you stay on track and grow together.",
              img: "/img/Communication.png",
            },
            {
              title: "Family Coaching",
              description:
                "Dynamic sessions to help you stay on track and grow together.",
              img: "/img/Communication.png",
            },
            {
              title: "Family Coaching",
              description:
                "Dynamic sessions to help you stay on track and grow together.",
              img: "/img/Communication.png",
            },
            // {
            //   title: "Rituals",
            //   description: "The traditions and moments most special to us.",
            //   img: "/img/Rituals.png",
            // },
            // {
            //   title: "Favorite Things",
            //   description: "The little things matter.",
            //   img: "/img/Favorite Things.png",
            // },
            // {
            //   title: "Meant to Live",
            //   description: "Never stop planning for the future.",
            //   img: "/img/Meant to Live.png",
            // },
          ]}
        />
        {hideCompass ? null : (
          <Workshop
            subtitle="Intentional Software"
            title="Capture your Story"
            description="We've built a software platform to help you stay on track. Your entire journey with TFM is stored in one place."
            img="/img/tfm-platform-screenshot.png"
            imgWidth={390}
            imgAlt="tfm app screenshot"
            screenshot={true}
            features={implementationFeatures}
          />
        )}
      </div>
    </div>
  );
}
