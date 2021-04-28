import type { RequestHandler } from "@sveltejs/kit";
import { eatMemory } from "../actions";
import { getAppState } from "../appState";
import type { MemoryRequest } from "../types";

export const post: RequestHandler = async ({ body }) => {
  const json = JSON.parse(body.toString());

  if (typeof json.amount !== "number" || typeof json.duration !== "number") {
    return { body: { error: "Invalid input" }, status: 400 };
  }

  const memoryRequest = json as MemoryRequest;
  eatMemory(memoryRequest);

  const state = getAppState();

  return {
    body: state,
  };
};
