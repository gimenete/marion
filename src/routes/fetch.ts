import type { RequestHandler } from "@sveltejs/kit";
import { fetchData } from "../actions";
import { getAppState } from "../appState";
import type { FetchDataRequest } from "../types";

export const post: RequestHandler = async ({ body }) => {
  const json = JSON.parse(body.toString());

  if (typeof json.duration !== "number") {
    return { body: { error: "Invalid input" }, status: 400 };
  }

  const fetchRequest = json as FetchDataRequest;
  fetchData(fetchRequest);

  const state = getAppState();

  return {
    body: state,
  };
};
