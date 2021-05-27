import type {
  ActionState,
  CPURequest,
  FetchDataRequest,
  MemoryRequest,
} from "./types";
import crypto from "crypto";

export let actionState: ActionState = { type: "idle" };

let timeout: NodeJS.Timeout | null = null;

const MAX_BUFFER_SIZE = 2000000000;
let buffers: Buffer[] = [];

const delay = (n: number) => new Promise(r => setTimeout(r, n));

/**
 * Fetch data from GitHub website for duration ms
 * Result of data is not actually used
 */
export const fetchData = (req: FetchDataRequest): void => {
  clearActions();

  console.log("Fetching data", req);
  actionState = { type: "fetch", started: new Date().getTime(), req };

  timeout = setTimeout(() => {
    console.log("Fetching data finished");
    clearActions();
  }, req.duration * 1000);

  setTimeout(async () => {
    while (actionState.type === "fetch") {
      fetch("https://github.com");
      await delay(100);
    }
  }, 0);
};

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

  setTimeout(async () => {
    let numBytes = req.amount * 1000 * 1000;

    while (numBytes > 0) {
      const amountToAlloc = Math.min(numBytes, MAX_BUFFER_SIZE);

      const b = Buffer.alloc(amountToAlloc);
      console.log(`Filled buffer of size ${b.byteLength}`);
      crypto.randomFill(b, () => {
        // empty
      });

      buffers.push(b);

      numBytes -= amountToAlloc;
    }

    console.log(`Created ${buffers.length} buffers`);
  }, 0);
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

  setTimeout(async () => {
    // Every 100ms await so we have a chance to stop
    let t = new Date().getTime();

    while (actionState.type === "cpu") {
      if (new Date().getTime() - t > 100) {
        await delay(0);
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
  buffers = [];

  // Reset action state
  actionState = { type: "idle" };
};
