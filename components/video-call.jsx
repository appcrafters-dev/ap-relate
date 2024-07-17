import { useCallback, useEffect, useRef } from "react";
import DailyIframe from "@daily-co/daily-js";

const CALL_OPTIONS = {
  iframeStyle: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  showLeaveButton: true,
  showFullscreenButton: false,
  theme: {
    colors: {
      accent: "#002244",
      accentText: "#FFFFFF",
      backgroundAccent: "#faf8f0",
      mainAreaBg: "#001b36",
      mainAreaBgAccent: "#002244",
    },
  },
};

export function Call({
  room,
  token,
  setRoom,
  callFrame,
  setCallFrame,
  setMessage,
  setShowWelcome,
  setShowReview,
  setUserName,
}) {
  const callRef = useRef(null);

  const createAndJoinCall = useCallback(() => {
    const newCallFrame = DailyIframe.createFrame(
      callRef?.current,
      CALL_OPTIONS
    );

    setCallFrame(newCallFrame);

    newCallFrame.join({
      url: "https://totalfamily.daily.co/" + room,
      token: token ? token : "",
    });

    const leaveCall = () => {
      setRoom(null);
      setMessage({
        text: "You left the session",
        title: "Goodbye!",
      });
      if (!token) setShowReview(true);
      setCallFrame(null);
      callFrame.destroy();
    };

    newCallFrame.on("joined-meeting", () => {
      setShowWelcome(false);
      setUserName(newCallFrame.participants().local.user_name);
    });

    newCallFrame.on("left-meeting", leaveCall);
  }, [room, setCallFrame]);

  /**
   * Initiate Daily iframe creation on component render if it doesn't already exist
   */
  useEffect(() => {
    if (callFrame) return;

    createAndJoinCall();
  }, [callFrame, createAndJoinCall]);

  return <div ref={callRef} />;
}
