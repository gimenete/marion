import type { RequestHandler } from "@sveltejs/kit";
import { clearActions } from "../actions";
import { getAppState } from "../appState";

export const post: RequestHandler = async () => {
  console.log("Clearing actions");

  clearActions();
  const state = getAppState();

  return { body: state };
};
