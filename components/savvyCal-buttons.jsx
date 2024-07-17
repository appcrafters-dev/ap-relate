import { CalendarDaysIcon, CalendarIcon } from "@heroicons/react/20/solid";
import { Button, LinkButton } from "@/components/ui/buttons";

export default function SavvyCalButtons({ session, advisors }) {
  function getAdvisorSlug(advisor) {
    // find advisor savvycal_slug based on name
    const advisorSlug = advisors.find((a) => a.name === advisor)?.savvycal_slug;
    return advisorSlug;
  }

  return session.status === "Planned" ? (
    <Button
      primary={true}
      onClick={async () => {
        try {
          SavvyCal("open", {
            link: getAdvisorSlug(session.family_advisor),
            metadata: {
              from: session.planned_for_starts_on,
              session_name: session.name,
            },
            theme: "light",
          });
        } catch (error) {
          // if Error: "SavvyCal is not initialized" then initialize SavvyCal
          if (error.message === "SavvyCal is not initialized") {
            SavvyCal("init");
            SavvyCal("open", {
              link: getAdvisorSlug(session.family_advisor),
              metadata: {
                session_name: session.name,
                from: session.planned_for_starts_on,
              },
              theme: "light",
            });
          } else {
            alert(error);
          }
        }
      }}
    >
      <CalendarIcon className="mr-2 h-5 w-5" />
      Schedule
    </Button>
  ) : session.savvycal_event_url ? (
    <LinkButton href={session.savvycal_event_url} small>
      <CalendarDaysIcon className="mr-2 h-5 w-5" />
      Reschedule / Cancel
    </LinkButton>
  ) : null;
}
