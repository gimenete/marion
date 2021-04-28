import type { RequestHandler } from "@sveltejs/kit";
import { burnCPU } from "../actions";
import { getAppState } from "../appState";
import type { CPURequest } from "../types";

export const post: RequestHandler = async ({ body }) => {
  const json = JSON.parse(body.toString());

  if (typeof json.duration !== "number") {
    return { body: { error: "Invalid input" }, status: 400 };
  }

  const cpuRequest = json as CPURequest;
  burnCPU(cpuRequest);

  const state = getAppState();

  return {
    body: state,
  };
};
