export type ActionState =
  | {
      type: "idle";
    }
  | {
      type: "memory";
      started: number;
      req: MemoryRequest;
    }
  | {
      type: "cpu";
      started: number;
      req: CPURequest;
    }
  | {
      type: "fetch";
      started: number;
      req: FetchDataRequest;
    };

export interface AppState {
  startDate: string;
  actionState: ActionState;
  envs: Record<string, string>;
}

export interface MemoryRequest {
  amount: number;
  duration: number;
}

export interface CPURequest {
  duration: number;
}

export interface FetchDataRequest {
  duration: number;
}
