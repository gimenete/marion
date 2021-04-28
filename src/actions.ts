import type { ActionState, CPURequest, MemoryRequest } from "./types";

export let actionState: ActionState = { type: "idle" };

let timeout: NodeJS.Timeout | null = null;

/**
 * Fill an array with amount MB for duration ms
 */
export const eatMemory = (req: MemoryRequest): void => {
  clearActions();
  actionState = { type: "memory", started: new Date().getTime(), req };

  timeout = setTimeout(() => clearActions(), req.duration);
};

/**
 * Burn CPU for duration ms
 */
export const burnCPU = (req: CPURequest): void => {
  clearActions();
  actionState = { type: "cpu", started: new Date().getTime(), req };

  timeout = setTimeout(() => clearActions(), req.duration);
};

/**
 * Rest actions back to idle
 */
export const clearActions = (): void => {
  if (timeout != null) clearTimeout(timeout);

  // Clear memory

  // Stop computing CPU

  // Reset action state
  actionState = { type: "idle" };
};
