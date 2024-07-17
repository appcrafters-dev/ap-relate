export async function sendEmailWithTemplate(args) {
  const url = "https://api.postmarkapp.com/email/withTemplate";
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN,
    },
    body: JSON.stringify({
      ...args,
      From: "notifications@totalfamily.io",
      MessageStream: "outbound",
    }),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Postmark API error: ${errorData.Message}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
