import React from "react";
import { Store, createStore, applyMiddleware } from "redux";
import { State, Action, ActionCreators } from "./store/types";
import createPodcastView from "./components/podcasts/Podcast";
import { Provider } from "react-redux";
import podcastApp from "./store/reducers";
import thunkMiddleware from "redux-thunk";

interface AppProps {
  actions: ActionCreators;
}

export default function App({ actions }: AppProps) {
  const store: Store<State, Action> = createStore(
    podcastApp,
    applyMiddleware(thunkMiddleware)
  );

  const PodcastView = createPodcastView(actions);
  return (
    <Provider store={store}>
      <PodcastView ID={1109271715} />
    </Provider>
  );
}
