import React from "react";
import { connect } from "react-redux";
import { State, Action, FetchFeedAction } from "../../store/types";
import { ApplicationError, Episode, isComplete } from "../../types";
import { ThunkDispatch } from "redux-thunk";
import actions from "../actions";
import { Component } from "react";

interface BasePropsFromState {
  pending?: boolean;
  error?: ApplicationError;
  lastUpdated?: number;
  episodes?: Episode[];
}

interface BaseProps extends BasePropsFromState {
  fetchFeed(podcastID: number): Promise<FetchFeedAction>;
}

export class PodcastEpisodesListBase extends Component<BaseProps> {
  render() {
    return null;
  }
}

const mapStateToProps = (
  state: State,
  { podcastID }: { podcastID: number }
) => {
  const podcast = state.podcasts[podcastID];

  if (podcast === undefined || !isComplete(podcast)) {
    return {} as BasePropsFromState;
  }

  const feed = podcast.data.feed;
  return {
    pending: feed.pending,
    error: feed.error,
    lastUpdated: feed.lastUpdated,
    episodes: isComplete(feed) ? feed.data.episodes : undefined
  };
};
const mapDispatchToProps = (dispatch: ThunkDispatch<State, null, Action>) => {
  return {
    fetchFeed(podcastID: number) {
      return dispatch(actions.fetchFeed(podcastID));
    }
  };
};

const PodcastEpisodesList = connect(
  mapStateToProps,
  mapDispatchToProps
)(PodcastEpisodesListBase);

export default PodcastEpisodesList;
