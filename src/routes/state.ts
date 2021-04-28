import type { RequestHandler } from "@sveltejs/kit";
import { getAppState } from "../appState";

export const get: RequestHandler = async () => {
  return {
    body: getAppState(),
  };
};
