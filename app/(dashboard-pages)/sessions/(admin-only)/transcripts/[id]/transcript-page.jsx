function convertToDuration(seconds) {
  const date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}

export default function Transcript({ cues }) {
  // Display the parsed .vtt file
  return (
    <div className="space-y-2">
      {cues.map((cue, index) => (
        <div key={index}>
          <p className="prose" dangerouslySetInnerHTML={{ __html: cue.text }} />
          <p className="text-xs text-gray-500">
            {convertToDuration(cue.start)}
          </p>
        </div>
      ))}
    </div>
  );
}
