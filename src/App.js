import React from "react";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { fetchMachine } from "./machine/fetch";
const dataMachine = Machine({
  id: "signdataMachineIn",
  initial: "loading",
  context: {
    data: [],
    flag: true,
  },
  states: {
    loading: {
      invoke: {
        src: (context, _event) => {
          return (callback, _onReceive) => {
            setTimeout(() => {
              const newData = [2, 3, 4, 5, 6, 7];

              if (context.flag) {
                callback({ type: "DONE_MORE", newData: [2, 3] });
              } else {
                callback({ type: "DONE_COMPLETE", newData });
              }
            }, 1000);
          };
        },
      },
      on: {
        DONE_MORE: {
          target: "more",
          actions: assign({
            data: (context, event) => [...context.data, ...event.newData],
            flag: false,
          }),
        },
        DONE_COMPLETE: {
          target: "complete",
          actions: assign({
            data: (context, event) => [...event.newData],
          }),
        },
        FAIL: "failure",
      },
    },
    more: {
      on: {
        LOAD: "loading",
      },
    },
    complete: {
      type: "final",
    },
    failure: {
      type: "final",
    },
  },
});

function App() {
  const [fetchState, sendToFetchMachine] = useMachine(fetchMachine, {
    actions: {
      fetchData: (ctx, event) => {
        fetch(" https://pokeapi.co/api/v2/pokemon/ditto")
          .then((res) => {
            sendToFetchMachine({ type: "RESOLVE", data: res });
          })
          .catch((e) => {
            sendToFetchMachine({ type: "REJECT", data: e.message });
          });
      },
    },
  });
  return (
    <div className="App">
      <button onClick={() => sendToFetchMachine({ type: "FETCH" })}>
        send
      </button>
      {fetchState.matches("pending") && <div>Loading...</div>}
      {fetchState.matches("successful") && <div>Done</div>}
    </div>
  );
}

export default App;
