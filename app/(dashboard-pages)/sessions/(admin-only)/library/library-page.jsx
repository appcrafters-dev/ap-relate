"use client";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { TfmFormColumns, TfmFormSelect } from "@/components/ui/forms";
import { LinkSignpost } from "@/components/ui/buttons";
import { DescriptionList } from "../../[name]/family-workshop";

function SessionCard({ session, selectSession }) {
  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded pb-12 pt-36 shadow-xl transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
      onClick={() => selectSession(session)}
    >
      {session.image_url ? (
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={session.image_url}
          alt="session image"
        />
      ) : null}
      <div className="absolute inset-0 bg-tfm-secondary bg-opacity-30 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-tfm-secondary via-tfm-sand opacity-80" />
      <div className="relative px-8">
        <h3 className="mt-8 text-xl transition-all duration-300 ease-in-out group-hover:text-2xl">
          <div className="relative font-brand font-bold tracking-wide text-white  md:flex-grow">
            {session.title}
          </div>
        </h3>
      </div>
    </div>
  );
}

export default function SessionLibrary({ sessions }) {
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [selectedLifePhase, setSelectedLifePhase] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  // create a list of each unique `total_family_framework` value
  const frameworkOptions = [
    ...new Set(sessions.map((session) => session.total_family_framework)),
  ];

  // create a list of each unique `life_phases` value. `life_phases` is an array of objects, we need to get the `life_phase` property from each object
  const lifePhaseOptions = [
    ...new Set(
      sessions
        .map((session) => session.life_phases.map((lp) => lp.title))
        .flat()
    ),
  ];

  const filteredSessions = sessions.filter((session) => {
    const frameworkMatches = selectedFramework
      ? session.total_family_framework === selectedFramework
      : true;
    const lifePhaseMatches = selectedLifePhase
      ? session.life_phases.some((lp) => lp.title === selectedLifePhase)
      : true;
    return frameworkMatches && lifePhaseMatches;
  });

  const closeModal = () => {
    setSelectedSession(null);
  };

  return (
    <>
      <h1 className="pb-4 text-2xl font-semibold text-gray-900">
        Session Library
      </h1>

      <div className="space-y-8">
        {/* filter navigation */}
        <div className="max-w-2xl">
          <TfmFormColumns>
            <TfmFormSelect
              label="Framework"
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
            >
              <option value="">View All</option>
              {frameworkOptions
                .filter((framework) => framework)
                .map((framework) => (
                  <option key={framework} value={framework}>
                    {framework}
                  </option>
                ))}
            </TfmFormSelect>
            <TfmFormSelect
              label="Life Phase"
              value={selectedLifePhase}
              onChange={(e) => setSelectedLifePhase(e.target.value)}
            >
              <option value="">Any</option>
              {lifePhaseOptions.map((lifePhase) => (
                <option key={lifePhase} value={lifePhase}>
                  {lifePhase}
                </option>
              ))}
            </TfmFormSelect>
          </TfmFormColumns>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {filteredSessions.length ? (
            filteredSessions
              .sort(
                // sort by session number, if available
                (a, b) => a.number - b.number
              )
              .map((session) => (
                <SessionCard
                  key={session.name}
                  session={session}
                  selectSession={setSelectedSession}
                />
              ))
          ) : (
            <div className="text-gray-500">No sessions</div>
          )}
        </div>

        {selectedSession && (
          <Dialog
            open={!!selectedSession}
            onClose={closeModal}
            className="fixed inset-0 z-10 overflow-y-auto"
          >
            <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

              <span
                className="hidden sm:inline-block sm:h-screen sm:align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div className="inline-block transform overflow-hidden rounded bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
                <Dialog.Title className="bg-gray-100 px-4 py-5 text-2xl font-semibold text-tfm-primary-900 sm:px-6">
                  {selectedSession.title} - {selectedSession.number}
                </Dialog.Title>

                <div className="bg-white px-4 py-5 sm:p-6">
                  {selectedSession.image_url ? (
                    <img
                      className="mb-8 rounded-xl"
                      src={selectedSession.image_url}
                      alt="session image"
                    />
                  ) : null}

                  <div
                    className="prose -mt-4 mb-4 max-w-none border-b text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: selectedSession.description.replace(
                        /class=".*?"/g,
                        ""
                      ),
                    }}
                  />

                  {DescriptionList({
                    Product: selectedSession.tfm_product,
                    Framework: selectedSession.total_family_framework,
                    "Life Phases": selectedSession.life_phases.length
                      ? selectedSession.life_phases
                          .map((phase) => phase.title)
                          .join(", ")
                      : null,
                    Presentation: selectedSession.presentation ? (
                      <LinkSignpost
                        href={selectedSession.presentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Open &rarr;
                      </LinkSignpost>
                    ) : null,
                    // Status: selectedSession.status,
                    // "Last Updated": prettyDate(selectedSession.modified),
                  })}
                </div>

                <div className="flex justify-center bg-gray-100 p-4">
                  {/* simple button */}
                  <button
                    type="button"
                    className="block font-brand text-sm font-semibold uppercase tracking-wider text-tfm-primary-900 hover:underline"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </>
  );
}
