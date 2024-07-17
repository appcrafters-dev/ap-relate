import DescriptionBlurb from "./components/description-blurb";
import FullWidthPromo from "./components/full-width-promo";
import LandingPageOffering from "./components/landing-page-offering";
import Pricing from "./components/pricing";

export default async function Page() {
  return (
    <div>
      <FullWidthPromo
        {...{
          title: "Private Family Coaching",
          subtitle: "A meaningful way to support your favorite team",
          buttons: [
            {
              href: "/join",
              text: "Get Started →",
              primary: true,
            },
          ],
        }}
      />
      <DescriptionBlurb />
      <LandingPageOffering />
      <Pricing />
    </div>
  );
}
