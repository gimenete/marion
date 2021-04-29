import type { ActionState, CPURequest, MemoryRequest } from "./types";
import crypto from "crypto";

export let actionState: ActionState = { type: "idle" };

let timeout: NodeJS.Timeout | null = null;

let shouldBurn = false;

const MAX_BUFFER_SIZE = 2000000000;
let buffers: Buffer[] = [];

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
        //
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
  buffers = [];

  // Stop computing CPU
  shouldBurn = false;

  // Reset action state
  actionState = { type: "idle" };
};
