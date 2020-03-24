import React from "react";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";

const dataMachine = Machine({
  id: "signdataMachineIn",
  initial: "loading",
  context: {
    data: [],
    flag: true
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
        }
      },
      on: {
        DONE_MORE: {
          target: "more",
          actions: assign({
            data: (context, event) => [...context.data, ...event.newData],
            flag: false
          })
        },
        DONE_COMPLETE: {
          target: "complete",
          actions: assign({
            data: (context, event) => [...event.newData]
          })
        },
        FAIL: "failure"
      }
    },
    more: {
      on: {
        LOAD: "loading"
      }
    },
    complete: {
      type: "final"
    },
    failure: {
      type: "final"
    }
  }
});

function App() {
  const [current, send] = useMachine(dataMachine);
  const { data } = current.context;
  return (
    <div className="App">
      <ul>
        {data.map(item => {
          return <li key={item}>{item}</li>;
        })}
        {current.matches("loading") && <li>Loading...</li>}
        {current.matches("more") && (
          <li>
            <button
              onClick={() => {
                send("LOAD");
              }}
            >
              Load More
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default App;
