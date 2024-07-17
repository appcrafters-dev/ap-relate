import { DocumentTextIcon, PlayIcon } from "@heroicons/react/20/solid";
import { LinkButton } from "@/components/ui/buttons";

function NoResults() {
  return <p className="text-sm text-gray-500">None found</p>;
}

export default function ListRecordings({ recordings }) {
  const { data = [], transcripts = [] } = recordings || {};

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Recordings</h2>
      <ul className="flex flex-wrap gap-4">
        {data.map((recording, idx) => (
          <li
            key={recording.id}
            className="flex w-full max-w-sm flex-col space-y-4 rounded bg-white p-4 shadow-sm"
          >
            <h2 className="font-semibold">Recording #{idx + 1}</h2>
            <div className="flex w-full items-center justify-between gap-2">
              <span className="text-sm text-gray-500">
                Duration: {Math.ceil(recording.duration / 60)} Min
              </span>
              <span className="text-sm text-gray-500">
                Participants: {recording.max_participants}
              </span>
            </div>
            <LinkButton primary href={"/sessions/recordings/" + recording.id}>
              <PlayIcon className="mr-2 h-5 w-5" />
              Watch
            </LinkButton>
          </li>
        ))}
        {data.length === 0 && <NoResults />}
      </ul>
      {data.length === 0 && (
        <>
          <h2 className="pt-8 text-2xl font-semibold">Transcripts</h2>
          <ul className="flex flex-wrap gap-4">
            {transcripts.map((transcript, idx) => (
              <li
                key={idx}
                className="flex w-full max-w-sm flex-col space-y-4 rounded bg-white p-4 shadow-sm"
              >
                <h2 className="font-semibold">Transcript #{idx + 1}</h2>
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-sm text-gray-500">
                    Duration: {Math.ceil(transcript.duration / 60)} Min
                  </span>
                </div>
                <LinkButton
                  primary
                  href={"/sessions/transcripts/" + transcript.transcriptId}
                >
                  <DocumentTextIcon className="mr-2 h-5 w-5" />
                  Read
                </LinkButton>
              </li>
            ))}
            {transcripts.length === 0 && <NoResults />}
          </ul>
        </>
      )}
    </div>
  );
}
