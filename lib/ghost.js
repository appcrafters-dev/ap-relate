import GhostContentAPI from "@tryghost/content-api";

const api = new GhostContentAPI({
  url: process.env.GHOST_URL,
  key: process.env.GHOST_KEY,
  makeRequest: ({ url, method, params, headers }) => {
    const apiUrl = new URL(url);
    // @ts-ignore
    Object.keys(params).map((key) => {
      if (key === "include" || key === "filter") {
        apiUrl.searchParams.set(key, params[key]);
      } else {
        apiUrl.searchParams.set(key, encodeURIComponent(params[key]));
      }
    });

    return fetch(apiUrl.toString(), { method, headers })
      .then(async (res) => {
        // Check if the response was successful.
        if (!res.ok) {
          // You can handle HTTP errors here
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return { data: await res.json() };
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  },
  version: "v5.0",
});

export async function getPosts({ filter = "", limit = "all" || 3 } = {}) {
  return await api.posts
    .browse({
      filter,
      include: "tags",
      limit,
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function getTag(tag) {
  return await api.tags
    .read(
      {
        slug: tag,
      },
      {
        include: "count.posts",
      }
    )
    .catch((err) => {
      console.error(err);
    });
}

export async function getSinglePost(postSlug) {
  return await api.posts
    .read(
      {
        slug: postSlug,
      },
      {
        include: "authors,tags",
      }
    )
    .catch((err) => {
      console.error(err);
    });
}

export async function getSinglePage(pageSlug) {
  return await api.pages
    .read({
      slug: pageSlug,
    })
    .catch((err) => {
      console.error(err);
    });
}
