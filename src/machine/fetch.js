import { Machine, assign } from "xstate";

export const fetchMachine = Machine(
  {
    id: "fetch",
    initial: "idle",
    context: {
      data: [],
      error: null,
    },
    states: {
      idle: {
        on: {
          FETCH: "pending",
        },
      },
      pending: {
        entry: ["fetchData"],
        on: {
          RESOLVE: { target: "successful", actions: ["setData"] },
          REJECT: { target: "failed", actions: ["setError"] },
        },
      },
      failed: {
        on: {
          FETCH: "pending",
        },
      },
      successful: {
        on: {
          FETCH: "pending",
        },
      },
    },
  },
  {
    actions: {
      setData: assign((ctx, event) => {
        return {
          data: event.data,
        };
      }),
      setError: assign((ctx, event) => {
        return {
          error: event.eror,
        };
      }),
    },
  }
);
