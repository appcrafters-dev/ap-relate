"use client";

import Logo from "@/components/logo";
import { Call } from "@/components/video-call";
import VideoCallMessage from "@/components/video-call-layout";
import { useState } from "react";

export default function RoomPage({ roomName, session, token }) {
  const [room, setRoom] = useState(roomName);
  const [showReview, setShowReview] = useState(false);
  const [userName, setUserName] = useState("");
  const [callFrame, setCallFrame] = useState(null);

  const [showWelcome, setShowWelcome] = useState(true);
  const [message, setMessage] = useState({
    text: "Please wait while we load the meeting",
    title: "Loading...",
  });

  // return <VideoCallReview room={roomName} />;

  return room ? (
    <main className="flex min-h-screen w-full flex-col space-y-4">
      {showWelcome && <Welcome session={session} />}
      {room && (
        <Call
          room={room}
          token={token}
          setRoom={setRoom}
          setMessage={setMessage}
          callFrame={callFrame}
          setCallFrame={setCallFrame}
          setShowWelcome={setShowWelcome}
          setShowReview={setShowReview}
          setUserName={setUserName}
        />
      )}
    </main>
  ) : (
    <VideoCallMessage
      show={true}
      message={message.text}
      title={message.title}
      room={roomName}
      showReview={showReview}
      userName={userName}
    />
  );
}

function Welcome({ session }) {
  return (
    <div className="z-10 flex w-full flex-col items-center justify-between gap-4 bg-tfm-bg p-4 pb-0 md:inline-flex">
      <Logo width={150} height={20} />
      <div>
        <h1 className="text-center text-2xl font-bold text-gray-800">
          {session.title}
        </h1>
        <p className="text-center text-gray-600">
          With The {session.family.family_name} Family
        </p>
      </div>
    </div>
  );
}
