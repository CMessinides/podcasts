import { combineReducers, Reducer } from "redux";
import podcasts from "./podcasts/reducer";
import { Action, PodcastState, State } from "./types";

const podcastApp = combineReducers<State, Action>({
  podcasts: podcasts as Reducer<PodcastState, Action>
});

export default podcastApp;
