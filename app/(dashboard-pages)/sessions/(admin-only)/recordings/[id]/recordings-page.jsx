"use client";

import { useEffect, useRef, useState } from "react";
import { Button, LinkButton } from "@/components/ui/buttons";
import {
  ArrowDownTrayIcon,
  PencilIcon,
  ShareIcon,
} from "@heroicons/react/20/solid";
import Badge from "@/components/ui/badge";
import { classNames } from "lib/utils";

function convertToDuration(seconds) {
  const date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}

function combineConsecutiveCues(transcriptCues) {
  const combinedCues = [];
  let currentCue = null;

  for (const cue of transcriptCues) {
    const speakerMatch = cue.text.match(/<v>(.+):<\/v>/);
    const speaker = speakerMatch ? speakerMatch[1] : null;

    if (currentCue && currentCue.speaker === speaker) {
      // If the speaker is the same, extend the current cue
      currentCue.end = cue.end;
      currentCue.text += " " + cue.text.replace(/<v>.+<\/v>/, "");
    } else {
      // If the speaker is different, start a new cue
      currentCue = {
        start: cue.start,
        end: cue.end,
        text: cue.text,
        speaker,
      };
      combinedCues.push(currentCue);
    }
  }

  return combinedCues;
}

export default function RecordingPage({
  recordingAccessLink,
  transcriptCues = [],
  sessionData,
}) {
  const videoRef = useRef(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentCue, setCurrentCue] = useState(null);
  const [isButtonFixed, setIsButtonFixed] = useState(false);

  const isCustomBucket = recordingAccessLink.includes(
    "relate-video-recordings"
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsButtonFixed(true);
      } else {
        setIsButtonFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = recordingAccessLink;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.ontimeupdate = () => {
          const currentCue = transcriptCues.find(
            (cue) =>
              videoRef.current.currentTime >= cue.start &&
              videoRef.current.currentTime <= cue.end
          );
          setCurrentCue(currentCue);
        };
      };
      if (isCustomBucket) {
        videoRef.current.setAttribute("controlsList", "nodownload");
      }
    }
  }, [videoRef, recordingAccessLink, transcriptCues, isCustomBucket]);

  const combinedCues = combineConsecutiveCues(transcriptCues);

  return (
    <section className="relative space-y-4">
      <video ref={videoRef} controls className="w-full rounded" />
      <div className="inline-flex w-full flex-wrap justify-between space-x-4">
        <div className="space-y-2">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopySuccess(true);
              setTimeout(() => {
                setCopySuccess(false);
              }, 3600);
            }}
            Icon={ShareIcon}
          >
            Copy URL to Share
          </Button>
          {copySuccess && (
            <Badge color="green">Link copied to clipboard!</Badge>
          )}
        </div>
        <Button
          onClick={() => window.open(recordingAccessLink)}
          Icon={ArrowDownTrayIcon}
        >
          Download Video
        </Button>
      </div>
      <h2 className="font-brand text-4xl font-medium">Transcript</h2>
      <div className="space-y-2">
        {combinedCues.map((cue, index) => (
          <div key={index} className="group-ho group flex space-x-2">
            <button
              className={classNames(
                "transition-all duration-500 hover:underline",
                cue === currentCue ? "text-tfm-primary" : "text-gray-500"
              )}
              onClick={() => (videoRef.current.currentTime = cue.start)}
            >
              {convertToDuration(cue.start)}
            </button>
            <p
              className={classNames(
                "prose rounded-md p-1 px-2 transition-colors duration-500",
                cue === currentCue && "bg-amber-100"
              )}
              dangerouslySetInnerHTML={{ __html: cue.text }}
            />
            <div className="invisible group-hover:visible">
              <LinkButton
                href={`/family/${
                  sessionData.family.id
                }/quotes/new?quote=${encodeURI(
                  cue.text.split(/<v>.+<\/v>/)[1]
                )}&date=${encodeURI(
                  new Date(sessionData.scheduled_time)
                    .toISOString()
                    .split("T")[0]
                )}`}
                extraSmall
                Icon={PencilIcon}
                newTab
              >
                Create Quote
              </LinkButton>
            </div>
          </div>
        ))}
        {!transcriptCues.length && (
          <p>Sorry, no transcript available for this recording.</p>
        )}
      </div>
      {isButtonFixed && document.pictureInPictureEnabled && (
        <div className="fixed bottom-4 right-4">
          <Button
            small
            fullWidth
            primary
            onClick={async () => {
              if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
              } else if (document.pictureInPictureEnabled) {
                try {
                  await videoRef.current.requestPictureInPicture();
                } catch (error) {
                  console.error(
                    `Failed to enter Picture-in-Picture mode: ${error}`
                  );
                }
              }
            }}
            className="fixed bottom-4 right-4 transition-all duration-500"
          >
            Toggle Picture-in-Picture
          </Button>
        </div>
      )}
    </section>
  );
}
