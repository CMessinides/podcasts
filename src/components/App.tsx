import React from "react";
import { Store, createStore, applyMiddleware } from "redux";
import { State, Action, ActionCreators } from "../store/types";
import { Provider } from "react-redux";
import podcastApp from "../store/reducers";
import thunkMiddleware from "redux-thunk";
import createRouter from "./Router";

export default function createApp(actions: ActionCreators) {
  const store: Store<State, Action> = createStore(
    podcastApp,
    applyMiddleware(thunkMiddleware)
  );

  const Router = createRouter(actions);

  return function App() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  };
}
