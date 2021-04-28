import type { ActionState, CPURequest, MemoryRequest } from "./types";

export let actionState: ActionState = { type: "idle" };

let timeout: NodeJS.Timeout | null = null;

let shouldBurn = false;

/**
 * Fill an array with amount MB for duration ms
 */
export const eatMemory = (req: MemoryRequest): void => {
  clearActions();

  console.log("Eating memory", req);
  actionState = { type: "memory", started: new Date().getTime(), req };

  timeout = setTimeout(() => {
    console.log("Memory feast finished");
    clearActions();
  }, req.duration * 1000);
};

/**
 * Burn CPU for duration ms
 */
export const burnCPU = (req: CPURequest): void => {
  clearActions();

  console.log("Burning CPU", req);
  actionState = { type: "cpu", started: new Date().getTime(), req };
  timeout = setTimeout(() => {
    console.log("CPU burn finished");
    clearActions();
  }, req.duration * 1000);

  shouldBurn = true;

  setTimeout(async () => {
    // Every 100ms await so we have a chance to stop
    let t = new Date().getTime();

    while (shouldBurn) {
      if (new Date().getTime() - t > 100) {
        await new Promise(r => setTimeout(r, 0));
        t = new Date().getTime();
      }
    }
  }, 0);
};

/**
 * Rest actions back to idle
 */
export const clearActions = (): void => {
  if (timeout != null) clearTimeout(timeout);

  // Clear memory

  // Stop computing CPU
  shouldBurn = false;

  // Reset action state
  actionState = { type: "idle" };
};
