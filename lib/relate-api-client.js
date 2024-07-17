const relateAPI = {
  call,
  get,
  upsert,
  post,
  put,
  delete: del,
};

export default relateAPI;

function get(endpoint) {
  return call(endpoint);
}

function upsert(endpoint, body) {
  if (body.id) return put(`${endpoint}/${body.id}`, body);

  return post(endpoint, body);
}

function post(endpoint, body) {
  return call(endpoint, { method: "POST", body });
}

function put(endpoint, body) {
  return call(endpoint, { method: "PUT", body });
}

function del(endpoint) {
  return call(endpoint, { method: "DELETE" });
}

async function call(endpoint, options = {}) {
  console.log("Calling Edge API...");
  console.debug("Endpoint: ", endpoint);
  console.debug("Options: ", options);

  console.log("Checking endpoint...");
  if (!endpoint.startsWith("/api/")) {
    if (!endpoint.startsWith("/")) {
      endpoint = `/${endpoint}`;
    }

    endpoint = `/api${endpoint}`;
  }

  const headers = options.headers || {};
  const method = options.method || "GET";
  const body = options.body ? JSON.stringify(options.body) : null;

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  options = {
    ...options,
    headers,
    method,
    body,
  };

  const res = await fetch(endpoint, options);
  if (res.ok) return { data: await res.json(), error: null };

  try {
    const data = await res.json();

    if (data.error) {
      if (typeof data.error === "object") {
        return { data: null, error: data.error.message || data.error };
      }

      if (typeof data.error === "string") {
        return { data: null, error: data.error };
      }

      return { data: null, error: "An unknown error occurred." };
    }

    return { data: null, error: data.message || res.statusText };
  } catch (error) {
    return { data: null, error: res.statusText || error.message };
  }
}
