const axios = require("axios");

const { DAILY_VIDEO_SECRET, DAILY_VIDEO_URL, DAILY_VIDEO_DOMAIN_ID } =
  process.env;

// Function to make a REST request
export async function dailyApi(endpoint, data = null, method = "GET") {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${DAILY_VIDEO_SECRET}`,
  };

  const requestOptions = {
    method,
    url: `${DAILY_VIDEO_URL}${endpoint}`,
    headers,
  };

  // Only include data in the request if the method is not "GET"
  if (method !== "GET" && data !== null) {
    requestOptions.data = JSON.stringify(data);
  }

  try {
    const response = await axios(requestOptions);

    return { data: response.data, error: null };
  } catch (error) {
    const { response } = error;

    if (response) {
      const { data } = response;

      return {
        data: null,
        error: {
          status: response.status,
          statusText: response.statusText,
          message: data,
        },
      };
    }

    return { data: null, error };
  }
}

export const generateDailyToken = async (room, username, isOwner = false) => {
  const jwt = require("jsonwebtoken");

  let token = null;

  token = jwt.sign(
    {
      r: room,
      o: isOwner,
      d: DAILY_VIDEO_DOMAIN_ID,
      u: username || "Coach",
      ast: true, // auto start transcription
      sr: true, // start recording on join
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
    },
    DAILY_VIDEO_SECRET
  );

  return token;
};

export const getDailyRoom = async (roomName) => {
  const { data: room, error: roomError } = await dailyApi(`/rooms/${roomName}`);
  console.log("room", room);
  console.log("roomError", roomError);

  if (room) return { room };

  if (roomError) {
    if (roomError.status === 404) {
      const { data: newRoom, error: newRoomError } = await dailyApi(
        "/rooms",
        {
          name: roomName,
          privacy: "private",
          properties: {
            enable_knocking: true,
            enable_recording: "cloud",
            enable_transcription_storage: true,
          },
        },
        "POST"
      );

      console.log("newRoom", newRoom);
      console.log("newRoomError", newRoomError);
      if (newRoomError)
        return {
          error: "Sorry, something went wrong when creating your room.",
        };

      return { room: newRoom };
    }
    return { error: "Sorry, something went wrong when getting your room." };
  }
};

export const getDailyRoomTranscriptions = async (roomName) => {
  // Get the room ID using the room name, if it doesn't exist, return null
  const { data: room, error: roomError } = await dailyApi(`/rooms/${roomName}`);

  if (!room || roomError) return [];

  // Get the room transcription
  const { data: transcriptions, error: transcriptionsError } = await dailyApi(
    `/transcript?roomId=${room.id}`
  );
  console.log("transcription", transcriptions);
  console.log("transcriptionError", transcriptionsError);

  return transcriptions?.data || [];
};

export const getDailyRoomRecordings = async (session) => {
  // check for recordings with a room_name that matches the session.id... if none are found, then try again and check for recordings with a room_name that matches the session._frappe_id
  const { data: recordings, error: recordingsError } = await dailyApi(
    `/recordings?room_name=${session.id}`
  );

  if (recordings) return recordings;

  const { data: recordings2, error: recordingsError2 } = await dailyApi(
    `/recordings?room_name=${session._frappe_id}`
  );

  if (recordings2) return recordings2;

  if (recordingsError || recordingsError2) return [];
};
