import React from "react";
import { Store, createStore, applyMiddleware } from "redux";
import { State, Action } from "../store/types";
import { Provider } from "react-redux";
import podcastApp from "../store/reducers";
import thunkMiddleware from "redux-thunk";
import Router from "./Router";

const store: Store<State, Action> = createStore(
  podcastApp,
  applyMiddleware(thunkMiddleware)
);

export default function App() {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}
