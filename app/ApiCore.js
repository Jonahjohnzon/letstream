import axios from "axios";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MOVIELINK,
  timeout: 15000,
});

client.defaults.headers.common["Authorization"] = process.env.NEXT_PUBLIC_BEARER;
client.defaults.headers.common["accept"] = "application/json";

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // No response at all = network error, timeout, CORS, offline, etc.
    // There's nothing to read a status code off of, so this has to be
    // handled before anything below touches `error.response`.
    if (!error.response) {
      return Promise.reject(
        new ApiError(error.message || "Network error — check your connection.", 0)
      );
    }

    const status = error.response.status;

    // These two are full-page redirects, not just failed calls — a 404 or
    // 403 from the API generally means "this whole page can't exist",
    // rather than "this one panel on the page failed".
    if (status === 404) {
      if (typeof window !== "undefined") window.location.href = "/not-found";
      return Promise.reject(new ApiError("Not found", status));
    }
    if (status === 403) {
      if (typeof window !== "undefined") window.location.href = "/access-denied";
      return Promise.reject(new ApiError("Access forbidden", status));
    }

    const message =
      (error.response.data && error.response.data["message"]) ||
      (status === 401 ? "Invalid credentials" : null) ||
      error.message ||
      "Something went wrong.";

    return Promise.reject(new ApiError(message, status));
  }
);

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export default class Apicore {
  async get(endpoint, queryParams = {}) {
    // Deliberately NOT catching here. Swallowing the error and returning
    // undefined meant every caller had to remember to optional-chain every
    // single field forever, and a failed call looked identical to an empty
    // result. Callers decide how to degrade (see Home.jsx using
    // Promise.allSettled) — this just does the fetch.
    const response = await client.get(endpoint, { params: queryParams });
    return response.data;
  }
}

// Most call sites don't need their own instance — the class has no
// per-instance state. Import this where you just want to make a call:
//   import { api } from "./ApiCore";
//   api.get("/3/trending/movie/day")
export const api = new Apicore();