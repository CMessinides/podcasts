import React from "react";
import { Store, createStore, applyMiddleware } from "redux";
import { State, Action } from "../store/types";
import { Provider } from "react-redux";
import podcastApp from "../store/reducers";
import thunkMiddleware from "redux-thunk";
import Router from "./Router";
import { ThemeProvider } from "../styles/styled-components";
import theme from "../styles/theme";

const store: Store<State, Action> = createStore(
  podcastApp,
  applyMiddleware(thunkMiddleware)
);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router />
      </Provider>
    </ThemeProvider>
  );
}
